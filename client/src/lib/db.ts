import mongoose from "mongoose";

// Initial seed products
const initialProducts = [
    {
        id: "prod-1",
        _id: "prod-1",
        name: "VELVET NOIR",
        subtitle: "Extrait de Parfum • 100ml",
        price: 18500,
        salePrice: 16500,
        category: "Extrait de Parfum",
        gender: "Unisex",
        stock: 24,
        sku: "ESC-VN-100",
        barcode: "890123456701",
        description: "A dark, hypnotic blend of Madagascan vanilla, rich oud, and smoky incense. Designed for evening elegance and magnetic charm.",
        topNotes: ["Black Cherry", "Calabrian Bergamot", "Pink Pepper"],
        heartNotes: ["Bulgarian Rose", "Orris Root", "Incense"],
        baseNotes: ["Oud", "Madagascan Vanilla", "Ambergris", "Leather"],
        longevity: "14+ Hours",
        projection: "Heavy",
        season: "Fall / Winter",
        images: ["/products/perfume-1.jpg"],
        isFeatured: true,
        isBestSeller: true,
        rating: 4.9,
        numReviews: 128,
        createdAt: new Date().toISOString()
    },
    {
        id: "prod-2",
        _id: "prod-2",
        name: "FLORAL SERENITY",
        subtitle: "Eau de Parfum • 50ml",
        price: 14200,
        category: "Eau de Parfum",
        gender: "Women's",
        stock: 18,
        sku: "ESC-FS-050",
        barcode: "890123456702",
        description: "An ethereal bouquet of night-blooming jasmine, white lily, and crisp white tea leaves anchored by creamy sandalwood.",
        topNotes: ["White Tea", "Green Mandarin", "Neroli"],
        heartNotes: ["Night Jasmine", "Grasses Rose", "Tuberose"],
        baseNotes: ["Mysore Sandalwood", "White Musk", "Cedar"],
        longevity: "10+ Hours",
        projection: "Moderate",
        season: "Spring / Summer",
        images: ["/products/perfume-2.jpg"],
        isFeatured: true,
        isBestSeller: false,
        rating: 4.8,
        numReviews: 94,
        createdAt: new Date().toISOString()
    },
    {
        id: "prod-3",
        _id: "prod-3",
        name: "AMBER OUD EXTREME",
        subtitle: "Pure Parfum • 100ml",
        price: 24500,
        category: "Extrait de Parfum",
        gender: "Men's",
        stock: 8,
        sku: "ESC-AOE-100",
        barcode: "890123456703",
        description: "Commanding and sophisticated. Royal amber resin blended with rare aged Cambodian agarwood and saffron threads.",
        topNotes: ["Saffron", "Nutmeg", "Cardamom"],
        heartNotes: ["Amber Resin", "Cedarwood", "Patchouli"],
        baseNotes: ["Cambodian Oud", "Benzoin", "Vetiver"],
        longevity: "16+ Hours",
        projection: "Intense",
        season: "Winter",
        images: ["/products/perfume-3.jpg"],
        isFeatured: true,
        isBestSeller: true,
        rating: 5.0,
        numReviews: 210,
        createdAt: new Date().toISOString()
    },
    {
        id: "prod-4",
        _id: "prod-4",
        name: "OCEAN BREEZE",
        subtitle: "Eau de Parfum • 100ml",
        price: 13500,
        category: "Eau de Parfum",
        gender: "Unisex",
        stock: 35,
        sku: "ESC-OB-100",
        barcode: "890123456704",
        description: "Crisp marine accords mixed with sun-drenched bergamot, sea salt, and driftwood. Refreshing and exhilarating.",
        topNotes: ["Sea Salt", "Calabrian Bergamot", "Grapefruit"],
        heartNotes: ["Marine Accord", "Sage", "Rosemary"],
        baseNotes: ["Driftwood", "Ambrette Seed", "Musk"],
        longevity: "8+ Hours",
        projection: "Moderate",
        season: "Summer",
        images: ["/products/perfume-4.jpg"],
        isFeatured: false,
        isBestSeller: false,
        rating: 4.7,
        numReviews: 62,
        createdAt: new Date().toISOString()
    },
    {
        id: "prod-5",
        _id: "prod-5",
        name: "SAFFRON NOIR",
        subtitle: "Discovery Atomizer • 10ml",
        price: 4500,
        category: "Discovery Sets",
        gender: "Unisex",
        stock: 42,
        sku: "ESC-SN-010",
        barcode: "890123456705",
        description: "Pocket-sized luxury. Intense Kashmiri saffron married with dark plum and cashmere musk.",
        topNotes: ["Kashmiri Saffron", "Black Plum"],
        heartNotes: ["Leather", "Black Violet"],
        baseNotes: ["Cashmere Wood", "Golden Amber"],
        longevity: "10+ Hours",
        projection: "Moderate",
        season: "All Season",
        images: ["/products/perfume-1.jpg"],
        isFeatured: false,
        isBestSeller: false,
        rating: 4.9,
        numReviews: 45,
        createdAt: new Date().toISOString()
    }
];

const initialSettings = {
    storeName: "ESCENSIO",
    storeTagline: "Artisanal Haute Parfumerie",
    heroTitle: "ESCENSIO",
    heroSubtitle: "Handcrafted with rare botanical extracts, aged woods, and quiet elegance.",
    heroImage: "/hero-new.jpg",
    announcementBar: "Complimentary 10ml Discovery Atomizer on Orders Over Rs. 15,000 | Kiosk Wah Cantt Open",
    announcementEnabled: true,
    currency: "PKR",
    currencySymbol: "Rs.",
    taxRatePercentage: 5,
    storeEmail: "hello@escensio.com",
    storePhone: "+92 300 1234567",
    storeAddress: "POF Skating Park, Wah Cantt, Pakistan",
    whatsappNumber: "923001234567",
    category1Image: "/products/perfume-2.jpg",
    category2Image: "/products/perfume-3.jpg",
    category3Image: "/products/perfume-4.jpg",
    category4Image: "/products/perfume-1.jpg",
    aboutHeroImage: "/hero-new.jpg",
    aboutCraftImage: "/products/perfume-3.jpg",
    customiseBannerImage: "/products/perfume-1.jpg",
    contactBannerImage: "/products/perfume-4.jpg",
    marqueeText: "HANDCRAFTED PERFUMERY • KIOSK WAH CANTT • ESCENSIO LUXURY • BOTANICAL EXTRACTS",
    marqueeTextColor: "#D4AF37",
    marqueeBgColor: "#0A0B0E",
    instagramUrl: "https://instagram.com/escensio.official",
    facebookUrl: "https://facebook.com/escensio.official",
    twitterUrl: "https://twitter.com/escensio",
};

const initialOrders = [
    {
        _id: "ord-1001",
        customer: "Zainab Malik",
        phone: "+92 301 5551234",
        address: "House 45, Street 12, F-7/2",
        city: "Islamabad",
        items: [
            { id: "prod-1", name: "VELVET NOIR (100ml)", price: 16500, quantity: 1 }
        ],
        subtotal: 16500,
        tax: 825,
        discount: 0,
        total: 17325,
        paymentMethod: "cod",
        orderType: "online",
        status: "Confirmed",
        notes: "Deliver in evening if possible",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
        _id: "ord-1002",
        customer: "Kiosk Walk-In Customer",
        phone: "+92 333 9988776",
        address: "Kiosk Counter Sale",
        city: "Wah Cantt",
        items: [
            { id: "prod-2", name: "FLORAL SERENITY (50ml)", price: 14200, quantity: 1 }
        ],
        subtotal: 14200,
        tax: 710,
        discount: 1000,
        total: 13910,
        paymentMethod: "cash",
        orderType: "pos_kiosk",
        cashReceived: 14000,
        changeGiven: 90,
        status: "Delivered",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
];

// In-Memory Global Store (Persists during Node server runtime fallback)
let globalStore = {
    products: [...initialProducts],
    settings: { ...initialSettings },
    orders: [...initialOrders],
};

// Mongoose Schemas for MongoDB Persistence
const SettingSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const ProductSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const OrderSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const SettingModel = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
const ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const OrderModel = mongoose.models.Order || mongoose.model("Order", OrderSchema);

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Connect to MongoDB if MONGODB_URI is provided
 */
export async function connectDB() {
    if (MONGODB_URI) {
        if (mongoose.connection.readyState >= 1) return true;
        try {
            await mongoose.connect(MONGODB_URI);
            console.log("Connected to MongoDB Atlas");
            return true;
        } catch (err) {
            console.error("MongoDB Connection Error:", err);
            return false;
        }
    }
    return false;
}

// Memory / DB Data Methods
export const db = {
    async getProducts() {
        const isDbConnected = await connectDB();
        if (isDbConnected) {
            try {
                let prods = await ProductModel.find().lean();
                if (!prods || prods.length === 0) {
                    await ProductModel.insertMany(initialProducts);
                    prods = initialProducts;
                }
                return prods.map((p: any) => ({ ...p, id: p.id || p._id?.toString(), _id: p._id?.toString() }));
            } catch (err) {
                console.error("Error getting products from MongoDB", err);
            }
        }
        return globalStore.products;
    },

    async getProductById(id: string) {
        const isDbConnected = await connectDB();
        if (isDbConnected) {
            try {
                const prod = await ProductModel.findOne({ $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] }).lean();
                if (prod) return { ...prod, id: prod.id || prod._id?.toString(), _id: prod._id?.toString() };
            } catch { }
        }
        return globalStore.products.find(p => p.id === id || p._id === id);
    },

    async createProduct(data: any) {
        const isDbConnected = await connectDB();
        const id = `prod-${Date.now()}`;
        const newProduct = {
            id,
            createdAt: new Date().toISOString(),
            isFeatured: false,
            isBestSeller: false,
            rating: 5.0,
            numReviews: 1,
            ...data
        };

        if (isDbConnected) {
            try {
                const created = await ProductModel.create(newProduct);
                return { ...created.toObject(), id: created.id || created._id.toString(), _id: created._id.toString() };
            } catch (err) {
                console.error("Error creating product in MongoDB", err);
            }
        }

        globalStore.products.unshift(newProduct);
        return newProduct;
    },

    async updateProduct(id: string, data: any) {
        const isDbConnected = await connectDB();
        if (isDbConnected) {
            try {
                const updated = await ProductModel.findOneAndUpdate(
                    { $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
                    { $set: data },
                    { new: true }
                ).lean();
                if (updated) return { ...updated, id: updated.id || updated._id?.toString(), _id: updated._id?.toString() };
            } catch (err) {
                console.error("Error updating product in MongoDB", err);
            }
        }

        const index = globalStore.products.findIndex(p => p.id === id || p._id === id);
        if (index !== -1) {
            globalStore.products[index] = { ...globalStore.products[index], ...data };
            return globalStore.products[index];
        }
        return null;
    },

    async deleteProduct(id: string) {
        const isDbConnected = await connectDB();
        if (isDbConnected) {
            try {
                await ProductModel.deleteOne({ $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] });
                return true;
            } catch { }
        }
        globalStore.products = globalStore.products.filter(p => p.id !== id && p._id !== id);
        return true;
    },

    async getSettings() {
        const isDbConnected = await connectDB();
        if (isDbConnected) {
            try {
                let settingsDoc = await SettingModel.findOne().lean();
                if (!settingsDoc) {
                    settingsDoc = await SettingModel.create(initialSettings);
                }
                return { ...initialSettings, ...settingsDoc };
            } catch (err) {
                console.error("Error getting settings from MongoDB", err);
            }
        }
        return globalStore.settings;
    },

    async updateSettings(data: any) {
        const isDbConnected = await connectDB();
        if (isDbConnected) {
            try {
                const updatedDoc = await SettingModel.findOneAndUpdate(
                    {},
                    { $set: data },
                    { upsert: true, new: true }
                ).lean();
                return { ...initialSettings, ...updatedDoc };
            } catch (err) {
                console.error("Error updating settings in MongoDB", err);
            }
        }

        globalStore.settings = { ...globalStore.settings, ...data };
        return globalStore.settings;
    },

    async getOrders() {
        const isDbConnected = await connectDB();
        if (isDbConnected) {
            try {
                let orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
                if (!orders || orders.length === 0) {
                    await OrderModel.insertMany(initialOrders);
                    orders = initialOrders;
                }
                return orders.map((o: any) => ({ ...o, _id: o._id?.toString() }));
            } catch (err) {
                console.error("Error getting orders from MongoDB", err);
            }
        }
        return globalStore.orders;
    },

    async createOrder(orderData: any) {
        const isDbConnected = await connectDB();
        const newOrder = {
            createdAt: new Date().toISOString(),
            status: orderData.orderType === "pos_kiosk" ? "Delivered" : "Processing",
            ...orderData
        };

        if (isDbConnected) {
            try {
                const created = await OrderModel.create(newOrder);
                return { ...created.toObject(), _id: created._id.toString() };
            } catch (err) {
                console.error("Error creating order in MongoDB", err);
            }
        }

        const fallbackOrder = { _id: `ord-${Date.now()}`, ...newOrder };
        globalStore.orders.unshift(fallbackOrder);

        // Auto decrement stock
        if (Array.isArray(orderData.items)) {
            for (const item of orderData.items) {
                const prod = globalStore.products.find(p => p.id === item.id || p._id === item.id || p.name === item.name);
                if (prod) prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
            }
        }
        return fallbackOrder;
    },

    async updateOrderStatus(id: string, status: string) {
        const isDbConnected = await connectDB();
        if (isDbConnected) {
            try {
                const updated = await OrderModel.findOneAndUpdate(
                    { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
                    { $set: { status } },
                    { new: true }
                ).lean();
                if (updated) return { ...updated, _id: updated._id?.toString() };
            } catch { }
        }

        const order = globalStore.orders.find(o => o._id === id);
        if (order) {
            order.status = status;
            return order;
        }
        return null;
    },

    async deleteOrder(id: string) {
        const isDbConnected = await connectDB();
        if (isDbConnected) {
            try {
                await OrderModel.deleteOne({ _id: mongoose.Types.ObjectId.isValid(id) ? id : null });
                return true;
            } catch { }
        }
        globalStore.orders = globalStore.orders.filter(o => o._id !== id);
        return true;
    }
};
