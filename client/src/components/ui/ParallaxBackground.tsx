"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface ParallaxBackgroundProps {
    image: string;
    speed?: number; // Parallax speed factor
    className?: string;
}

export default function ParallaxBackground({ image, speed = 0.5, className }: ParallaxBackgroundProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

    return (
        <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
            <motion.div
                style={{ y }}
                className="w-full h-[120%] relative -top-[10%]" // Make it taller to allow movement
            >
                <Image
                    src={image}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </motion.div>
        </div>
    );
}
