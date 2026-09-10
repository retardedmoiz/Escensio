"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useScroll, motion, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { ShoppingBag, Menu, User, X } from "lucide-react";
import { useCart } from "@/components/providers/CartContext";
import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/Marquee";

const NAV_LINKS = [
    { label: "Shop", href: "/shop" },
    { label: "Customise", href: "/customise" },
    { label: "Journal", href: "/blogs" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const { openCart, items } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest: number) => {
        setIsScrolled(latest > 60);
    });

    const totalQty = items.reduce((s, i) => s + i.quantity, 0);

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
                    isScrolled
                        ? "bg-background/95 backdrop-blur-xl border-b border-border/30 shadow-sm"
                        : "bg-transparent"
                )}
            >
                {/* Global Announcement Marquee */}
                <div className={cn("transition-all duration-500 overflow-hidden", isScrolled ? "h-0 opacity-0" : "h-auto opacity-100")}>
                    <Marquee />
                </div>

                <div className={cn("max-w-7xl mx-auto flex items-center justify-between px-6 md:px-14 transition-all duration-500", isScrolled ? "py-3" : "py-6")}>
                    {/* Logo */}
                    <Link href="/" className="relative flex items-center hover:opacity-75 transition-opacity duration-300">
                        <img
                            src="/logo.png"
                            alt="Escensio"
                            className="h-10 md:h-14 w-auto object-contain scale-[1.5] origin-left"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative group text-foreground/60 hover:text-foreground transition-colors duration-300"
                            >
                                {link.label}
                                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground transition-all duration-400 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        <Link
                            href="/login"
                            className="hidden md:flex items-center text-foreground/60 hover:text-foreground transition-colors duration-300"
                            aria-label="Account"
                        >
                            <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
                        </Link>

                        <button
                            onClick={openCart}
                            className="relative flex items-center text-foreground/60 hover:text-foreground transition-colors duration-300"
                            aria-label="Open cart"
                        >
                            <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                            {totalQty > 0 && (
                                <span className="absolute -top-2 -right-2 bg-foreground text-background text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
                                    {totalQty}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-foreground/70 hover:text-foreground transition-colors"
                            onClick={() => setMobileOpen(v => !v)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 top-0 z-30 bg-background flex flex-col items-center justify-center gap-10"
                    >
                        <Link href="/" onClick={() => setMobileOpen(false)} className="mb-6">
                            <img src="/logo.png" alt="Escensio" className="h-12 w-auto object-contain scale-[1.5]" />
                        </Link>
                        {[...NAV_LINKS, { label: "Login", href: "/login" }].map((link, i) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-2xl font-serif text-foreground/70 hover:text-foreground transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
