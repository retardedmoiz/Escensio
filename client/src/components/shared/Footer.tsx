"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import API_URL from "@/lib/api";

const FOOTER_LINKS = {
    collections: [
        { label: "Men's Fragrances", href: "/shop" },
        { label: "Women's Fragrances", href: "/shop" },
        { label: "Unisex Collection", href: "/shop" },
        { label: "Best Sellers", href: "/shop" },
        { label: "Customise", href: "/customise" },
    ],
    company: [
        { label: "About Escensio", href: "/about" },
        { label: "Journal & News", href: "/blogs" },
        { label: "Contact Us", href: "/contact" },
        { label: "Login", href: "/admin" },
    ],
};

export default function Footer() {
    const [settings, setSettings] = useState<any>({});
    useEffect(() => {
        fetch(`${API_URL}/api/settings`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(() => {});
    }, []);

    return (
        <footer className="bg-[#0d0b09] text-white border-t border-white/5">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 md:px-14 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

                {/* Brand Column */}
                <div className="lg:col-span-1 space-y-7">
                    <img
                        src="/logo.png"
                        alt="Escensio Logo"
                        className="h-16 md:h-20 w-auto invert brightness-200 object-contain scale-[1.5] origin-left"
                    />
                    <p className="text-white/40 leading-loose text-[13px] font-light max-w-xs">
                        Crafting memories through the art of fine fragrance. Each bottle holds a story — discover yours.
                    </p>
                    <div className="flex gap-3">
                        <motion.a
                            href="https://www.instagram.com/escensio/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </motion.a>
                        <motion.a
                            href="https://www.facebook.com/people/Escensio/61560745726686/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </motion.a>
                    </div>
                </div>

                {/* Collections */}
                <div className="space-y-5">
                    <h4 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/25">Collections</h4>
                    <ul className="space-y-3">
                        {FOOTER_LINKS.collections.map(l => (
                            <li key={l.label}>
                                <Link href={l.href} className="text-[13px] text-white/45 hover:text-white/80 transition-colors duration-300 font-light">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Company */}
                <div className="space-y-5">
                    <h4 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/25">Company</h4>
                    <ul className="space-y-3">
                        {FOOTER_LINKS.company.map(l => (
                            <li key={l.label}>
                                <Link href={l.href} className="text-[13px] text-white/45 hover:text-white/80 transition-colors duration-300 font-light">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className="space-y-5">
                    <h4 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/25">Contact</h4>
                    <ul className="space-y-4">
                        <li className="flex gap-3 items-start text-[13px] text-white/45 font-light">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/20" strokeWidth={1.5} />
                            <span>{settings?.storeAddress || "Karachi, Pakistan"}</span>
                        </li>
                        <li className="flex gap-3 items-center text-[13px] text-white/45 font-light">
                            <Phone className="w-3.5 h-3.5 shrink-0 text-white/20" strokeWidth={1.5} />
                            <a href={`https://wa.me/${settings?.whatsappNumber || "923110043738"}`} className="hover:text-white/80 transition-colors">{settings?.storePhone || "+92 311 0043738"}</a>
                        </li>
                        <li className="flex gap-3 items-center text-[13px] text-white/45 font-light">
                            <Mail className="w-3.5 h-3.5 shrink-0 text-white/20" strokeWidth={1.5} />
                            <a href={`mailto:${settings?.storeEmail || "Support@ecsensiofragrance.com"}`} className="hover:text-white/80 transition-colors">{settings?.storeEmail || "Support@ecsensiofragrance.com"}</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-14 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-white/25">
                    <p>© {new Date().getFullYear()} Escensio. All rights reserved.</p>
                    <p>
                        Crafted with ❤️ by{" "}
                        <a
                            href="https://outmax.services"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-white/60 font-medium transition-colors"
                        >
                            Outmax Services
                        </a>
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-2">
                        <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy Policy</Link>
                        <span className="hidden sm:inline">·</span>
                        <Link href="/terms" className="hover:text-white/50 transition-colors">Terms of Service</Link>
                        <span className="hidden sm:inline">·</span>
                        <Link href="/refund" className="hover:text-white/50 transition-colors">Refund Policy</Link>
                        <span className="hidden sm:inline">·</span>
                        <Link href="/shipping" className="hover:text-white/50 transition-colors">Shipping Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
