"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
    children: string;
    className?: string;
    delay?: number;
    duration?: number;
    stagger?: number;
}

export default function TextReveal({
    children,
    className,
    delay = 0,
    duration = 0.5,
    stagger = 0.05
}: TextRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    const words = children.split(" ");

    return (
        <span ref={ref} className={cn("inline-block", className)}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em] overflow-hidden">
                    <motion.span
                        initial={{ y: "110%" }}
                        animate={isInView ? { y: 0 } : {}}
                        transition={{
                            duration: duration,
                            delay: delay + wordIndex * stagger,
                            ease: [0.33, 1, 0.68, 1] // Custom ease for "luxury" snap
                        }}
                        className="inline-block"
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}
