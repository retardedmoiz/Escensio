"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

import { HTMLMotionProps } from "framer-motion";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    strength?: number; // How strong the pull is
}

export default function MagneticButton({
    children,
    className,
    strength = 30, // Increased default strength for evident effect
    ...props
}: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();

        // Calculate center of button
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Calculate distance from center
        const x = (clientX - centerX) / strength;
        const y = (clientY - centerY) / strength;

        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x * 10, y: position.y * 10 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={cn(
                "relative rounded-full px-8 py-3 overflow-hidden group",
                "bg-primary text-primary-foreground font-medium uppercase tracking-wider",
                "shadow-lg hover:shadow-xl transition-shadow duration-300",
                className
            )}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>

            {/* Fill effect on hover */}
            <div className="absolute inset-0 bg-primary-foreground/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        </motion.button>
    );
}
