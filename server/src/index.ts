import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import connectDB from './config/db';
import Product from './models/productModel';
import Blog from './models/blogModel';
import Order from './models/orderModel';
import Settings from './models/settingsModel';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'escensio-super-secret-key-2026';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@ecsensiofragrance.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Teamecsensio11$';

// === Connect DB ===
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.log('⚠️  MONGO_URI not set. Running in in-memory mode.');
}

// === Middleware ===
app.use(cors({ origin: '*' }));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// === Multer Config ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  }
});

// === In-Memory Fallbacks (when MongoDB is offline) ===
let memProducts: any[] = [
  { _id: 'p1', name: 'SHELLFRESH', price: 3999, category: 'Unisex', description: 'A fresh oceanic fragrance with marine undertones.', images: ['/products/perfume-1.jpg'], stock: 20, isFeatured: true, rating: 4.8, numReviews: 24, createdAt: new Date() },
  { _id: 'p2', name: 'AURA', price: 4499, category: "Women's", description: 'Floral and feminine, a timeless classic.', images: ['/products/perfume-1.jpg'], stock: 15, isFeatured: false, rating: 4.9, numReviews: 31, createdAt: new Date() },
  { _id: 'p3', name: 'STRONGER', price: 3499, category: "Men's", description: 'Bold and powerful with woody base notes.', images: ['/products/perfume-1.jpg'], stock: 10, isFeatured: false, rating: 4.7, numReviews: 18, createdAt: new Date() },
];

let memBlogs: any[] = [
  { _id: 'b1', title: 'The Art of Layering Fragrances', excerpt: 'Discover how to mix different perfumes to create a scent that is uniquely yours.', content: 'Full article content here...', category: 'Guide', image: '/hero-bg.jpg', author: 'Escensio Team', isPublished: true, slug: 'art-of-layering-fragrances', createdAt: new Date('2026-10-12') },
  { _id: 'b2', title: 'Understanding Eau de Parfum vs. Extrait', excerpt: 'Confused by concentration levels? We break down the differences.', content: 'Full article content here...', category: 'Education', image: '/products/perfume-1.jpg', author: 'Escensio Team', isPublished: true, slug: 'edp-vs-extrait', createdAt: new Date('2026-09-28') },
  { _id: 'b3', title: 'Behind the Scenes: Crafting AURA', excerpt: 'A deep dive into the creation of our best-selling women\'s fragrance.', content: 'Full article content here...', category: 'Behind the Scenes', image: '/hero-bg.jpg', author: 'Escensio Team', isPublished: true, slug: 'behind-scenes-aura', createdAt: new Date('2026-09-15') },
];

let memOrders: any[] = [
  { _id: 'o1', customer: 'Jane Smith', phone: '+92-300-1234567', address: '456 Oak St, Lahore', city: 'Lahore', paymentMethod: 'cod', total: 149, status: 'Shipped', items: [{ name: 'AURA', price: 149, quantity: 1 }], notes: '', createdAt: new Date('2026-06-18') },
  { _id: 'o2', customer: 'Ahmad Khan', phone: '+92-321-9876543', address: '789 Pine Ave, Karachi', city: 'Karachi', paymentMethod: 'bank', total: 299, status: 'Processing', items: [{ name: 'STRONGER', price: 119, quantity: 1 }, { name: 'SHELLFRESH', price: 129, quantity: 1 }], notes: '', createdAt: new Date('2026-06-20') },
];

let memSettings: any = {
  storeName: 'ESCENSIO',
  storeTagline: 'The Essence of Luxury',
  storeEmail: 'Support@ecsensiofragrance.com',
  storePhone: '+92 311 0043738',
  storeAddress: 'Wah Cantt, Pakistan',
  whatsappNumber: '923110043738',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  heroTitle: 'The Art of Scent',
  heroSubtitle: 'Crafted for those who appreciate elegance',
  announcementBar: 'Free shipping on orders over $150 | Use code ESCENSIO10 for 10% off',
  announcementEnabled: true,
  instagramUrl: '',
  facebookUrl: '',
  twitterUrl: '',
  marqueeText: 'Welcome to Escensio - The Art of Premium Perfumery',
  marqueeFontSize: '16px',
  marqueeTextColor: '#ffffff',
  marqueeBgColor: '#000000',
  heroImage: '/hero-new.jpg',
  category1Image: '/products/perfume-1.jpg',
  category2Image: '/hero-bg.jpg',
  category3Image: '/products/perfume-1.jpg',
};

const useDB = () => mongoose.connection.readyState === 1;

// ============================
// AUTH MIDDLEWARE
// ============================
const protect = (req: any, res: any, next: any) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

const adminOnly = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

// ============================
// HEALTH CHECK
// ============================
app.get('/', (req, res) => {
  res.json({ 
    message: 'Escensio API Running ✨', 
    version: '2.0.0',
    dbStatus: useDB() ? 'MongoDB Connected' : 'In-Memory Mode',
    endpoints: ['/api/products', '/api/blogs', '/api/orders', '/api/settings', '/api/users/login', '/api/upload']
  });
});

// ============================
// IMAGE UPLOAD
// ============================
app.post('/api/upload', upload.array('images', 10), (req, res) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ message: 'No images uploaded.' });
  }
  const filePaths = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
  res.json({ message: 'Images Uploaded Successfully', paths: filePaths });
});

// ============================
// AUTH ROUTES
// ============================
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  if (email && email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ _id: '1', email, role: 'admin', name: 'Admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ _id: '1', name: 'Admin', email, role: 'admin', token });
  } else if (email && password && password.length >= 4) {
    const token = jwt.sign({ _id: '2', email, role: 'customer', name: 'Customer' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ _id: '2', name: 'Customer', email, role: 'customer', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// ============================
// PRODUCT ROUTES
// ============================
// GET all products
app.get('/api/products', async (req, res) => {
  try {
    if (useDB()) {
      const products = await Product.find({}).sort({ createdAt: -1 });
      return res.json(products);
    }
    res.json(memProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET single product
app.get('/api/products/:id', async (req, res) => {
  try {
    if (useDB()) {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    }
    const product = memProducts.find(p => p._id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST create product
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, category, description, stock, images, isFeatured } = req.body;
    if (useDB()) {
      const product = new Product({
        name, price: Number(price), category, description,
        stock: Number(stock) || 0,
        images: images || ['/products/perfume-1.jpg'],
        isFeatured: isFeatured || false,
        user: new mongoose.Types.ObjectId('647a9b9f9c9d9e9f9a9b9c9d'),
      });
      const created = await product.save();
      return res.status(201).json(created);
    }
    const newProduct = {
      _id: 'p' + Date.now(),
      name, price: Number(price), category, description,
      stock: Number(stock) || 0,
      images: images || ['/products/perfume-1.jpg'],
      isFeatured: isFeatured || false,
      rating: 0, numReviews: 0,
      createdAt: new Date()
    };
    memProducts.unshift(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// PUT update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, price, category, description, stock, images, isFeatured } = req.body;
    if (useDB()) {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { name, price: Number(price), category, description, stock: Number(stock), images, isFeatured },
        { new: true }
      );
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    }
    const idx = memProducts.findIndex(p => p._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Product not found' });
    memProducts[idx] = { ...memProducts[idx], name, price: Number(price), category, description, stock: Number(stock), images, isFeatured };
    res.json(memProducts[idx]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    if (useDB()) {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json({ message: 'Product removed' });
    }
    memProducts = memProducts.filter(p => p._id !== req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ============================
// BLOG ROUTES
// ============================
// GET all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    if (useDB()) {
      const blogs = await Blog.find({}).sort({ createdAt: -1 });
      return res.json(blogs);
    }
    res.json(memBlogs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET single blog
app.get('/api/blogs/:id', async (req, res) => {
  try {
    if (useDB()) {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      return res.json(blog);
    }
    const blog = memBlogs.find(b => b._id === req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST create blog
app.post('/api/blogs', async (req, res) => {
  try {
    const { title, excerpt, content, category, image, author, isPublished } = req.body;
    if (useDB()) {
      const blog = new Blog({ title, excerpt, content, category, image, author, isPublished });
      const created = await blog.save();
      return res.status(201).json(created);
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const newBlog = {
      _id: 'b' + Date.now(),
      title, excerpt, content: content || '', category, 
      image: image || '/hero-bg.jpg', 
      author: author || 'Escensio Team',
      isPublished: isPublished !== false,
      slug, createdAt: new Date()
    };
    memBlogs.unshift(newBlog);
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// PUT update blog
app.put('/api/blogs/:id', async (req, res) => {
  try {
    const { title, excerpt, content, category, image, author, isPublished } = req.body;
    if (useDB()) {
      const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { title, excerpt, content, category, image, author, isPublished },
        { new: true }
      );
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      return res.json(blog);
    }
    const idx = memBlogs.findIndex(b => b._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Blog not found' });
    memBlogs[idx] = { ...memBlogs[idx], title, excerpt, content, category, image, author, isPublished };
    res.json(memBlogs[idx]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE blog
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    if (useDB()) {
      await Blog.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Blog removed' });
    }
    memBlogs = memBlogs.filter(b => b._id !== req.params.id);
    res.json({ message: 'Blog removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ============================
// ORDER ROUTES
// ============================
// GET all orders
app.get('/api/orders', async (req, res) => {
  try {
    if (useDB()) {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return res.json(orders);
    }
    res.json(memOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET single order
app.get('/api/orders/:id', async (req, res) => {
  try {
    if (useDB()) {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.json(order);
    }
    const order = memOrders.find(o => o._id === req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST create order
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, phone, address, city, paymentMethod, items, total, notes } = req.body;
    if (useDB()) {
      const order = new Order({ customer, phone, address, city, paymentMethod, items, total, notes });
      const created = await order.save();
      return res.status(201).json(created);
    }
    const newOrder = {
      _id: 'o' + Date.now(),
      customer, phone, address, city: city || '',
      paymentMethod: paymentMethod || 'cod',
      items: items || [], total: Number(total),
      status: 'Processing', notes: notes || '',
      createdAt: new Date()
    };
    memOrders.unshift(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// PUT update order status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (useDB()) {
      const order = await Order.findByIdAndUpdate(req.params.id, { status, notes }, { new: true });
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.json(order);
    }
    const idx = memOrders.findIndex(o => o._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Order not found' });
    if (status) memOrders[idx].status = status;
    if (notes !== undefined) memOrders[idx].notes = notes;
    res.json(memOrders[idx]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    if (useDB()) {
      await Order.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Order removed' });
    }
    memOrders = memOrders.filter(o => o._id !== req.params.id);
    res.json({ message: 'Order removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ============================
// SETTINGS ROUTES
// ============================
// GET all settings
app.get('/api/settings', async (req, res) => {
  try {
    if (useDB()) {
      const settingDocs = await Settings.find({});
      const settings: any = {};
      settingDocs.forEach(s => { settings[s.key] = s.value; });
      return res.json(settings);
    }
    res.json(memSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT update settings (bulk update)
app.put('/api/settings', async (req, res) => {
  try {
    const updates = req.body; // { key: value, ... }
    if (useDB()) {
      const ops = Object.entries(updates).map(([key, value]) => ({
        updateOne: {
          filter: { key },
          update: { $set: { key, value } },
          upsert: true
        }
      }));
      await Settings.bulkWrite(ops as any);
      const settingDocs = await Settings.find({});
      const settings: any = {};
      settingDocs.forEach(s => { settings[s.key] = s.value; });
      return res.json(settings);
    }
    memSettings = { ...memSettings, ...updates };
    res.json(memSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// ============================
// DASHBOARD STATS
// ============================
app.get('/api/admin/stats', async (req, res) => {
  try {
    let totalProducts, totalOrders, totalRevenue, processingOrders, lowStockCount;

    if (useDB()) {
      const [products, orders] = await Promise.all([
        Product.find({}),
        Order.find({})
      ]);
      totalProducts = products.length;
      totalOrders = orders.length;
      totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      processingOrders = orders.filter(o => o.status === 'Processing').length;
      lowStockCount = products.filter(p => p.stock <= 5).length;
    } else {
      totalProducts = memProducts.length;
      totalOrders = memOrders.length;
      totalRevenue = memOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      processingOrders = memOrders.filter(o => o.status === 'Processing').length;
      lowStockCount = memProducts.filter(p => p.stock <= 5).length;
    }

    res.json({
      totalProducts, totalOrders, totalRevenue,
      processingOrders, lowStockCount,
      totalBlogs: useDB() ? await Blog.countDocuments() : memBlogs.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ============================
// START SERVER
// ============================
app.listen(PORT, () => {
  console.log(`🌸 Escensio Server running on http://localhost:${PORT}`);
});

export default app;
