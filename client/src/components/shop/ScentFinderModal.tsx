"use client";

import { useState } from "react";
import { Sparkles, X, ArrowRight, Check, RefreshCw, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QUIZ_QUESTIONS = [
    {
        id: "occasion",
        title: "What is your primary occasion or vibe?",
        subtitle: "Select the setting where you want your fragrance to make an impression",
        options: [
            { label: "Intimate Evening & Gala", desc: "Dark, sultry, captivating", value: "evening" },
            { label: "Daily Signature & Office", desc: "Clean, sophisticated, subtle elegance", value: "daily" },
            { label: "Warm Summer & Outdoor", desc: "Fresh, vibrant, ocean breeze", value: "summer" },
            { label: "Special Royal Celebrations", desc: "Rich amber, oud & opulent spice", value: "royal" },
        ]
    },
    {
        id: "notes",
        title: "Which olfactory family attracts you most?",
        subtitle: "Choose the notes that bring you comfort and confidence",
        options: [
            { label: "Warm Vanilla & Dark Oud", desc: "Rich, creamy gourmand with woods", value: "vanilla_oud" },
            { label: "Night Blooming Flowers", desc: "Jasmine, rose, and white blossom serenade", value: "floral" },
            { label: "Amber, Saffron & Spices", desc: "Exotic oriental warmth", value: "spicy" },
            { label: "Fresh Marine & Citrus Bergamot", desc: "Crisp aquatic energy", value: "fresh" },
        ]
    },
    {
        id: "intensity",
        title: "What longevity and projection do you prefer?",
        subtitle: "How long should your scent trial endure on skin?",
        options: [
            { label: "Beast Mode (14+ Hours)", desc: "Heavy trail (Sillage) that fills a room", value: "intense" },
            { label: "Refined Balance (8–10 Hours)", desc: "Moderate projection, elegant envelope", value: "moderate" },
            { label: "Intimate Skin Scent", desc: "Discreet luxury discovered up close", value: "subtle" },
        ]
    }
];

const RECOMMENDATIONS: Record<string, { name: string; tag: string; desc: string; notes: string; img: string; price: string }> = {
    evening: {
        name: "VELVET NOIR",
        tag: "Extrait de Parfum • 100ml",
        desc: "Hypnotic Madagascan vanilla infused with smoked agarwood and black cherry.",
        notes: "Black Cherry, Bulgarian Rose, Oud, Vanilla",
        img: "/products/perfume-1.jpg",
        price: "Rs. 16,500"
    },
    daily: {
        name: "FLORAL SERENITY",
        tag: "Eau de Parfum • 50ml",
        desc: "Night-blooming jasmine paired with white tea and Mysore sandalwood.",
        notes: "White Tea, Night Jasmine, White Musk",
        img: "/products/perfume-2.jpg",
        price: "Rs. 14,200"
    },
    royal: {
        name: "AMBER OUD EXTREME",
        tag: "Pure Parfum • 100ml",
        desc: "Royal amber resin blended with rare aged Cambodian agarwood and Kashmiri saffron.",
        notes: "Kashmiri Saffron, Amber Resin, Cambodian Oud",
        img: "/products/perfume-3.jpg",
        price: "Rs. 24,500"
    },
    summer: {
        name: "OCEAN BREEZE",
        tag: "Eau de Parfum • 100ml",
        desc: "Crisp marine accords mixed with sun-drenched bergamot and driftwood.",
        notes: "Sea Salt, Bergamot, Ambrette Seed",
        img: "/products/perfume-4.jpg",
        price: "Rs. 13,500"
    }
};

export default function ScentFinderModal({ isOpen, onClose, onAddToCart }: { isOpen: boolean; onClose: () => void; onAddToCart?: (perfume: any) => void }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [recommendation, setRecommendation] = useState<any>(null);

    const handleSelectOption = (questionId: string, val: string) => {
        const updated = { ...answers, [questionId]: val };
        setAnswers(updated);

        if (step < QUIZ_QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            // Calculate Result
            const occasion = updated.occasion || "evening";
            const match = RECOMMENDATIONS[occasion] || RECOMMENDATIONS.evening;
            setRecommendation(match);
        }
    };

    const resetQuiz = () => {
        setStep(0);
        setAnswers({});
        setRecommendation(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-950 border border-amber-400/30 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 relative text-white shadow-2xl overflow-hidden"
            >
                {/* Background Ambient Glow */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest">
                    <Sparkles className="w-4 h-4" /> Signature Scent Profiler
                </div>

                {!recommendation ? (
                    <div className="space-y-6">
                        {/* Progress Bar */}
                        <div className="flex items-center justify-between text-xs text-white/40">
                            <span>Step {step + 1} of {QUIZ_QUESTIONS.length}</span>
                            <div className="flex gap-1.5">
                                {QUIZ_QUESTIONS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 rounded-full transition-all ${
                                            i === step ? "w-6 bg-amber-400" : i < step ? "w-3 bg-amber-400/40" : "w-3 bg-white/10"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Current Question */}
                        <div className="space-y-2">
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight">
                                {QUIZ_QUESTIONS[step].title}
                            </h2>
                            <p className="text-xs text-white/60 font-light">
                                {QUIZ_QUESTIONS[step].subtitle}
                            </p>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 gap-3">
                            {QUIZ_QUESTIONS[step].options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectOption(QUIZ_QUESTIONS[step].id, opt.value)}
                                    className="group text-left bg-zinc-900/80 hover:bg-zinc-900 border border-white/10 hover:border-amber-400/60 p-4 rounded-2xl transition-all duration-300 flex items-center justify-between"
                                >
                                    <div>
                                        <div className="font-serif text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                                            {opt.label}
                                        </div>
                                        <div className="text-xs text-white/50 font-light mt-0.5">
                                            {opt.desc}
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Recommendation View */
                    <div className="space-y-6 text-center pt-2">
                        <div className="inline-block bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs px-3 py-1 rounded-full font-mono">
                            ✨ Your Olfactory Match
                        </div>

                        <div className="space-y-3">
                            <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden border border-amber-400/30 shadow-2xl bg-black">
                                <img
                                    src={recommendation.img}
                                    alt={recommendation.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-400">
                                    {recommendation.name}
                                </h2>
                                <p className="text-xs text-white/60 font-mono tracking-widest mt-1">
                                    {recommendation.tag}
                                </p>
                            </div>
                            <p className="text-xs text-white/80 max-w-md mx-auto leading-relaxed">
                                {recommendation.desc}
                            </p>
                            <div className="bg-zinc-900/80 border border-white/10 p-3 rounded-xl max-w-sm mx-auto text-xs text-amber-300/90 font-serif">
                                Key Notes: {recommendation.notes}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={resetQuiz}
                                className="flex-1 py-3 rounded-xl border border-white/15 hover:border-white/30 text-xs text-white/70 flex items-center justify-center gap-1.5"
                            >
                                <RefreshCw className="w-3.5 h-3.5" /> Retake Quiz
                            </button>
                            <button
                                onClick={() => {
                                    if (onAddToCart) onAddToCart(recommendation);
                                    onClose();
                                }}
                                className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
                            >
                                Add {recommendation.name} ({recommendation.price})
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
