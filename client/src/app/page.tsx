"use client";

import Hero from "@/components/shared/Hero";
import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import Link from "next/link";
import { useState, useEffect } from "react";
import API_URL, { getImageUrl } from "@/lib/api";
import ProductCard from "@/components/shared/ProductCard";
import ScentFinderModal from "@/components/shop/ScentFinderModal";
import OlfactoryNotesVisualizer from "@/components/shop/OlfactoryNotesVisualizer";
import { Sparkles, MapPin, Compass, ArrowRight, ShieldCheck, Award, Heart, ShoppingBag, Clock } from "lucide-react";

export default function Home() {
  const [settings, setSettings] = useState<any>({});
  const [products, setProducts] = useState<any[]>([]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/settings`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});

    fetch(`${API_URL}/api/products?featured=true`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
  }, []);

  return (
    <main className="flex flex-col items-center justify-between overflow-hidden bg-zinc-950 text-white min-h-screen">
      
      {/* Dynamic Announcement Bar */}
      {settings.announcementEnabled && settings.announcementBar && (
        <div className="w-full bg-amber-400 text-black py-2 px-4 text-center font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 z-20 font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{settings.announcementBar}</span>
        </div>
      )}

      {/* Dynamic Hero Section */}
      <Hero image={getImageUrl(settings.heroImage)} />

      {/* Scrolling Marquee Banner */}
      <div className="w-full bg-black border-y border-white/10 py-4 overflow-hidden">
        <div className="whitespace-nowrap flex animate-marquee text-xs font-mono tracking-widest text-amber-400">
          <span className="mx-4">{settings.marqueeText || "FREE EXPRESS SHIPPING ACROSS PAKISTAN • HANDCRAFTED PERFUMERY • KIOSK WAH CANTT • ESCENSIO LUXURY"}</span>
          <span className="mx-4">•</span>
          <span className="mx-4">{settings.marqueeText || "FREE EXPRESS SHIPPING ACROSS PAKISTAN • HANDCRAFTED PERFUMERY • KIOSK WAH CANTT • ESCENSIO LUXURY"}</span>
        </div>
      </div>

      {/* Signature Scent Profiler Interactive CTA Banner */}
      <section className="w-full py-16 px-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-white/10">
        <div className="max-w-6xl mx-auto bg-black/60 border border-amber-400/30 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5 font-semibold">
              <Compass className="w-4 h-4" /> Personalized Fragrance Discovery
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-white leading-tight">
              Find Your Signature Perfume Profile
            </h2>
            <p className="text-white/70 text-sm font-light leading-relaxed">
              Answer 3 simple questions about your mood, occasion, and preferred notes to discover your bespoke ESCENSIO fragrance match.
            </p>
          </div>

          <div className="z-10">
            <button
              onClick={() => setIsQuizOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-8 py-4 rounded-full text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-amber-400/20 group"
            >
              Start Fragrance Quiz <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* The Art of Perfumery Section */}
      <section className="w-full py-24 md:py-36 bg-zinc-950 text-white px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
            >
                <span className="text-amber-400 uppercase tracking-[0.3em] text-xs font-mono">The Craftsmanship</span>
                <h2 className="text-4xl md:text-6xl font-bold font-serif leading-tight text-white">
                    <TextReveal>Crafting Unforgettable Memories</TextReveal>
                </h2>
                <p className="text-white/70 text-base leading-relaxed font-light">
                    Perfumery is the silent poetry of memory. At Escensio, we source the finest raw materials from around the globe—Madagascan vanilla, Calabrian bergamot, and Mysore sandalwood—to create complex, multi-layered extraits de parfum that evolve beautifully on your skin throughout the day.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                    <Link href="/about" className="inline-block border border-amber-400/40 text-amber-300 px-8 py-3.5 rounded-full text-xs uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-all duration-300">
                        Discover Our Story
                    </Link>
                    <Link href="/shop" className="inline-block bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-300">
                        Explore Catalog
                    </Link>
                </div>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="relative h-[550px] rounded-3xl overflow-hidden shadow-2xl border border-amber-400/20"
            >
                <img src="/hero-new.jpg" alt="Perfumery Process" className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-8">
                    <div className="text-white space-y-2">
                        <span className="text-amber-400 text-xs font-mono uppercase tracking-widest">Master Artisans</span>
                        <h3 className="text-2xl font-serif font-bold">Handcrafted In Small Batches</h3>
                        <p className="text-white/70 text-xs font-light">Every bottle aged 6 weeks for peak maturation</p>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* Signature Collections Section */}
      <section className="w-full py-24 bg-black text-white px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
                <span className="text-amber-400 uppercase tracking-[0.3em] text-xs font-mono">Curated Selection</span>
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-white">Signature Extraits</h2>
                <p className="text-xs text-white/50 max-w-md mx-auto">Explore high concentration luxury fragrances crafted for longevity</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Floral Serenity", desc: "A delicate balance of night jasmine and Mysore sandalwood.", img: getImageUrl(settings.category1Image || "/products/perfume-2.jpg") },
                    { title: "Wood & Spice", desc: "Warm Cambodian oud intertwined with Kashmiri saffron.", img: getImageUrl(settings.category2Image || "/products/perfume-3.jpg") },
                    { title: "Ocean Breeze", desc: "Crisp bergamot and aquatic marine accords.", img: getImageUrl(settings.category3Image || "/products/perfume-4.jpg") }
                ].map((item, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: idx * 0.15, duration: 0.6 }}
                        className="group cursor-pointer rounded-3xl overflow-hidden bg-zinc-900/80 border border-white/10 hover:border-amber-400/50 transition-all duration-500 shadow-xl"
                    >
                        <figure className="relative h-80 overflow-hidden bg-black">
                            <img src={item.img} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
                        </figure>
                        <div className="p-8 text-center space-y-4">
                            <h3 className="font-serif text-2xl tracking-wide text-amber-400">{item.title}</h3>
                            <p className="text-white/60 text-xs font-light leading-relaxed">{item.desc}</p>
                            <div className="pt-2">
                                <Link href="/shop" className="inline-block border border-amber-400/30 px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-amber-400 hover:text-black transition-all duration-300 font-semibold">
                                    Shop Collection
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Olfactory Architecture Visualizer Section */}
      <section className="w-full py-20 bg-zinc-950 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <OlfactoryNotesVisualizer />
        </div>
      </section>

      {/* Locations Section (POF Skating Park Wah Cantt) */}
      <section className="w-full py-24 bg-black text-white px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
                <span className="text-amber-400 uppercase tracking-[0.3em] text-xs font-mono">Physical Experience</span>
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-white">Visit Our Kiosk</h2>
                <p className="text-xs text-white/50 max-w-md mx-auto">Test and sample the full ESCENSIO collection in person</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Kiosk 1 */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6 bg-zinc-900 border border-white/10 p-6 rounded-3xl"
                >
                    <div className="h-72 w-full rounded-2xl overflow-hidden shadow-lg border border-white/10">
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
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
                            <MapPin className="w-4 h-4" /> Kiosk #01 Operational
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white">Wah Cantt Store Kiosk</h3>
                        <p className="text-white/60 text-xs font-light">POF Skating Park, Wah Cantt, Pakistan</p>
                        <p className="text-white/40 text-[11px] font-mono">Open Daily: 12:00 PM – 10:00 PM</p>
                    </div>
                </motion.div>

                {/* Kiosk 2: Coming Soon */}
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6 bg-zinc-900 border border-white/10 p-6 rounded-3xl flex flex-col justify-between"
                >
                    <div className="relative h-72 w-full rounded-2xl overflow-hidden shadow-lg border border-white/10 flex items-center justify-center bg-black">
                        <div className="text-center space-y-4 px-6">
                            <Sparkles className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
                            <h3 className="text-2xl font-serif text-amber-400">Unveiling Next Flagship</h3>
                            <p className="text-xs uppercase tracking-widest text-white/40 font-mono">Preparing the next luxury chapter</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="text-amber-400/60 text-xs font-mono uppercase tracking-widest">Coming Soon</span>
                        <h3 className="text-2xl font-serif font-bold text-white">Kiosk 2: Mystery Boutique</h3>
                        <p className="text-white/60 text-xs font-light">A new destination is currently being crafted.</p>
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
