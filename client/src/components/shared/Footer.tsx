"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin, Twitter } from "lucide-react";
import { useSettings } from "../providers/SettingsContext";

const FOOTER_LINKS = {
    collections: [
        { label: "Men's Parfums", href: "/shop" },
        { label: "Women's Parfums", href: "/shop" },
        { label: "Unisex Atelier", href: "/shop" },
        { label: "Discovery Atomizers", href: "/shop" },
        { label: "Bespoke Customise", href: "/customise" },
    ],
    company: [
        { label: "About Escensio", href: "/about" },
        { label: "Journal & Fragrance Art", href: "/blogs" },
        { label: "Kiosk & Contact", href: "/contact" },
        { label: "Management Portal", href: "/admin" },
    ],
};

export default function Footer() {
    const { settings } = useSettings();

    return (
        <footer className="bg-[#120F0D] text-[#EAE4D9] border-t border-[#332A22]">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 md:px-14 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

                {/* Brand Column */}
                <div className="lg:col-span-1 space-y-6">
                    <img
                        src="/logo.png"
                        alt="Escensio Logo"
                        className="h-14 w-auto object-contain origin-left"
                    />
                    <p className="text-[#EAE4D9]/60 leading-relaxed text-xs font-light max-w-xs">
                        {settings.storeTagline || "Artisanal Haute Parfumerie"}. Handcrafted with rare botanical extracts, aged woods, and quiet elegance.
                    </p>
                    <div className="flex gap-3">
                        {settings.instagramUrl && (
                            <motion.a
                                href={settings.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                className="w-8 h-8 border border-[#332A22] rounded-md flex items-center justify-center hover:border-[#C89D54] hover:text-[#C89D54] transition-all"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </motion.a>
                        )}
                        {settings.facebookUrl && (
                            <motion.a
                                href={settings.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                className="w-8 h-8 border border-[#332A22] rounded-md flex items-center justify-center hover:border-[#C89D54] hover:text-[#C89D54] transition-all"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </motion.a>
                        )}
                        {settings.twitterUrl && (
                            <motion.a
                                href={settings.twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                className="w-8 h-8 border border-[#332A22] rounded-md flex items-center justify-center hover:border-[#C89D54] hover:text-[#C89D54] transition-all"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </motion.a>
                        )}
                    </div>
                </div>

                {/* Collections */}
                <div className="space-y-5">
                    <h4 className="text-[10px] font-mono font-semibold uppercase tracking-[0.25em] text-[#C89D54]">Collections</h4>
                    <ul className="space-y-3">
                        {FOOTER_LINKS.collections.map(l => (
                            <li key={l.label}>
                                <Link href={l.href} className="text-xs text-[#EAE4D9]/60 hover:text-[#C89D54] transition-colors font-light">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Company */}
                <div className="space-y-5">
                    <h4 className="text-[10px] font-mono font-semibold uppercase tracking-[0.25em] text-[#C89D54]">Company</h4>
                    <ul className="space-y-3">
                        {FOOTER_LINKS.company.map(l => (
                            <li key={l.label}>
                                <Link href={l.href} className="text-xs text-[#EAE4D9]/60 hover:text-[#C89D54] transition-colors font-light">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className="space-y-5">
                    <h4 className="text-[10px] font-mono font-semibold uppercase tracking-[0.25em] text-[#C89D54]">Boutique & Kiosk</h4>
                    <ul className="space-y-3.5 text-xs text-[#EAE4D9]/60 font-light">
                        <li className="flex gap-2.5 items-start">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#C89D54]" strokeWidth={1.5} />
                            <span>{settings.storeAddress || "POF Skating Park, Wah Cantt, Pakistan"}</span>
                        </li>
                        <li className="flex gap-2.5 items-center">
                            <Phone className="w-3.5 h-3.5 shrink-0 text-[#C89D54]" strokeWidth={1.5} />
                            <a href={`https://wa.me/${settings.whatsappNumber || "923001234567"}`} className="hover:text-[#C89D54] transition-colors">
                                {settings.storePhone || "+92 300 1234567"}
                            </a>
                        </li>
                        <li className="flex gap-2.5 items-center">
                            <Mail className="w-3.5 h-3.5 shrink-0 text-[#C89D54]" strokeWidth={1.5} />
                            <a href={`mailto:${settings.storeEmail || "hello@escensio.com"}`} className="hover:text-[#C89D54] transition-colors">
                                {settings.storeEmail || "hello@escensio.com"}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#332A22]">
                <div className="max-w-7xl mx-auto px-6 md:px-14 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-[#EAE4D9]/40 font-mono">
                    <p>© {new Date().getFullYear()} ESCENSIO Haute Parfumerie. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-2">
                        <Link href="/privacy" className="hover:text-[#C89D54] transition-colors">Privacy Policy</Link>
                        <span>·</span>
                        <Link href="/terms" className="hover:text-[#C89D54] transition-colors">Terms of Service</Link>
                        <span>·</span>
                        <Link href="/refund" className="hover:text-[#C89D54] transition-colors">Refund Policy</Link>
                        <span>·</span>
                        <Link href="/shipping" className="hover:text-[#C89D54] transition-colors">Shipping Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
