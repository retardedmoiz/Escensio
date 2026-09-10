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
    storeTagline: "The Essence of Luxury Fragrances",
    heroTitle: "ESCENSIO",
    heroSubtitle: "Crafted for those who appreciate elegance. Experience luxury, confidence, and individuality — in every spray.",
    heroImage: "/hero-new.jpg",
    announcementBar: "✨ Special Offer: Complimentary 10ml Discovery Sample on Orders Over Rs. 15,000 | Visit Wah Cantt Kiosk",
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
    marqueeText: "FREE EXPRESS SHIPPING ACROSS PAKISTAN • HANDCRAFTED PERFUMERY • KIOSK WAH CANTT • ESCENSIO LUXURY",
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

// In-Memory Global Store (Persists during Node server runtime)
let globalStore = {
    products: [...initialProducts],
    settings: { ...initialSettings },
    orders: [...initialOrders],
};

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Connect to MongoDB if URI is provided, otherwise fallback to in-memory store
 */
export async function connectDB() {
    if (MONGODB_URI) {
        if (mongoose.connection.readyState >= 1) return;
        try {
            await mongoose.connect(MONGODB_URI);
            console.log("Connected to MongoDB Atlas");
        } catch (err) {
            console.error("MongoDB Connection Error:", err);
        }
    }
}

// Memory / DB Data Methods
export const db = {
    async getProducts() {
        await connectDB();
        return globalStore.products;
    },
    async getProductById(id: string) {
        await connectDB();
        return globalStore.products.find(p => p.id === id || p._id === id);
    },
    async createProduct(data: any) {
        await connectDB();
        const newProduct = {
            id: `prod-${Date.now()}`,
            _id: `prod-${Date.now()}`,
            createdAt: new Date().toISOString(),
            isFeatured: false,
            isBestSeller: false,
            rating: 5.0,
            numReviews: 1,
            ...data
        };
        globalStore.products.unshift(newProduct);
        return newProduct;
    },
    async updateProduct(id: string, data: any) {
        await connectDB();
        const index = globalStore.products.findIndex(p => p.id === id || p._id === id);
        if (index !== -1) {
            globalStore.products[index] = { ...globalStore.products[index], ...data };
            return globalStore.products[index];
        }
        return null;
    },
    async deleteProduct(id: string) {
        await connectDB();
        globalStore.products = globalStore.products.filter(p => p.id !== id && p._id !== id);
        return true;
    },

    async getSettings() {
        await connectDB();
        return globalStore.settings;
    },
    async updateSettings(data: any) {
        await connectDB();
        globalStore.settings = { ...globalStore.settings, ...data };
        return globalStore.settings;
    },

    async getOrders() {
        await connectDB();
        return globalStore.orders;
    },
    async createOrder(orderData: any) {
        await connectDB();
        const newOrder = {
            _id: `ord-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: orderData.orderType === "pos_kiosk" ? "Delivered" : "Processing",
            ...orderData
        };
        globalStore.orders.unshift(newOrder);

        // Auto decrement stock for items ordered
        if (Array.isArray(orderData.items)) {
            for (const item of orderData.items) {
                const prod = globalStore.products.find(p => p.id === item.id || p._id === item.id || p.name === item.name);
                if (prod) {
                    prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
                }
            }
        }
        return newOrder;
    },
    async updateOrderStatus(id: string, status: string) {
        await connectDB();
        const order = globalStore.orders.find(o => o._id === id);
        if (order) {
            order.status = status;
            return order;
        }
        return null;
    },
    async deleteOrder(id: string) {
        await connectDB();
        globalStore.orders = globalStore.orders.filter(o => o._id !== id);
        return true;
    }
};
