"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/CartContext";
import { X, Minus, Plus, ShoppingBag, Truck, Banknote, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import API_URL from "@/lib/api";
import { useSettings } from "../providers/SettingsContext";

type PaymentMethod = "cod" | "bank";
type CheckoutStep = "cart" | "details" | "confirm";

export default function CartSheet() {
    const { items, isOpen, closeCart, removeItem } = useCart();
    const { settings } = useSettings();
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
            const waPhone = settings.whatsappNumber || "923001234567"; 
            const payLabel = paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer";
            const msg = [
                `*ESCENSIO Order Inquiry*`,
                ``,
                `Customer: ${form.name}`,
                `Phone: ${form.phone}`,
                `Address: ${form.address}, ${form.city}`,
                `Payment Mode: ${payLabel}`,
                ``,
                `Items Requested:`,
                ...items.map(i => `  • ${i.quantity}x ${i.title} — ${settings.currencySymbol || "Rs."} ${(i.price * i.quantity).toLocaleString()}`),
                ``,
                `Total: ${settings.currencySymbol || "Rs."} ${subtotal.toLocaleString()}`,
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Cart Sheet */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-full md:w-[500px] bg-[#120F0D] text-[#EAE4D9] border-l border-[#332A22] shadow-2xl z-50 flex flex-col font-sans"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-[#332A22]">
                            <h2 className="text-xl font-serif font-bold text-[#C89D54] flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                {step === "cart" ? `Shopping Bag (${items.length})` : step === "details" ? "Delivery Details" : "Order Summary"}
                            </h2>
                            <button onClick={handleClose} className="p-2 hover:bg-white/5 text-[#EAE4D9]/60 hover:text-white rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* ORDER PLACED SUCCESS */}
                        {orderPlaced ? (
                            <div className="flex-1 overflow-y-auto p-8 text-center space-y-6">
                                <div className="w-16 h-16 mx-auto rounded-full bg-[#C89D54]/10 border border-[#C89D54]/30 flex items-center justify-center text-[#C89D54] mb-2">
                                    <Check className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-[#EAE4D9]">Order Confirmed</h3>
                                <p className="text-[#EAE4D9]/60 text-xs">
                                    {isWhatsappOrder 
                                        ? "Your order details have been opened in WhatsApp. Our atelier team will assist you shortly."
                                        : "Thank you for your order. Your receipt details are listed below."}
                                </p>
                                
                                {placedOrderDetails && (
                                    <div className="bg-[#181410] border border-[#332A22] rounded-xl p-6 text-left space-y-4 text-xs font-mono">
                                        <div className="border-b border-[#332A22] pb-3">
                                            <h4 className="text-[#C89D54] font-semibold text-xs mb-1 uppercase tracking-wider">Customer Info</h4>
                                            <p className="text-[#EAE4D9]">{placedOrderDetails.customer}</p>
                                            <p className="text-[#EAE4D9]/60">{placedOrderDetails.phone}</p>
                                            <p className="text-[#EAE4D9]/60">{placedOrderDetails.address}</p>
                                        </div>
                                        
                                        <div className="border-b border-[#332A22] pb-3">
                                            <h4 className="text-[#C89D54] font-semibold text-xs mb-2 uppercase tracking-wider">Ordered Items</h4>
                                            {placedOrderDetails.items.map((item: any, i: number) => (
                                                <div key={i} className="flex justify-between mb-1.5">
                                                    <span className="text-[#EAE4D9]/80">{item.qty}x {item.name}</span>
                                                    <span className="text-[#EAE4D9] font-bold">{settings.currencySymbol || "Rs."} {(item.price * item.qty).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex justify-between items-center pt-1 font-bold text-sm">
                                            <span className="text-[#EAE4D9]">Total Amount</span>
                                            <span className="text-[#C89D54]">{settings.currencySymbol || "Rs."} {placedOrderDetails.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}
                                
                                <button onClick={handleClose} className="w-full mt-4 px-8 py-3.5 bg-[#C89D54] hover:bg-[#b08743] text-black font-semibold rounded-sm text-xs uppercase tracking-[0.2em] transition-colors">
                                    Return to Store
                                </button>
                            </div>
                        ) : step === "cart" ? (
                            <>
                                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
                                    {items.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center gap-3 text-[#EAE4D9]/40">
                                            <ShoppingBag className="w-12 h-12 stroke-1 text-[#C89D54]/50" />
                                            <p className="text-sm font-serif">Your shopping bag is currently empty.</p>
                                        </div>
                                    ) : (
                                        items.map((item) => (
                                            <motion.div layout key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-4 bg-[#181410] border border-[#332A22] p-3 rounded-xl">
                                                <div className="relative w-20 h-20 bg-black rounded-lg overflow-hidden shrink-0">
                                                    <img src={item.image || "/products/perfume-1.jpg"} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between text-xs">
                                                    <div>
                                                        <h3 className="font-serif font-bold text-sm text-[#EAE4D9]">{item.title}</h3>
                                                        <p className="text-[#C89D54] font-mono mt-0.5">{settings.currencySymbol || "Rs."} {item.price.toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[#EAE4D9]/60 font-mono">Qty: {item.quantity}</span>
                                                        <button onClick={() => removeItem(item.id)} className="text-[11px] text-red-400 hover:text-red-300">
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                {items.length > 0 && (
                                    <div className="px-8 pb-8 pt-4 border-t border-[#332A22] space-y-4">
                                        <div className="flex items-center justify-between font-serif text-lg font-bold">
                                            <span className="text-[#EAE4D9]/70">Subtotal</span>
                                            <span className="text-[#C89D54]">{settings.currencySymbol || "Rs."} {subtotal.toLocaleString()}</span>
                                        </div>
                                        <button
                                            onClick={() => setStep("details")}
                                            className="w-full bg-[#C89D54] hover:bg-[#b08743] text-black font-semibold py-3.5 rounded-sm text-xs uppercase tracking-[0.2em] transition-colors"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : step === "details" ? (
                            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 flex flex-col text-xs">
                                <div className="space-y-3">
                                    {[
                                        { label: "Full Name", key: "name", placeholder: "John Doe" },
                                        { label: "Phone Number", key: "phone", placeholder: "+92 300 1234567" },
                                        { label: "Delivery Address", key: "address", placeholder: "House & Street Address" },
                                        { label: "City", key: "city", placeholder: "Wah Cantt / Islamabad" },
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label className="block text-[11px] text-[#EAE4D9]/60 mb-1">{field.label}</label>
                                            <input
                                                type="text"
                                                placeholder={field.placeholder}
                                                value={(form as any)[field.key]}
                                                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                                className="w-full bg-black/50 border border-[#332A22] rounded-xl px-4 py-2.5 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54]"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <p className="text-[11px] text-[#EAE4D9]/60 mb-2">Payment Method</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setPaymentMethod("cod")}
                                            className={`flex flex-col items-center gap-2 py-3.5 rounded-xl border transition-all ${paymentMethod === "cod" ? "border-[#C89D54] bg-[#C89D54]/10 text-[#C89D54]" : "border-[#332A22] bg-[#181410] text-[#EAE4D9]/60"}`}
                                        >
                                            <Truck className="w-4 h-4" />
                                            <span className="text-xs font-medium">Cash on Delivery</span>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod("bank")}
                                            className={`flex flex-col items-center gap-2 py-3.5 rounded-xl border transition-all ${paymentMethod === "bank" ? "border-[#C89D54] bg-[#C89D54]/10 text-[#C89D54]" : "border-[#332A22] bg-[#181410] text-[#EAE4D9]/60"}`}
                                        >
                                            <Banknote className="w-4 h-4" />
                                            <span className="text-xs font-medium">Bank Transfer</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 space-y-3">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handlePlaceOrder(false)}
                                            disabled={!form.name || !form.phone || !form.address || !form.city || isPlacing}
                                            className="flex-1 bg-[#C89D54] hover:bg-[#b08743] text-black font-semibold py-3.5 rounded-sm disabled:opacity-40 text-xs uppercase tracking-[0.15em]"
                                        >
                                            {isPlacing ? "Processing..." : "Place Order"}
                                        </button>
                                        <button
                                            onClick={() => handlePlaceOrder(true)}
                                            disabled={!form.name || !form.phone || !form.address || !form.city || isPlacing}
                                            className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-sm disabled:opacity-40 text-xs uppercase tracking-[0.15em]"
                                        >
                                            WhatsApp Order
                                        </button>
                                    </div>
                                    <button onClick={() => setStep("cart")} className="w-full text-[#EAE4D9]/40 hover:text-[#EAE4D9] text-xs pt-2">
                                        ← Back to Shopping Bag
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
