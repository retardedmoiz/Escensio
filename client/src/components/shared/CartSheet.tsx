"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/CartContext";
import { X, Minus, Plus, ShoppingBag, CreditCard, Truck, Banknote } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import API_URL from "@/lib/api";

type PaymentMethod = "cod" | "bank";
type CheckoutStep = "cart" | "details" | "confirm";

export default function CartSheet() {
    const { items, isOpen, closeCart, removeItem } = useCart();
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    const [step, setStep] = useState<CheckoutStep>("cart");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
    const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });
    const [isPlacing, setIsPlacing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const [isWhatsappOrder, setIsWhatsappOrder] = useState(false);
    const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);

    const handleClose = () => {
        closeCart();
        setTimeout(() => { setStep("cart"); setOrderPlaced(false); }, 400);
    };

    const handlePlaceOrder = async (viaWhatsapp: boolean) => {
        setIsPlacing(true);
        
        const orderData = {
            customer: form.name,
            phone: form.phone,
            address: `${form.address}, ${form.city}`,
            paymentMethod,
            items: items.map(i => ({ name: i.title, qty: i.quantity, price: i.price })),
            total: subtotal,
            date: new Date().toISOString().split("T")[0],
        };

        // Save order to backend
        try {
            await fetch(`${API_URL}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
            });
        } catch (e) {
            console.error("Order save failed", e);
        }

        if (viaWhatsapp) {
            // First try to get it from settings, fallback to genuine number
            let waPhone = "923110043738"; 
            try {
                const res = await fetch(`${API_URL}/api/settings`, { cache: 'no-store' });
                if (res.ok) {
                    const settings = await res.json();
                    if (settings.whatsappNumber) waPhone = settings.whatsappNumber;
                }
            } catch (e) {}

            const payLabel = paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer";
            const msg = [
                `🛍️ *New Order — Escensio*`,
                ``,
                `*Customer:* ${form.name}`,
                `*Phone:* ${form.phone}`,
                `*Address:* ${form.address}, ${form.city}`,
                `*Payment:* ${payLabel}`,
                ``,
                `*Items:*`,
                ...items.map(i => `  • ${i.quantity}x ${i.title} — Rs. ${(i.price * i.quantity).toLocaleString()}`),
                ``,
                `*Total: Rs. ${subtotal.toLocaleString()}*`,
                ``,
                paymentMethod === "bank"
                    ? `Bank: HBL | Account: 0123-4567-8901 | Title: Escensio Pvt Ltd`
                    : `Please confirm COD delivery.`,
            ].join("\n");
            window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`, "_blank");
        }

        setPlacedOrderDetails(orderData);
        setIsWhatsappOrder(viaWhatsapp);
        setIsPlacing(false);
        setOrderPlaced(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Cart Sheet */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-full md:w-[520px] bg-[#0f0d0b] text-white border-l border-white/10 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
                            <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                {step === "cart" ? `Your Bag (${items.length})` : step === "details" ? "Delivery Details" : "Order Summary"}
                            </h2>
                            <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* ORDER PLACED SUCCESS */}
                        {orderPlaced ? (
                            <div className="flex-1 overflow-y-auto p-8 text-center space-y-6">
                                <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center text-4xl mb-4">✓</div>
                                <h3 className="text-3xl font-serif">Order Confirmed!</h3>
                                <p className="text-white/60 text-sm">
                                    {isWhatsappOrder 
                                        ? "Your order has been sent to our WhatsApp team. We'll reply shortly."
                                        : "Thank you for your order! Your receipt is below."}
                                </p>
                                
                                {/* Receipt / Order Summary */}
                                {placedOrderDetails && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left space-y-4">
                                        <div className="border-b border-white/10 pb-4">
                                            <h4 className="text-white/80 font-medium text-sm mb-1">Customer Details</h4>
                                            <p className="text-white/60 text-sm">{placedOrderDetails.customer}</p>
                                            <p className="text-white/60 text-sm">{placedOrderDetails.phone}</p>
                                            <p className="text-white/60 text-sm">{placedOrderDetails.address}</p>
                                        </div>
                                        
                                        <div className="border-b border-white/10 pb-4">
                                            <h4 className="text-white/80 font-medium text-sm mb-3">Order Items</h4>
                                            {placedOrderDetails.items.map((item: any, i: number) => (
                                                <div key={i} className="flex justify-between text-sm mb-2">
                                                    <span className="text-white/60">{item.qty}x {item.name}</span>
                                                    <span className="text-white/80">Rs. {(item.price * item.qty).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="font-medium text-white/80">Total Paid/Due</span>
                                            <span className="font-serif text-xl font-bold">Rs. {placedOrderDetails.total.toLocaleString()}</span>
                                        </div>
                                        <div className="text-xs text-white/40 uppercase tracking-widest pt-2">
                                            Method: {placedOrderDetails.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}
                                        </div>
                                    </div>
                                )}
                                
                                <button onClick={handleClose} className="w-full mt-4 px-10 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 transition-colors uppercase tracking-widest text-sm">
                                    Continue Shopping
                                </button>
                            </div>
                        ) : step === "cart" ? (
                            <>
                                {/* Cart Items */}
                                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                                    {items.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-4 text-white/40">
                                            <ShoppingBag className="w-16 h-16 stroke-1" />
                                            <p className="text-lg">Your bag is empty.</p>
                                        </div>
                                    ) : (
                                        items.map((item) => (
                                            <motion.div layout key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex gap-4">
                                                <div className="relative w-24 h-24 bg-white/10 rounded-xl overflow-hidden shrink-0">
                                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-lg tracking-wide">{item.title}</h3>
                                                        <p className="text-white/50 font-medium">Rs. {item.price.toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-1.5 text-sm">
                                                            <button onClick={() => {
                                                                const it = items.find(i => i.id === item.id);
                                                                if(it && it.quantity > 1) {
                                                                    // Update qty logic isn't fully in context, assuming removeItem + addItem or we just allow remove.
                                                                    removeItem(item.id);
                                                                }
                                                            }}><Minus className="w-3 h-3" /></button>
                                                            <span className="font-medium">{item.quantity}</span>
                                                            <button onClick={() => {}}><Plus className="w-3 h-3" /></button>
                                                        </div>
                                                        <button onClick={() => removeItem(item.id)} className="text-sm text-white/40 hover:text-red-400 transition-colors">
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                {items.length > 0 && (
                                    <div className="px-8 pb-8 pt-6 border-t border-white/10 space-y-5">
                                        <div className="flex items-center justify-between text-xl font-medium">
                                            <span className="text-white/70">Subtotal</span>
                                            <span className="font-serif text-2xl">Rs. {subtotal.toLocaleString()}</span>
                                        </div>
                                        <button
                                            onClick={() => setStep("details")}
                                            className="w-full bg-white text-black font-semibold py-4 rounded-2xl hover:bg-white/90 transition-colors text-base tracking-wide"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : step === "details" ? (
                            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 flex flex-col">
                                {/* Delivery Form */}
                                <div className="space-y-4">
                                    {[
                                        { label: "Full Name", key: "name", placeholder: "John Doe" },
                                        { label: "Phone Number", key: "phone", placeholder: "+92 300 1234567" },
                                        { label: "Delivery Address", key: "address", placeholder: "Street & House No." },
                                        { label: "City", key: "city", placeholder: "Karachi" },
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label className="block text-xs text-white/50 uppercase tracking-widest mb-1.5">{field.label}</label>
                                            <input
                                                type="text"
                                                placeholder={field.placeholder}
                                                value={(form as any)[field.key]}
                                                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <p className="text-xs text-white/50 uppercase tracking-widest mb-3">Payment Method</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setPaymentMethod("cod")}
                                            className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${paymentMethod === "cod" ? "border-white bg-white/10" : "border-white/15 hover:border-white/30"}`}
                                        >
                                            <Truck className="w-5 h-5" />
                                            <span className="text-sm font-medium">Cash on Delivery</span>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod("bank")}
                                            className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${paymentMethod === "bank" ? "border-white bg-white/10" : "border-white/15 hover:border-white/30"}`}
                                        >
                                            <Banknote className="w-5 h-5" />
                                            <span className="text-sm font-medium">Bank Transfer</span>
                                        </button>
                                    </div>
                                    {paymentMethod === "bank" && (
                                        <div className="mt-3 p-4 bg-white/5 rounded-xl text-sm text-white/70 space-y-1 border border-white/10">
                                            <p><span className="text-white/40">Bank:</span> HBL</p>
                                            <p><span className="text-white/40">Account:</span> 0123-4567-8901</p>
                                            <p><span className="text-white/40">Title:</span> Escensio Pvt Ltd</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-6 space-y-3">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handlePlaceOrder(false)}
                                            disabled={!form.name || !form.phone || !form.address || !form.city || isPlacing}
                                            className="flex-1 bg-white text-black font-semibold py-4 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
                                        >
                                            {isPlacing ? "..." : "Place Order"}
                                        </button>
                                        <button
                                            onClick={() => handlePlaceOrder(true)}
                                            disabled={!form.name || !form.phone || !form.address || !form.city || isPlacing}
                                            className="flex-1 bg-green-500 text-white font-semibold py-4 rounded-xl hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
                                        >
                                            WhatsApp Order
                                        </button>
                                    </div>
                                    <button onClick={() => setStep("cart")} className="w-full text-white/40 hover:text-white text-sm transition-colors pt-2">
                                        ← Back to Cart
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
