"use client";

import { useState } from "react";
import { X, ArrowRight, RefreshCw, Compass } from "lucide-react";
import { motion } from "framer-motion";

const QUIZ_QUESTIONS = [
    {
        id: "occasion",
        title: "What is your primary occasion or setting?",
        subtitle: "Select the atmosphere where you want your fragrance to make an impression",
        options: [
            { label: "Intimate Evening & Gala", desc: "Dark, sultry, captivating presence", value: "evening" },
            { label: "Daily Signature & Office", desc: "Clean, quiet, subtle botanical elegance", value: "daily" },
            { label: "Warm Summer & Outdoor", desc: "Vibrant marine accords with citrus bergamot", value: "summer" },
            { label: "Royal Celebrations", desc: "Rich amber, agarwood & Kashmir saffron", value: "royal" },
        ]
    },
    {
        id: "notes",
        title: "Which olfactory family resonates with you?",
        subtitle: "Choose the raw botanical elements that inspire confidence",
        options: [
            { label: "Madagascan Vanilla & Aged Oud", desc: "Rich gourmand resins with dark woods", value: "vanilla_oud" },
            { label: "Night Blooming Flora", desc: "Jasmine, Bulgarian rose, and white iris", value: "floral" },
            { label: "Amber, Saffron & Spices", desc: "Exotic oriental warmth and leather", value: "spicy" },
            { label: "Citrus Bergamot & Sea Minerals", desc: "Crisp aquatic energy and sage", value: "fresh" },
        ]
    },
    {
        id: "intensity",
        title: "What sillage and longevity do you prefer?",
        subtitle: "Desired fragrance concentration and endurance on skin",
        options: [
            { label: "Beast Mode (14+ Hours)", desc: "Extrait concentration with heavy sillage", value: "intense" },
            { label: "Refined Balance (8–10 Hours)", desc: "Eau de Parfum with moderate projection", value: "moderate" },
            { label: "Intimate Skin Scent", desc: "Discreet luxury discovered up close", value: "subtle" },
        ]
    }
];

const RECOMMENDATIONS: Record<string, { name: string; tag: string; desc: string; notes: string; img: string; price: string }> = {
    evening: {
        name: "VELVET NOIR",
        tag: "Extrait de Parfum • 100ml",
        desc: "Hypnotic Madagascan vanilla infused with smoked agarwood and dark cherry.",
        notes: "Black Cherry, Bulgarian Rose, Oud, Vanilla",
        img: "/products/perfume-1.jpg",
        price: "Rs. 16,500"
    },
    daily: {
        name: "FLORAL SERENITY",
        tag: "Eau de Parfum • 50ml",
        desc: "Night-blooming jasmine paired with white tea leaves and Mysore sandalwood.",
        notes: "White Tea, Night Jasmine, White Musk",
        img: "/products/perfume-2.jpg",
        price: "Rs. 14,200"
    },
    royal: {
        name: "AMBER OUD EXTREME",
        tag: "Pure Parfum • 100ml",
        desc: "Royal amber resin blended with rare aged Cambodian agarwood and Kashmir saffron.",
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
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#120F0D] border border-[#C89D54]/30 rounded-2xl max-w-xl w-full p-6 md:p-8 space-y-6 relative text-[#EAE4D9] shadow-2xl overflow-hidden"
            >
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-[#EAE4D9]/50 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 text-[#C89D54] font-mono text-xs uppercase tracking-[0.2em]">
                    <Compass className="w-4 h-4" /> Signature Scent Profiler
                </div>

                {!recommendation ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between text-xs text-[#EAE4D9]/40 font-mono">
                            <span>Question {step + 1} of {QUIZ_QUESTIONS.length}</span>
                            <div className="flex gap-1.5">
                                {QUIZ_QUESTIONS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 transition-all ${
                                            i === step ? "w-6 bg-[#C89D54]" : i < step ? "w-3 bg-[#C89D54]/40" : "w-3 bg-white/10"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#EAE4D9] leading-tight">
                                {QUIZ_QUESTIONS[step].title}
                            </h2>
                            <p className="text-xs text-[#EAE4D9]/60 font-light">
                                {QUIZ_QUESTIONS[step].subtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {QUIZ_QUESTIONS[step].options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectOption(QUIZ_QUESTIONS[step].id, opt.value)}
                                    className="group text-left bg-[#181410] hover:bg-black border border-[#332A22] hover:border-[#C89D54]/60 p-4 rounded-xl transition-all duration-300 flex items-center justify-between"
                                >
                                    <div>
                                        <div className="font-serif text-sm font-semibold text-[#EAE4D9] group-hover:text-[#C89D54] transition-colors">
                                            {opt.label}
                                        </div>
                                        <div className="text-xs text-[#EAE4D9]/50 font-light mt-0.5">
                                            {opt.desc}
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#C89D54] group-hover:translate-x-1 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 text-center pt-2">
                        <div className="inline-block border border-[#C89D54]/40 text-[#C89D54] text-xs px-3 py-1 rounded-sm font-mono uppercase tracking-widest">
                            Your Olfactory Match
                        </div>

                        <div className="space-y-3">
                            <div className="relative w-40 h-40 mx-auto rounded-xl overflow-hidden border border-[#C89D54]/30 shadow-2xl bg-black">
                                <img
                                    src={recommendation.img}
                                    alt={recommendation.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#C89D54]">
                                    {recommendation.name}
                                </h2>
                                <p className="text-xs text-[#EAE4D9]/60 font-mono tracking-widest mt-1">
                                    {recommendation.tag}
                                </p>
                            </div>
                            <p className="text-xs text-[#EAE4D9]/80 max-w-md mx-auto leading-relaxed font-light">
                                {recommendation.desc}
                            </p>
                            <div className="bg-[#181410] border border-[#332A22] p-3 rounded-lg max-w-sm mx-auto text-xs text-[#C89D54] font-serif">
                                Key Notes: {recommendation.notes}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={resetQuiz}
                                className="flex-1 py-3 rounded-sm border border-[#332A22] text-xs text-[#EAE4D9]/70 flex items-center justify-center gap-1.5 hover:border-[#C89D54]/50"
                            >
                                <RefreshCw className="w-3.5 h-3.5" /> Retake Quiz
                            </button>
                            <button
                                onClick={() => {
                                    if (onAddToCart) onAddToCart(recommendation);
                                    onClose();
                                }}
                                className="flex-1 bg-[#C89D54] hover:bg-[#b08743] text-black font-semibold py-3 rounded-sm text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                            >
                                Select {recommendation.name} ({recommendation.price})
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
