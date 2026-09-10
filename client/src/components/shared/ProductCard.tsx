"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/CartContext";

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

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 120, damping: 18 });
    const mouseY = useSpring(y, { stiffness: 120, damping: 18 });
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-8deg", "8deg"]);

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
        addItem({ id: Number(id), title, price, image });
    };

    return (
        <motion.div
            ref={ref}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className={cn(
                "relative w-full aspect-[3/4] rounded-sm bg-card text-card-foreground cursor-pointer group",
                "perspective-1000",
                className
            )}
        >
            {/* Image */}
            <div
                style={{ transform: "translateZ(0)" }}
                className="absolute inset-0 rounded-sm overflow-hidden bg-muted product-img-wrap"
            >
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Info overlay */}
            <div
                style={{ transform: "translateZ(30px)" }}
                className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400"
            >
                <div className="bg-background/90 backdrop-blur-md px-4 py-3 rounded-sm border border-border/30 shadow-lg">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-[0.25em]">{category}</span>
                    <h3 className="text-base font-serif font-medium mt-0.5 truncate">{title}</h3>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-medium">Rs. {price.toLocaleString()}</p>
                        <button
                            onClick={handleAddToCart}
                            className="text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 bg-foreground text-background rounded-sm hover:opacity-80 transition-opacity font-medium"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* Sheen */}
            <div
                className="absolute inset-0 rounded-sm bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ transform: "translateZ(20px)" }}
            />
        </motion.div>
    );
}
