"use client";

import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-14">
            <div className="max-w-4xl mx-auto space-y-16">
                
                <div className="text-center space-y-6">
                    <span className="text-primary uppercase tracking-[0.3em] text-sm font-medium">Our Story</span>
                    <h1 className="text-5xl md:text-7xl font-serif leading-tight">
                        <TextReveal>The 4-Year Grind (2022)</TextReveal>
                    </h1>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="prose prose-lg mx-auto text-muted-foreground"
                >
                    <p className="leading-relaxed">
                        Four years ago, Escensio started with a simple but powerful belief: Great things take time, and true quality cannot be rushed. In 2022, we set out to craft luxury fragrances that could stand proudly alongside international standards.
                    </p>
                    <p className="leading-relaxed">
                        For four long years, we poured absolute dedication, endless trials, and pure hard work into this brand. We didn’t focus on shortcuts; we focused on mastering formulations, perfecting our clean design aesthetic, and earning the trust of our community, drop by drop.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl my-16"
                >
                    <img src="/hero-new.jpg" alt="Escensio Fragrance" className="w-full h-full object-cover" />
                </motion.div>

                <div className="text-center space-y-6">
                    <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                        The Milestone: Wah Cantt (2026)
                    </h2>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="prose prose-lg mx-auto text-muted-foreground"
                >
                    <p className="leading-relaxed">
                        The biggest lesson we learned over these four years of hard work is that consistency always rewards you. Today, that journey of patience and grit has culminated into our proudest moment yet.
                    </p>
                    <p className="leading-relaxed font-medium text-foreground">
                        After four years of digital growth, we have finally opened our very first physical outlet in Wah Cantt.
                    </p>
                    <p className="leading-relaxed">
                        This storefront is the living reality of our four-year grind. It is a minimalist space designed for you to walk in, experience the craftsmanship in person, and feel the luxury we have been passionately bottling since day one.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-center pt-16 border-t border-border mt-16 space-y-4"
                >
                    <img src="/logo.png" alt="Escensio Logo" className="h-16 mx-auto mb-6 dark:invert" />
                    <p className="text-xl font-serif font-medium text-foreground">Escensio</p>
                    <p className="text-muted-foreground tracking-widest uppercase text-sm">4 Years of Grit. Lifetimes of Elegance. Since 2022.</p>
                    
                    <div className="pt-8">
                        <Link href="/shop" className="btn btn-primary rounded-full px-8">
                            Experience The Collection
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
