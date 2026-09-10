"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartContext";
import { useSettings } from "../providers/SettingsContext";

interface ProductCardProps {
    id: string | number;
    title: string;
    price: number;
    image: string;
    category: string;
    className?: string;
}

export default function ProductCard({ id, title, price, image, category, className }: ProductCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { addItem } = useCart();
    const { settings } = useSettings();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 120, damping: 18 });
    const mouseY = useSpring(y, { stiffness: 120, damping: 18 });
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["6deg", "-6deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-6deg", "6deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
        y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
    };

    const handleMouseLeave = () => { x.set(0); y.set(0); };

    const handleClick = () => {
        router.push(`/shop/${id}`);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem({ id: Number(id) || 1, title, price, image });
    };

    return (
        <motion.div
            ref={ref}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className={cn(
                "relative w-full aspect-[3/4] rounded-xl bg-[#181410] border border-[#332A22] text-[#EAE4D9] cursor-pointer group shadow-xl",
                "perspective-1000",
                className
            )}
        >
            {/* Image Container */}
            <div
                style={{ transform: "translateZ(0)" }}
                className="absolute inset-0 rounded-xl overflow-hidden bg-black"
            >
                <img
                    src={image || "/products/perfume-1.jpg"}
                    alt={title}
                    className="w-full h-full object-cover opacity-85 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
            </div>

            {/* Info overlay */}
            <div
                style={{ transform: "translateZ(25px)" }}
                className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-400"
            >
                <div className="bg-[#120F0D]/95 backdrop-blur-md px-4 py-3 rounded-lg border border-[#C89D54]/30 shadow-2xl space-y-1">
                    <span className="text-[9px] text-[#C89D54] font-mono uppercase tracking-[0.25em]">{category}</span>
                    <h3 className="text-sm font-serif font-bold text-[#EAE4D9] truncate">{title}</h3>
                    <div className="flex items-center justify-between pt-1 border-t border-[#332A22] mt-1">
                        <p className="text-xs font-mono font-bold text-[#C89D54]">
                            {settings.currencySymbol || "Rs."} {price.toLocaleString()}
                        </p>
                        <button
                            onClick={handleAddToCart}
                            className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 bg-[#C89D54] hover:bg-[#b08743] text-black font-bold rounded-sm transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
