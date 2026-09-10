"use client";

import Hero from "@/components/shared/Hero";
import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import Link from "next/link";
import { useState, useEffect } from "react";
import API_URL, { getImageUrl } from "@/lib/api";
import ScentFinderModal from "@/components/shop/ScentFinderModal";
import OlfactoryNotesVisualizer from "@/components/shop/OlfactoryNotesVisualizer";
import { MapPin, Compass, ArrowRight, Sparkles } from "lucide-react";
import { useSettings } from "@/components/providers/SettingsContext";

export default function Home() {
  const { settings } = useSettings();
  const [products, setProducts] = useState<any[]>([]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/products?featured=true`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
  }, []);

  return (
    <main className="flex flex-col items-center justify-between overflow-hidden bg-[#120F0D] text-[#EAE4D9] min-h-screen">
      
      {/* Announcement Bar */}
      {settings.announcementEnabled && settings.announcementBar && (
        <div className="w-full bg-[#C89D54] text-black py-2 px-4 text-center font-medium text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 z-20 font-mono">
          <span>{settings.announcementBar}</span>
        </div>
      )}

      {/* Dynamic Hero Section */}
      <Hero image={getImageUrl(settings.heroImage)} />

      {/* Signature Scent Profiler CTA Banner */}
      <section className="w-full py-20 px-6 bg-[#181410] border-y border-[#332A22]">
        <div className="max-w-6xl mx-auto bg-[#120F0D] border border-[#C89D54]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <span className="text-[#C89D54] font-mono text-xs uppercase tracking-[0.25em] flex items-center justify-center md:justify-start gap-2 font-semibold">
              <Compass className="w-4 h-4" /> Fragrance Profile Quiz
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#EAE4D9] leading-tight">
              Discover Your Signature Olfactory Identity
            </h2>
            <p className="text-[#EAE4D9]/70 text-xs md:text-sm font-light leading-relaxed">
              Explore your scent preferences through 3 quiet questions regarding mood, occasion, and raw botanical notes.
            </p>
          </div>

          <div className="z-10">
            <button
              onClick={() => setIsQuizOpen(true)}
              className="bg-[#C89D54] hover:bg-[#b08743] text-black font-semibold px-8 py-4 rounded-sm text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-[#C89D54]/10 group"
            >
              Start Scent Quiz <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Craftsmanship & Story Section */}
      <section className="w-full py-24 md:py-36 bg-[#120F0D] text-[#EAE4D9] px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
            >
                <span className="text-[#C89D54] uppercase tracking-[0.3em] text-xs font-mono">The Atelier</span>
                <h2 className="text-4xl md:text-6xl font-bold font-serif leading-tight text-[#EAE4D9]">
                    <TextReveal>Artisanal Formulations & Aged Woods</TextReveal>
                </h2>
                <p className="text-[#EAE4D9]/70 text-xs md:text-sm leading-relaxed font-light">
                    Haute parfumerie is the silent architecture of presence. At ESCENSIO, we harvest rare natural raw ingredients—Madagascan vanilla beans, Calabrian bergamot, Kashmiri saffron, and aged agarwood—matured for six weeks to yield extraits de parfum of exceptional concentration.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                    <Link href="/about" className="inline-block border border-[#C89D54]/40 text-[#C89D54] px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.2em] hover:bg-[#C89D54] hover:text-black transition-all duration-300">
                        Our Philosophy
                    </Link>
                    <Link href="/shop" className="inline-block bg-[#181410] border border-[#332A22] text-[#EAE4D9] px-8 py-3.5 rounded-sm text-xs uppercase tracking-[0.2em] hover:border-[#C89D54]/60 transition-all duration-300">
                        Explore Catalog
                    </Link>
                </div>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative h-[550px] rounded-2xl overflow-hidden shadow-2xl border border-[#C89D54]/20 bg-black"
            >
                <img
                    src={getImageUrl(settings.aboutCraftImage || "/hero-new.jpg")}
                    alt="Artisanal Perfumery Process"
                    className="object-cover w-full h-full opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-black/30 to-transparent flex items-end p-8">
                    <div className="text-[#EAE4D9] space-y-2">
                        <span className="text-[#C89D54] text-xs font-mono uppercase tracking-[0.25em]">Hand-Bottled Selection</span>
                        <h3 className="text-2xl font-serif font-bold">Matured for Peak Longevity</h3>
                        <p className="text-[#EAE4D9]/60 text-xs font-light">Small batch extraits crafted with meticulous precision</p>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Signature Collections Section */}
      <section className="w-full py-24 bg-[#181410] text-[#EAE4D9] px-6 border-t border-[#332A22]">
        <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
                <span className="text-[#C89D54] uppercase tracking-[0.3em] text-xs font-mono">Curated Selections</span>
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#EAE4D9]">Signature Blends</h2>
                <p className="text-xs text-[#EAE4D9]/50 max-w-md mx-auto">Explore high-concentration botanical extraits de parfum</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Floral Serenity", desc: "Night-blooming jasmine paired with Mysore sandalwood.", img: getImageUrl(settings.category1Image || "/products/perfume-2.jpg") },
                    { title: "Wood & Spice", desc: "Warm Cambodian agarwood intertwined with Kashmiri saffron.", img: getImageUrl(settings.category2Image || "/products/perfume-3.jpg") },
                    { title: "Ocean Breeze", desc: "Crisp bergamot and aquatic marine minerals.", img: getImageUrl(settings.category3Image || "/products/perfume-4.jpg") }
                ].map((item, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: idx * 0.15, duration: 0.6 }}
                        className="group bg-[#120F0D] border border-[#332A22] hover:border-[#C89D54]/50 rounded-2xl overflow-hidden transition-all duration-500 shadow-xl"
                    >
                        <figure className="relative h-80 overflow-hidden bg-black">
                            <img src={item.img} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                        </figure>
                        <div className="p-8 text-center space-y-4">
                            <h3 className="font-serif text-2xl tracking-wide text-[#C89D54]">{item.title}</h3>
                            <p className="text-[#EAE4D9]/60 text-xs font-light leading-relaxed">{item.desc}</p>
                            <div className="pt-2">
                                <Link href="/shop" className="inline-block border border-[#C89D54]/30 px-8 py-3 rounded-sm text-xs uppercase tracking-[0.2em] hover:bg-[#C89D54] hover:text-black transition-all duration-300 font-semibold">
                                    Shop Collection
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Olfactory Visualizer Section */}
      <section className="w-full py-20 bg-[#120F0D] px-6 border-t border-[#332A22]">
        <div className="max-w-4xl mx-auto">
          <OlfactoryNotesVisualizer />
        </div>
      </section>

      {/* Physical Kiosk Section */}
      <section className="w-full py-24 bg-[#181410] text-[#EAE4D9] px-6 border-t border-[#332A22]">
        <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
                <span className="text-[#C89D54] uppercase tracking-[0.3em] text-xs font-mono">Boutique & Kiosk</span>
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#EAE4D9]">Physical Counter</h2>
                <p className="text-xs text-[#EAE4D9]/50 max-w-md mx-auto">Sample and experience the complete ESCENSIO collection in person</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Kiosk 1 */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6 bg-[#120F0D] border border-[#332A22] p-6 rounded-2xl"
                >
                    <div className="h-72 w-full rounded-xl overflow-hidden shadow-lg border border-[#332A22]">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3314.931295982705!2d72.7844009756182!3d33.74312297316104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfa732298c4b27%3A0xe5a36372b8ce27dc!2sPOF%20Skating%20Park!5e0!3m2!1sen!2s!4v1701234567890!5m2!1sen!2s" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[#C89D54] text-xs font-mono">
                            <MapPin className="w-4 h-4" /> Kiosk #01 Active
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-[#EAE4D9]">Wah Cantt Kiosk</h3>
                        <p className="text-[#EAE4D9]/60 text-xs font-light">{settings.storeAddress || "POF Skating Park, Wah Cantt, Pakistan"}</p>
                    </div>
                </motion.div>

                {/* Kiosk 2 */}
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6 bg-[#120F0D] border border-[#332A22] p-6 rounded-2xl flex flex-col justify-between"
                >
                    <div className="relative h-72 w-full rounded-xl overflow-hidden shadow-lg border border-[#332A22] flex items-center justify-center bg-black">
                        <img src={getImageUrl(settings.contactBannerImage || "/hero-new.jpg")} alt="" className="w-full h-full object-cover opacity-40" />
                        <div className="absolute text-center space-y-3 px-6">
                            <span className="text-[#C89D54] font-mono text-xs uppercase tracking-[0.25em]">Upcoming Flagship</span>
                            <h3 className="text-2xl font-serif text-[#EAE4D9]">Next Destination</h3>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[#C89D54]/70 text-xs font-mono uppercase tracking-widest">In Preparation</span>
                        <h3 className="text-2xl font-serif font-bold text-[#EAE4D9]">Kiosk #02 Boutique</h3>
                        <p className="text-[#EAE4D9]/60 text-xs font-light">Crafting the next artisanal destination.</p>
                    </div>
                </motion.div>
            </div>
        </div>
      </section>

      {/* Scent Finder Modal Component */}
      <ScentFinderModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </main>
  );
}
