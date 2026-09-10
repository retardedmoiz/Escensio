"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Phone, Mail, MapPin, Instagram, Facebook, Twitter, DollarSign, MessageCircle, Megaphone, AlertCircle, Image as ImageIcon, Upload, Eye, Check } from "lucide-react";
import API_URL, { getImageUrl } from "@/lib/api";

const PRESET_HERO_IMAGES = [
    { title: "Midnight Luxury", url: "/hero-new.jpg" },
    { title: "Gold & Amber Perfume", url: "/products/perfume-3.jpg" },
    { title: "Floral Serenity", url: "/products/perfume-2.jpg" },
    { title: "Ocean Breeze Fragrance", url: "/products/perfume-4.jpg" },
];

export default function AdminSettings() {
    const [settings, setSettings] = useState<any>({
        storeName: "ESCENSIO",
        storeTagline: "The Essence of Luxury Fragrances",
        heroTitle: "ESCENSIO",
        heroSubtitle: "Crafted for those who appreciate elegance. Experience luxury, confidence, and individuality — in every spray.",
        heroImage: "/hero-new.jpg",
        announcementBar: "✨ Special Offer: Free Complimentary 10ml Discovery Sample on Orders Over Rs. 15,000 | Visit Wah Cantt Kiosk",
        announcementEnabled: true,
        currency: "PKR",
        currencySymbol: "Rs.",
        taxRatePercentage: 5,
        storeEmail: "hello@escensio.com",
        storePhone: "+92 300 1234567",
        storeAddress: "POF Skating Park, Wah Cantt, Pakistan",
        whatsappNumber: "923001234567",
        marqueeText: "FREE EXPRESS SHIPPING ACROSS PAKISTAN • HANDCRAFTED PERFUMERY • KIOSK WAH CANTT • ESCENSIO LUXURY",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState("");
    const [previewTab, setPreviewTab] = useState<"edit" | "preview">("edit");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${API_URL}/api/settings`);
                if (res.ok) {
                    const data = await res.json();
                    setSettings((prev: any) => ({ ...prev, ...data }));
                }
            } catch (err) {
                console.error("Settings load error", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const set = (key: string, val: any) => setSettings((prev: any) => ({ ...prev, [key]: val }));

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setSavedMsg("Website settings saved successfully!");
                setTimeout(() => setSavedMsg(""), 4000);
            }
        } catch (err) {
            console.error("Save error", err);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fd = new FormData();
        fd.append("images", file);

        try {
            const res = await fetch(`${API_URL}/api/upload`, { method: "POST", body: fd });
            if (res.ok) {
                const { paths } = await res.json();
                if (paths && paths[0]) {
                    set(key, paths[0]);
                }
            }
        } catch (err) {
            console.error("Upload error", err);
        }
    };

    if (loading) {
        return (
            <div className="admin-page p-6 text-white/50 text-xs">
                Loading site configuration...
            </div>
        );
    }

    return (
        <div className="admin-page space-y-6">
            {/* Header */}
            <div className="admin-page-header flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                    <h1 className="admin-page-title text-2xl font-serif font-bold text-amber-400 flex items-center gap-2">
                        <Globe className="w-6 h-6" /> Website Settings & Hero Changer
                    </h1>
                    <p className="admin-page-subtitle text-xs text-white/60">
                        Dynamic Control Over Hero Imagery, Announcement Banners & Brand Details
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setPreviewTab(previewTab === "edit" ? "preview" : "edit")}
                        className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/15 hover:border-white/30 text-xs text-white flex items-center gap-1.5"
                    >
                        <Eye className="w-4 h-4 text-amber-400" /> {previewTab === "edit" ? "Hero Live Preview" : "Back to Edit"}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-400/20"
                    >
                        <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save All Settings"}
                    </button>
                </div>
            </div>

            {savedMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4" /> {savedMsg}
                </div>
            )}

            {/* LIVE HERO BANNER PREVIEW MODAL / SECTION */}
            {previewTab === "preview" && (
                <div className="bg-black border border-amber-400/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl space-y-6">
                    <div className="text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Real-Time Storefront Hero Preview
                    </div>
                    
                    <div className="relative h-96 rounded-xl overflow-hidden flex items-center justify-center text-center p-6">
                        {/* Background Image */}
                        <img
                            src={getImageUrl(settings.heroImage)}
                            alt="Hero Background"
                            className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[1px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />

                        {/* Banner Text overlay */}
                        <div className="relative z-10 max-w-2xl space-y-4">
                            {settings.announcementEnabled && settings.announcementBar && (
                                <div className="inline-block bg-amber-400/10 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-[11px] font-mono mb-2">
                                    {settings.announcementBar}
                                </div>
                            )}
                            <h1 className="text-4xl md:text-6xl font-bold font-serif text-amber-400 tracking-wider">
                                {settings.heroTitle || "ESCENSIO"}
                            </h1>
                            <p className="text-white/80 text-xs md:text-sm max-w-lg mx-auto font-light leading-relaxed">
                                {settings.heroSubtitle}
                            </p>
                            <div className="pt-2">
                                <button className="bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-full text-xs uppercase tracking-widest">
                                    Explore Collection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Form Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Hero Section & Imagery Control */}
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                        <ImageIcon className="w-5 h-5 text-amber-400" />
                        <div>
                            <h2 className="font-serif font-bold text-white text-base">Homepage Hero & Imagery</h2>
                            <p className="text-[11px] text-white/50">Change store banner picture, titles, and text</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="text-white/70 block mb-1 font-medium">Hero Main Title</label>
                            <input
                                type="text"
                                value={settings.heroTitle || ""}
                                onChange={e => set("heroTitle", e.target.value)}
                                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                            />
                        </div>

                        <div>
                            <label className="text-white/70 block mb-1 font-medium">Hero Subtitle</label>
                            <textarea
                                rows={2}
                                value={settings.heroSubtitle || ""}
                                onChange={e => set("heroSubtitle", e.target.value)}
                                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                            />
                        </div>

                        {/* Image Changer */}
                        <div>
                            <label className="text-white/70 block mb-1 font-medium">Hero Background Image</label>
                            
                            {/* Current Image Preview */}
                            <div className="relative h-32 rounded-xl overflow-hidden border border-white/15 mb-3 bg-black">
                                <img
                                    src={getImageUrl(settings.heroImage)}
                                    alt="Hero Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <label className="bg-amber-400 hover:bg-amber-300 text-black font-bold px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 text-xs transition-all shadow-lg">
                                        <Upload className="w-4 h-4" /> Upload New Hero Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => handleImageUpload(e, "heroImage")}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Preset Image Options */}
                            <label className="text-white/50 block mb-1.5 text-[11px]">Or Select from Curated Luxury Presets:</label>
                            <div className="grid grid-cols-4 gap-2">
                                {PRESET_HERO_IMAGES.map((preset, i) => (
                                    <div
                                        key={i}
                                        onClick={() => set("heroImage", preset.url)}
                                        className={`relative h-16 rounded-lg overflow-hidden cursor-pointer border transition-all ${
                                            settings.heroImage === preset.url
                                                ? "border-amber-400 ring-2 ring-amber-400/50"
                                                : "border-white/10 opacity-70 hover:opacity-100"
                                        }`}
                                    >
                                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Announcement Bar & Marquee */}
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                        <Megaphone className="w-5 h-5 text-amber-400" />
                        <div>
                            <h2 className="font-serif font-bold text-white text-base">Announcement & Marquee Banners</h2>
                            <p className="text-[11px] text-white/50">Header notification text and sliding store notice</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="text-white/70 block mb-1 font-medium">Header Announcement Bar Text</label>
                            <input
                                type="text"
                                value={settings.announcementBar || ""}
                                onChange={e => set("announcementBar", e.target.value)}
                                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                            />
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer pt-1">
                            <input
                                type="checkbox"
                                checked={settings.announcementEnabled || false}
                                onChange={e => set("announcementEnabled", e.target.checked)}
                                className="w-4 h-4 accent-amber-400 rounded"
                            />
                            <span className="text-white/80">Display Announcement Bar on Storefront Header</span>
                        </label>

                        <div className="pt-2 border-t border-white/10">
                            <label className="text-white/70 block mb-1 font-medium">Marquee Scrolling Text</label>
                            <textarea
                                rows={2}
                                value={settings.marqueeText || ""}
                                onChange={e => set("marqueeText", e.target.value)}
                                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Store Info & Currency */}
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                        <Globe className="w-5 h-5 text-amber-400" />
                        <div>
                            <h2 className="font-serif font-bold text-white text-base">Store Identity & Currency</h2>
                            <p className="text-[11px] text-white/50">Brand details, currency symbols, and tax rate</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-white/70 block mb-1 font-medium">Store Name</label>
                                <input
                                    type="text"
                                    value={settings.storeName || ""}
                                    onChange={e => set("storeName", e.target.value)}
                                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                                />
                            </div>
                            <div>
                                <label className="text-white/70 block mb-1 font-medium">Currency Symbol</label>
                                <input
                                    type="text"
                                    value={settings.currencySymbol || "Rs."}
                                    onChange={e => set("currencySymbol", e.target.value)}
                                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-white/70 block mb-1 font-medium">Store Tagline</label>
                            <input
                                type="text"
                                value={settings.storeTagline || ""}
                                onChange={e => set("storeTagline", e.target.value)}
                                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact & Social Links */}
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                        <Phone className="w-5 h-5 text-amber-400" />
                        <div>
                            <h2 className="font-serif font-bold text-white text-base">Contact & WhatsApp Orders</h2>
                            <p className="text-[11px] text-white/50">Store address, phone, and direct WhatsApp number</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="text-white/70 block mb-1 font-medium">Store Address / Kiosk Location</label>
                            <input
                                type="text"
                                value={settings.storeAddress || ""}
                                onChange={e => set("storeAddress", e.target.value)}
                                className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-white/70 block mb-1 font-medium">Phone Number</label>
                                <input
                                    type="text"
                                    value={settings.storePhone || ""}
                                    onChange={e => set("storePhone", e.target.value)}
                                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                                />
                            </div>
                            <div>
                                <label className="text-white/70 block mb-1 font-medium">WhatsApp Number (with country code)</label>
                                <input
                                    type="text"
                                    value={settings.whatsappNumber || ""}
                                    onChange={e => set("whatsappNumber", e.target.value)}
                                    placeholder="923001234567"
                                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
