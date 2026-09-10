"use client";

import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import Link from "next/link";
import { useSettings } from "@/components/providers/SettingsContext";
import { getImageUrl } from "@/lib/api";

export default function AboutPage() {
    const { settings } = useSettings();

    return (
        <div className="min-h-screen bg-[#120F0D] text-[#EAE4D9] pt-32 pb-24 px-6 md:px-14">
            <div className="max-w-4xl mx-auto space-y-16">
                
                <div className="text-center space-y-6">
                    <span className="text-[#C89D54] uppercase tracking-[0.3em] text-xs font-mono">Our Heritage</span>
                    <h1 className="text-4xl md:text-6xl font-serif leading-tight font-bold text-[#EAE4D9]">
                        <TextReveal>Artisanal Mastery & Quiet Patience</TextReveal>
                    </h1>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="space-y-6 text-[#EAE4D9]/70 leading-relaxed font-light text-sm md:text-base max-w-3xl mx-auto"
                >
                    <p>
                        ESCENSIO was established with a singular belief: Authentic luxury cannot be rushed. Since 2022, our atelier has focused on mastering the quiet art of haute parfumerie through small-batch maturation and raw botanical extraction.
                    </p>
                    <p>
                        We shun artificial shortcuts in favor of patience. Every formulation is aged six weeks in wooden conditioning casks, allowing rare agarwood, Madagascan vanilla, and Kashmiri saffron to interweave harmoniously.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-[#C89D54]/30 shadow-2xl my-16 bg-black"
                >
                    <img
                        src={getImageUrl(settings.aboutHeroImage || "/hero-new.jpg")}
                        alt="Escensio Fragrance"
                        className="w-full h-full object-cover opacity-90"
                    />
                </motion.div>

                <div className="text-center space-y-4">
                    <span className="text-[#C89D54] font-mono text-xs uppercase tracking-[0.25em]">Physical Boutique</span>
                    <h2 className="text-3xl md:text-5xl font-serif leading-tight font-bold text-[#EAE4D9]">
                        Wah Cantt Flagship Kiosk
                    </h2>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="space-y-6 text-[#EAE4D9]/70 leading-relaxed font-light text-sm md:text-base max-w-3xl mx-auto"
                >
                    <p>
                        Today, our journey comes alive at our physical kiosk at POF Skating Park, Wah Cantt. Designed with minimalist wooden aesthetics, it is a space for fragrance connoisseurs to experience raw ingredients and test artisanal extraits in person.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-center pt-16 border-t border-[#332A22] mt-16 space-y-4"
                >
                    <img src="/logo.png" alt="Escensio Logo" className="h-14 mx-auto mb-4" />
                    <p className="text-xl font-serif font-bold text-[#C89D54]">{settings.storeName || "ESCENSIO"}</p>
                    <p className="text-[#EAE4D9]/40 font-mono tracking-[0.2em] uppercase text-xs">
                        {settings.storeTagline || "Artisanal Haute Parfumerie • Established 2022"}
                    </p>
                    
                    <div className="pt-6">
                        <Link href="/shop" className="inline-block bg-[#C89D54] hover:bg-[#b08743] text-black font-semibold px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.2em] transition-all">
                            Explore Fragrance Catalog
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
