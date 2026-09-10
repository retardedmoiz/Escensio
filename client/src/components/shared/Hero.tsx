"use client";

import { motion } from "framer-motion";

import TextReveal from "../ui/TextReveal";
import MagneticButton from "../ui/MagneticButton";
import ParallaxBackground from "../ui/ParallaxBackground";
import { ArrowRight } from "lucide-react";

export default function Hero({ image }: { image?: string }) {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-background flex items-center justify-center">
            {/* Cinematic Parallax Background */}
            <ParallaxBackground image={image || "/hero-new.jpg"} speed={0.3} className="opacity-40 blur-[1px]" />

            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/90 z-0" />

            <div className="z-10 text-center px-4 max-w-7xl mx-auto space-y-12 flex flex-col items-center pt-32 lg:pt-40">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="space-y-4"
                >
                    <h1 className="text-[13vw] sm:text-7xl md:text-9xl font-bold tracking-tighter text-primary overflow-hidden">
                        <TextReveal delay={0.2} duration={1.2}>
                            ESCENSIO
                        </TextReveal>
                    </h1>

                    <div className="overflow-hidden space-y-6 max-w-4xl mx-auto">
                        <motion.h2
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, delay: 0.8, ease: [0.33, 1, 0.68, 1] }}
                            className="text-lg md:text-xl text-primary/80 font-medium tracking-wide uppercase"
                        >
                            The Essence of Luxury Fragrances
                        </motion.h2>

                        <motion.p
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 1, ease: [0.33, 1, 0.68, 1] }}
                            className="text-sm md:text-base text-foreground/60 font-light tracking-widest leading-relaxed max-w-2xl mx-auto"
                        >
                            Discover the art of fine fragrance with Escensio. Crafted for those who appreciate elegance, our perfumes blend timeless notes with modern sophistication.
                            <br className="hidden md:block" />
                            Experience luxury, confidence, and individuality — in every spray.
                        </motion.p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                >
                    <MagneticButton strength={40} className="bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20">
                        Explore Collection <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
                </motion.div>
            </div>

            {/* Cinematic scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            >
                <div className="w-[1px] h-12 bg-muted-foreground/20 overflow-hidden">
                    <motion.div
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="w-full h-1/2 bg-primary/60"
                    />
                </div>
            </motion.div>
        </section>
    );
}
