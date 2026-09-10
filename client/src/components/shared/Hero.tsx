"use client";

import { motion } from "framer-motion";
import TextReveal from "../ui/TextReveal";
import ParallaxBackground from "../ui/ParallaxBackground";
import { ArrowRight } from "lucide-react";
import { useSettings } from "../providers/SettingsContext";
import { getImageUrl } from "@/lib/api";
import Link from "next/link";

export default function Hero({ image }: { image?: string }) {
    const { settings } = useSettings();
    const heroBg = image || getImageUrl(settings.heroImage) || "/hero-new.jpg";

    return (
        <section className="relative h-screen w-full overflow-hidden bg-[#120F0D] flex items-center justify-center">
            {/* Cinematic Parallax Background */}
            <ParallaxBackground image={heroBg} speed={0.3} className="opacity-35 blur-[1px]" />

            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#120F0D]/60 via-transparent to-[#120F0D] z-0" />

            <div className="z-10 text-center px-4 max-w-7xl mx-auto space-y-10 flex flex-col items-center pt-32 lg:pt-40">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="space-y-6"
                >
                    <div className="text-[12vw] sm:text-7xl md:text-9xl font-bold font-serif tracking-tight text-[#C89D54] overflow-hidden drop-shadow-2xl">
                        <TextReveal delay={0.2} duration={1.2}>
                            {settings.heroTitle || "ESCENSIO"}
                        </TextReveal>
                    </div>

                    <div className="overflow-hidden space-y-4 max-w-3xl mx-auto">
                        <motion.h2
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, delay: 0.8, ease: [0.33, 1, 0.68, 1] }}
                            className="text-xs sm:text-sm font-mono text-[#C89D54]/90 font-semibold tracking-[0.3em] uppercase"
                        >
                            {settings.storeTagline || "Artisanal Haute Parfumerie"}
                        </motion.h2>

                        <motion.p
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 1, ease: [0.33, 1, 0.68, 1] }}
                            className="text-xs md:text-sm text-[#EAE4D9]/70 font-light tracking-wider leading-relaxed max-w-2xl mx-auto"
                        >
                            {settings.heroSubtitle || "Handcrafted with rare botanical extracts, aged woods, and quiet elegance."}
                        </motion.p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1.4 }}
                >
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-3 bg-[#C89D54] hover:bg-[#b08743] text-black font-semibold px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#C89D54]/10 group"
                    >
                        Explore Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            {/* Subtle Line scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            >
                <div className="w-[1px] h-12 bg-[#C89D54]/20 overflow-hidden">
                    <motion.div
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-full h-1/2 bg-[#C89D54]"
                    />
                </div>
            </motion.div>
        </section>
    );
}
