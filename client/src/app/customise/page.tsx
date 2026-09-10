"use client";

import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import { useState } from "react";
import { useSettings } from "@/components/providers/SettingsContext";
import { getImageUrl } from "@/lib/api";

const NOTES = {
    top: ["Calabrian Bergamot", "Pink Pepper", "Green Tea", "Wild Cherry", "Cardamom"],
    heart: ["Night Jasmine", "Bulgarian Rose", "Orris Root", "Incense", "Tuberose"],
    base: ["Madagascan Vanilla", "Mysore Sandalwood", "Amber Resin", "Cambodian Oud", "White Musk"]
};

export default function CustomisePage() {
    const { settings } = useSettings();
    const [selected, setSelected] = useState({ top: "", heart: "", base: "" });

    const handleSelect = (layer: "top" | "heart" | "base", note: string) => {
        setSelected(prev => ({ ...prev, [layer]: note }));
    };

    const handleWhatsAppOrder = () => {
        const text = `Hello ESCENSIO Atelier, I would like to order a Custom Bespoke Fragrance formulation with:\nTop Note: ${selected.top || 'Not specified'}\nHeart Note: ${selected.heart || 'Not specified'}\nBase Note: ${selected.base || 'Not specified'}`;
        const phone = settings.whatsappNumber || "923001234567";
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-[#120F0D] text-[#EAE4D9] pt-32 pb-24 px-6 max-w-7xl mx-auto">
            {/* Header Banner */}
            <div className="text-center space-y-4 mb-16">
                <span className="text-[#C89D54] uppercase tracking-[0.3em] text-xs font-mono">Bespoke Atelier</span>
                <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight text-[#EAE4D9]">
                    <TextReveal>Custom Fragrance Formulation</TextReveal>
                </h1>
                <p className="text-[#EAE4D9]/60 text-xs md:text-sm max-w-2xl mx-auto font-light leading-relaxed">
                    Design your signature perfume by selecting raw botanical notes. Our perfumers will formulate, age, and hand-bottle it exclusively for you.
                </p>
            </div>

            {/* Custom Atelier Banner Image */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-16 border border-[#C89D54]/30 bg-black shadow-2xl">
                <img
                    src={getImageUrl(settings.customiseBannerImage || "/products/perfume-1.jpg")}
                    alt="Custom Perfume Formulation"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-black/40 to-transparent flex items-end p-8">
                    <div>
                        <span className="text-[#C89D54] text-xs font-mono uppercase tracking-[0.2em]">Hand-Formulated</span>
                        <h2 className="text-2xl font-serif font-bold text-white">Your Custom Olfactory Blend</h2>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
                {/* Top Notes */}
                <div className="space-y-4 bg-[#181410] border border-[#332A22] p-6 rounded-2xl">
                    <h2 className="text-lg font-serif text-[#C89D54] font-bold border-b border-[#332A22] pb-3">1. Opening Top Notes</h2>
                    <p className="text-xs text-[#EAE4D9]/50">First impressions. Refreshing and volatile notes.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {NOTES.top.map(note => (
                            <button
                                key={note}
                                onClick={() => handleSelect("top", note)}
                                className={`px-3 py-1.5 border rounded-sm text-xs font-serif transition-colors ${
                                    selected.top === note
                                        ? "bg-[#C89D54] text-black font-semibold border-[#C89D54]"
                                        : "border-[#332A22] bg-[#120F0D] text-[#EAE4D9]/80 hover:border-[#C89D54]/50"
                                }`}
                            >
                                {note}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Heart Notes */}
                <div className="space-y-4 bg-[#181410] border border-[#332A22] p-6 rounded-2xl">
                    <h2 className="text-lg font-serif text-[#C89D54] font-bold border-b border-[#332A22] pb-3">2. Core Heart Notes</h2>
                    <p className="text-xs text-[#EAE4D9]/50">The heart identity. Floral and oriental warmth.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {NOTES.heart.map(note => (
                            <button
                                key={note}
                                onClick={() => handleSelect("heart", note)}
                                className={`px-3 py-1.5 border rounded-sm text-xs font-serif transition-colors ${
                                    selected.heart === note
                                        ? "bg-[#C89D54] text-black font-semibold border-[#C89D54]"
                                        : "border-[#332A22] bg-[#120F0D] text-[#EAE4D9]/80 hover:border-[#C89D54]/50"
                                }`}
                            >
                                {note}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Base Notes */}
                <div className="space-y-4 bg-[#181410] border border-[#332A22] p-6 rounded-2xl">
                    <h2 className="text-lg font-serif text-[#C89D54] font-bold border-b border-[#332A22] pb-3">3. Deep Base Notes</h2>
                    <p className="text-xs text-[#EAE4D9]/50">The lingering sillage trail. Woods and resins.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {NOTES.base.map(note => (
                            <button
                                key={note}
                                onClick={() => handleSelect("base", note)}
                                className={`px-3 py-1.5 border rounded-sm text-xs font-serif transition-colors ${
                                    selected.base === note
                                        ? "bg-[#C89D54] text-black font-semibold border-[#C89D54]"
                                        : "border-[#332A22] bg-[#120F0D] text-[#EAE4D9]/80 hover:border-[#C89D54]/50"
                                }`}
                            >
                                {note}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Order Custom Formulation Summary */}
            <div className="mt-16 p-8 border border-[#C89D54]/30 rounded-2xl bg-[#181410] text-center max-w-2xl mx-auto space-y-6 shadow-2xl">
                <h3 className="text-2xl font-serif text-[#C89D54] font-bold">Bespoke Blend Selection</h3>
                <div className="text-xs md:text-sm text-[#EAE4D9]/80 font-mono space-y-1">
                    {selected.top || selected.heart || selected.base ? (
                        <div>
                            <p>Top Note: <span className="text-[#C89D54] font-bold">{selected.top || "Select note"}</span></p>
                            <p>Heart Note: <span className="text-[#C89D54] font-bold">{selected.heart || "Select note"}</span></p>
                            <p>Base Note: <span className="text-[#C89D54] font-bold">{selected.base || "Select note"}</span></p>
                        </div>
                    ) : (
                        <p className="text-[#EAE4D9]/40">Select top, heart, and base notes above to preview your custom formulation.</p>
                    )}
                </div>
                <button
                    onClick={handleWhatsAppOrder}
                    className="w-full sm:w-auto bg-[#C89D54] hover:bg-[#b08743] text-black font-bold px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-[#C89D54]/10"
                >
                    Order Custom Blend ({settings.currencySymbol || "Rs."} 19,500)
                </button>
            </div>
        </div>
    );
}
