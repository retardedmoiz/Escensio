"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, ShoppingCart, Plus, Minus, Trash2, Printer, CheckCircle, RefreshCw, User, Phone, DollarSign, CreditCard, QrCode, Tag, Store } from "lucide-react";
import API_URL, { getImageUrl } from "@/lib/api";

interface Product {
    _id: string;
    id: string;
    name: string;
    subtitle?: string;
    price: number;
    category: string;
    stock: number;
    sku?: string;
    images?: string[];
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
    stock: number;
}

export default function AdminPOS() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cart, setCart] = useState<CartItem[]>([]);
    
    // Customer & Payment State
    const [customerName, setCustomerName] = useState("Walk-In Customer");
    const [customerPhone, setCustomerPhone] = useState("");
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [taxPercent, setTaxPercent] = useState<number>(5);
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi">("cash");
    const [cashReceived, setCashReceived] = useState<string>("");
    
    // Modal & Print State
    const [completedOrder, setCompletedOrder] = useState<any>(null);
    const [processing, setProcessing] = useState(false);
    const [settings, setSettings] = useState<any>({});
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [pRes, sRes] = await Promise.all([
                    fetch(`${API_URL}/api/products`),
                    fetch(`${API_URL}/api/settings`)
                ]);
                if (pRes.ok) setProducts(await pRes.json());
                if (sRes.ok) setSettings(await sRes.json());
            } catch (err) {
                console.error("Failed to load POS data", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const categories = useMemo(() => ["All", "Extrait de Parfum", "Eau de Parfum", "Discovery Sets", "Men's", "Women's", "Unisex"], []);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.sku?.toLowerCase().includes(search.toLowerCase()) ||
                p.category?.toLowerCase().includes(search.toLowerCase());
            return matchesCat && matchesSearch;
        });
    }, [products, selectedCategory, search]);

    const addToCart = (product: Product, size = "50ml") => {
        if (product.stock <= 0) return;
        
        setCart(prev => {
            const existing = prev.find(item => item.id === product._id && item.size === size);
            if (existing) {
                if (existing.quantity >= product.stock) return prev;
                return prev.map(item =>
                    item.id === product._id && item.size === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                id: product._id || product.id,
                name: `${product.name} (${size})`,
                price: product.price,
                size,
                quantity: 1,
                stock: product.stock
            }];
        });
    };

    const updateQty = (id: string, size: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id && item.size === size) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                if (newQty > item.stock) return item;
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(Boolean) as CartItem[]);
    };

    const removeFromCart = (id: string, size: string) => {
        setCart(prev => prev.filter(item => !(item.id === id && item.size === size)));
    };

    // Math Calculations
    const subtotal = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.quantity), 0), [cart]);
    const taxAmount = useMemo(() => Math.round((subtotal - discountAmount) * (taxPercent / 100)), [subtotal, discountAmount, taxPercent]);
    const grandTotal = useMemo(() => Math.max(0, subtotal - discountAmount + taxAmount), [subtotal, discountAmount, taxAmount]);
    const changeDue = useMemo(() => {
        const cash = parseFloat(cashReceived) || 0;
        return Math.max(0, cash - grandTotal);
    }, [cashReceived, grandTotal]);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setProcessing(true);

        const orderData = {
            customer: customerName || "Walk-In Customer",
            phone: customerPhone || "+92 300 0000000",
            items: cart,
            subtotal,
            discount: discountAmount,
            tax: taxAmount,
            total: grandTotal,
            paymentMethod,
            cashReceived: paymentMethod === "cash" ? parseFloat(cashReceived) || grandTotal : grandTotal,
            changeGiven: paymentMethod === "cash" ? changeDue : 0,
        };

        try {
            const res = await fetch(`${API_URL}/api/pos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            if (res.ok) {
                const data = await res.json();
                setCompletedOrder(data.order);

                // Update local product stocks
                setProducts(prev => prev.map(p => {
                    const cartItem = cart.find(ci => ci.id === p._id || ci.id === p.id);
                    if (cartItem) {
                        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
                    }
                    return p;
                }));

                // Reset Cart
                setCart([]);
                setCustomerName("Walk-In Customer");
                setCustomerPhone("");
                setCashReceived("");
                setDiscountAmount(0);
            }
        } catch (err) {
            console.error("POS transaction failed", err);
        } finally {
            setProcessing(false);
        }
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    return (
        <div className="admin-page pos-container">
            {/* Header */}
            <div className="admin-page-header flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                    <h1 className="admin-page-title text-2xl font-serif font-bold text-amber-400 flex items-center gap-2">
                        <Store className="w-6 h-6" /> Kiosk POS Billing System
                    </h1>
                    <p className="admin-page-subtitle text-xs text-white/60">
                        Counter Checkout & Instant Kiosk Receipt Printer · Wah Cantt Branch
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => { setCart([]); setDiscountAmount(0); }}
                        className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/70 hover:bg-white/5 flex items-center gap-1.5"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Clear Terminal
                    </button>
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-3 py-1 rounded-full font-mono">
                        Terminal #01 Active
                    </span>
                </div>
            </div>

            {/* POS 2-Column Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                
                {/* Left Side: Catalog & Search (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    {/* Search & Categories */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-3 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search fragrance by name or SKU..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-zinc-900 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                            />
                        </div>
                    </div>

                    {/* Category Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                                    selectedCategory === cat
                                        ? "bg-amber-400 text-black font-semibold shadow-lg shadow-amber-400/20"
                                        : "bg-zinc-900 border border-white/10 text-white/70 hover:border-white/30"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[600px] pr-1">
                        {loading ? (
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="h-44 bg-zinc-900/50 rounded-xl animate-pulse border border-white/5" />
                            ))
                        ) : filteredProducts.length === 0 ? (
                            <div className="col-span-full py-16 text-center text-white/40 text-sm">
                                No products found matching criteria
                            </div>
                        ) : (
                            filteredProducts.map(p => (
                                <div
                                    key={p._id || p.id}
                                    className={`group bg-zinc-900/80 border ${p.stock > 0 ? 'border-white/10 hover:border-amber-400/50' : 'border-red-500/20 opacity-60'} rounded-xl p-3 flex flex-col justify-between transition-all hover:bg-zinc-900 cursor-pointer`}
                                    onClick={() => p.stock > 0 && addToCart(p)}
                                >
                                    <div className="space-y-2">
                                        <div className="relative h-28 w-full rounded-lg overflow-hidden bg-black/40">
                                            <img
                                                src={getImageUrl(p.images?.[0])}
                                                alt={p.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <span className="absolute top-2 right-2 bg-black/80 text-[10px] text-amber-400 px-2 py-0.5 rounded font-mono">
                                                {p.stock} left
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-serif font-semibold text-sm text-white truncate">{p.name}</h3>
                                            <p className="text-[11px] text-white/50">{p.category}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
                                        <span className="font-bold text-amber-400 text-sm">
                                            Rs. {p.price.toLocaleString()}
                                        </span>
                                        <button
                                            disabled={p.stock <= 0}
                                            className="w-7 h-7 rounded-lg bg-amber-400/10 hover:bg-amber-400 hover:text-black text-amber-400 flex items-center justify-center transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Side: POS Kiosk Cart Terminal (5 Cols) */}
                <div className="lg:col-span-5 bg-zinc-900 border border-white/15 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
                    <div className="space-y-4">
                        {/* Terminal Title */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <span className="font-serif text-lg text-white font-bold flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-amber-400" /> Current Bill
                            </span>
                            <span className="text-xs text-amber-400 font-mono bg-amber-400/10 px-2.5 py-1 rounded-md">
                                {cart.reduce((a, b) => a + b.quantity, 0)} Items
                            </span>
                        </div>

                        {/* Customer Information Input */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <label className="text-white/60 mb-1 block">Customer Name</label>
                                <div className="relative">
                                    <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/40" />
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        className="w-full bg-black/40 border border-white/15 rounded-lg pl-8 pr-2 py-1.5 text-white focus:outline-none focus:border-amber-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-white/60 mb-1 block">Phone / Mobile</label>
                                <div className="relative">
                                    <Phone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="0300 1234567"
                                        value={customerPhone}
                                        onChange={e => setCustomerPhone(e.target.value)}
                                        className="w-full bg-black/40 border border-white/15 rounded-lg pl-8 pr-2 py-1.5 text-white focus:outline-none focus:border-amber-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cart Items Scroll Container */}
                        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                            {cart.length === 0 ? (
                                <div className="py-12 text-center text-white/30 text-xs flex flex-col items-center gap-2">
                                    <ShoppingCart className="w-8 h-8 opacity-40" />
                                    <span>No items added to current kiosk bill</span>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={`${item.id}-${item.size}`} className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
                                        <div className="flex-1 pr-2">
                                            <h4 className="font-semibold text-white truncate">{item.name}</h4>
                                            <p className="text-amber-400 font-mono">Rs. {item.price.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center bg-zinc-800 border border-white/10 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => updateQty(item.id, item.size, -1)}
                                                    className="px-2 py-1 hover:bg-white/10 text-white"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="px-2 font-semibold text-white font-mono">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.size, 1)}
                                                    className="px-2 py-1 hover:bg-white/10 text-white"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id, item.size)}
                                                className="text-red-400 hover:text-red-300 p-1"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Calculation & Payment Controls */}
                    <div className="pt-4 border-t border-white/10 space-y-3 mt-4">
                        {/* Discount & Tax Selector */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <label className="text-white/60 block mb-1">Discount (Rs.)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={discountAmount || ""}
                                    onChange={e => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                                    placeholder="0"
                                    className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-400"
                                />
                            </div>
                            <div>
                                <label className="text-white/60 block mb-1">Tax rate (%)</label>
                                <select
                                    value={taxPercent}
                                    onChange={e => setTaxPercent(parseFloat(e.target.value))}
                                    className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-400"
                                >
                                    <option value={0}>0% Tax Exempt</option>
                                    <option value={5}>5% Standard Tax</option>
                                    <option value={17}>17% Sales Tax</option>
                                </select>
                            </div>
                        </div>

                        {/* Payment Method Selector */}
                        <div>
                            <label className="text-white/60 text-xs block mb-1.5">Payment Method</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: "cash", label: "Cash", icon: DollarSign },
                                    { id: "card", label: "Card", icon: CreditCard },
                                    { id: "upi", label: "UPI / QR", icon: QrCode },
                                ].map(pm => (
                                    <button
                                        key={pm.id}
                                        type="button"
                                        onClick={() => setPaymentMethod(pm.id as any)}
                                        className={`py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all border ${
                                            paymentMethod === pm.id
                                                ? "bg-amber-400 text-black font-semibold border-amber-400"
                                                : "bg-black/40 border-white/10 text-white/70 hover:border-white/30"
                                        }`}
                                    >
                                        <pm.icon className="w-3.5 h-3.5" /> {pm.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cash Tendered & Change Helper */}
                        {paymentMethod === "cash" && (
                            <div className="bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-white/50 block mb-1">Cash Tendered</label>
                                    <input
                                        type="number"
                                        value={cashReceived}
                                        onChange={e => setCashReceived(e.target.value)}
                                        placeholder={`Rs. ${grandTotal}`}
                                        className="w-full bg-zinc-900 border border-white/20 rounded px-2 py-1 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                                    />
                                </div>
                                <div className="text-right flex flex-col justify-center">
                                    <span className="text-white/50">Change Due</span>
                                    <span className="text-amber-400 font-mono font-bold text-base">
                                        Rs. {changeDue.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Totals Summary */}
                        <div className="space-y-1 text-xs pt-2 border-t border-white/10">
                            <div className="flex justify-between text-white/60">
                                <span>Subtotal</span>
                                <span>Rs. {subtotal.toLocaleString()}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-amber-400">
                                    <span>Discount</span>
                                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-white/60">
                                <span>Tax ({taxPercent}%)</span>
                                <span>Rs. {taxAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                                <span>Total Amount</span>
                                <span className="text-amber-400">Rs. {grandTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            disabled={cart.length === 0 || processing}
                            onClick={handleCheckout}
                            className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                        >
                            {processing ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Printer className="w-4 h-4" /> Print Receipt & Complete Bill
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Printable Thermal Receipt Modal */}
            {completedOrder && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-white/20 rounded-2xl max-w-md w-full p-6 space-y-6 text-white max-h-[90vh] overflow-y-auto">
                        
                        {/* Printable Area Target */}
                        <div ref={printRef} className="print-area bg-white text-black p-6 rounded-lg font-mono text-xs space-y-4 shadow-2xl">
                            {/* Receipt Header */}
                            <div className="text-center space-y-1 pb-3 border-b border-dashed border-black">
                                <h2 className="text-base font-serif font-bold tracking-widest uppercase text-black">
                                    {settings.storeName || "ESCENSIO"}
                                </h2>
                                <p className="text-[10px] font-sans opacity-80">{settings.storeTagline || "The Essence of Luxury"}</p>
                                <p className="text-[10px] opacity-70">{settings.storeAddress || "POF Skating Park, Wah Cantt"}</p>
                                <p className="text-[10px] opacity-70">Ph: {settings.storePhone || "+92 300 1234567"}</p>
                                <div className="text-[10px] pt-1 font-bold">POS KIOSK RECEIPT</div>
                            </div>

                            {/* Meta */}
                            <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-black">
                                <div className="flex justify-between">
                                    <span>Inv #: {completedOrder._id}</span>
                                    <span>{new Date(completedOrder.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Cust: {completedOrder.customer}</span>
                                    <span>{new Date(completedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Pay Mode: {completedOrder.paymentMethod.toUpperCase()}</span>
                                    <span>Terminal #01</span>
                                </div>
                            </div>

                            {/* Line Items */}
                            <table className="w-full text-left text-[11px] border-b border-dashed border-black pb-3">
                                <thead>
                                    <tr className="border-b border-black text-black">
                                        <th className="py-1">Item</th>
                                        <th className="py-1 text-center">Qty</th>
                                        <th className="py-1 text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {completedOrder.items?.map((item: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="py-1">{item.name}</td>
                                            <td className="py-1 text-center">{item.quantity}</td>
                                            <td className="py-1 text-right">Rs. {(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals Breakdown */}
                            <div className="space-y-1 text-[11px] text-right">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>Rs. {completedOrder.subtotal?.toLocaleString()}</span>
                                </div>
                                {completedOrder.discount > 0 && (
                                    <div className="flex justify-between">
                                        <span>Discount:</span>
                                        <span>- Rs. {completedOrder.discount?.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Tax:</span>
                                    <span>Rs. {completedOrder.tax?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold text-sm border-t border-black pt-1">
                                    <span>TOTAL:</span>
                                    <span>Rs. {completedOrder.total?.toLocaleString()}</span>
                                </div>
                                {completedOrder.paymentMethod === "cash" && (
                                    <>
                                        <div className="flex justify-between">
                                            <span>Cash Paid:</span>
                                            <span>Rs. {completedOrder.cashReceived?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Change Given:</span>
                                            <span>Rs. {completedOrder.changeGiven?.toLocaleString()}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="text-center pt-3 border-t border-dashed border-black space-y-1">
                                <p className="text-[10px]">Thank you for choosing ESCENSIO.</p>
                                <p className="text-[9px] opacity-70">Exchanges accepted within 7 days with valid receipt.</p>
                                <div className="font-mono text-[9px] pt-1 tracking-widest">* ESCENSIO-LUXURY *</div>
                            </div>
                        </div>

                        {/* Modal Action Controls */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handlePrintReceipt}
                                className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm"
                            >
                                <Printer className="w-4 h-4" /> Print Thermal Bill Now
                            </button>
                            <button
                                onClick={() => setCompletedOrder(null)}
                                className="px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
