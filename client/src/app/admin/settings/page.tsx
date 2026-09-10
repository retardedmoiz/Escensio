"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Phone, Mail, MapPin, Instagram, Facebook, Twitter, DollarSign, MessageCircle, Megaphone, Image as ImageIcon, Upload, Eye, Check, RefreshCw, Link as LinkIcon } from "lucide-react";
import API_URL, { getImageUrl } from "@/lib/api";
import { useSettings } from "@/components/providers/SettingsContext";
import { compressImage } from "@/lib/imageCompressor";

const PRESET_HERO_IMAGES = [
    { title: "Midnight Cedarwood", url: "/hero-new.jpg" },
    { title: "Amber & Botanical Oud", url: "/products/perfume-3.jpg" },
    { title: "Floral Jasmine Atelier", url: "/products/perfume-2.jpg" },
    { title: "Aquatic Marine Breeze", url: "/products/perfume-4.jpg" },
];

export default function AdminSettings() {
    const { settings, updateSettings, loading: contextLoading } = useSettings();
    const [localSettings, setLocalSettings] = useState<any>(settings);
    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState("");
    const [previewTab, setPreviewTab] = useState<"edit" | "preview">("edit");
    const [uploadingKey, setUploadingKey] = useState<string | null>(null);

    // Sync localSettings whenever settings finishes fetching from API
    useEffect(() => {
        if (settings) {
            setLocalSettings((prev: any) => ({ ...prev, ...settings }));
        }
    }, [settings]);

    const set = (key: string, val: any) => {
        setLocalSettings((prev: any) => ({ ...prev, [key]: val }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const success = await updateSettings(localSettings);
            if (success) {
                setSavedMsg("Settings & Imagery saved successfully across all pages!");
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

        setUploadingKey(key);

        try {
            // Compress image client-side to max 1400px and 0.82 quality webp (~90KB size)
            const compressed = await compressImage(file, 1400, 1400, 0.82);
            set(key, compressed);

            // Instantly update global settings context
            const success = await updateSettings({ [key]: compressed });
            if (success) {
                setSavedMsg(`Image changed & saved in real time!`);
                setTimeout(() => setSavedMsg(""), 4000);
            }
        } catch (err) {
            console.error("Upload error", err);
        } finally {
            setUploadingKey(null);
        }
    };

    const handleSelectPreset = async (key: string, url: string) => {
        set(key, url);
        await updateSettings({ [key]: url });
        setSavedMsg("Preset image updated!");
        setTimeout(() => setSavedMsg(""), 3000);
    };

    return (
        <div className="admin-page space-y-6">
            {/* Header */}
            <div className="admin-page-header flex justify-between items-center pb-4 border-b border-[#332A22]">
                <div>
                    <h1 className="admin-page-title text-2xl font-serif font-bold text-[#C89D54] flex items-center gap-2">
                        <Globe className="w-6 h-6" /> Site Settings & Master Image Control
                    </h1>
                    <p className="admin-page-subtitle text-xs text-[#EAE4D9]/60">
                        Manage Real-Time Imagery & Brand Content Across Every Page
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setPreviewTab(previewTab === "edit" ? "preview" : "edit")}
                        className="px-3.5 py-2 rounded-xl bg-[#1A1612] border border-[#C89D54]/30 hover:border-[#C89D54]/60 text-xs text-[#EAE4D9] flex items-center gap-1.5 transition-all"
                    >
                        <Eye className="w-4 h-4 text-[#C89D54]" /> {previewTab === "edit" ? "Hero Live Preview" : "Back to Edit"}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl bg-[#C89D54] hover:bg-[#b08743] disabled:opacity-50 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-[#C89D54]/10 transition-all"
                    >
                        <Save className="w-4 h-4" /> {saving ? "Updating..." : "Save All Changes"}
                    </button>
                </div>
            </div>

            {savedMsg && (
                <div className="bg-[#C89D54]/10 border border-[#C89D54]/30 text-[#C89D54] text-xs p-3.5 rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4" /> {savedMsg}
                </div>
            )}

            {/* LIVE HERO BANNER PREVIEW */}
            {previewTab === "preview" && (
                <div className="bg-[#181410] border border-[#C89D54]/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl space-y-6">
                    <div className="text-xs uppercase tracking-widest text-[#C89D54] font-mono font-semibold flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Real-Time Storefront Preview
                    </div>
                    
                    <div className="relative h-96 rounded-xl overflow-hidden flex items-center justify-center text-center p-6 bg-black">
                        <img
                            src={getImageUrl(localSettings.heroImage)}
                            alt="Hero Background"
                            className="absolute inset-0 w-full h-full object-cover opacity-45 blur-[1px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />

                        <div className="relative z-10 max-w-2xl space-y-4">
                            {localSettings.announcementEnabled && localSettings.announcementBar && (
                                <div className="inline-block bg-[#C89D54]/10 border border-[#C89D54]/30 text-[#C89D54] px-3 py-1 rounded-sm text-[11px] font-mono tracking-wider">
                                    {localSettings.announcementBar}
                                </div>
                            )}
                            <h1 className="text-4xl md:text-6xl font-bold font-serif text-[#C89D54] tracking-wider">
                                {localSettings.heroTitle || "ESCENSIO"}
                            </h1>
                            <p className="text-[#EAE4D9]/80 text-xs md:text-sm max-w-lg mx-auto font-light leading-relaxed">
                                {localSettings.heroSubtitle}
                            </p>
                            <div className="pt-2">
                                <span className="inline-block bg-[#C89D54] text-black font-semibold px-6 py-2.5 rounded-sm text-xs uppercase tracking-widest">
                                    Explore Collection
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Form Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Homepage Hero & Banner */}
                <div className="bg-[#181410] border border-[#332A22] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#332A22]">
                        <ImageIcon className="w-5 h-5 text-[#C89D54]" />
                        <div>
                            <h2 className="font-serif font-bold text-[#EAE4D9] text-base">Homepage Hero Banner</h2>
                            <p className="text-[11px] text-[#EAE4D9]/50">Main hero image, title, and subtitle</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="text-[#EAE4D9]/70 block mb-1 font-medium">Hero Title</label>
                            <input
                                type="text"
                                value={localSettings.heroTitle || ""}
                                onChange={e => set("heroTitle", e.target.value)}
                                className="w-full bg-black/50 border border-[#332A22] rounded-xl px-3 py-2 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54]"
                            />
                        </div>

                        <div>
                            <label className="text-[#EAE4D9]/70 block mb-1 font-medium">Hero Subtitle</label>
                            <textarea
                                rows={2}
                                value={localSettings.heroSubtitle || ""}
                                onChange={e => set("heroSubtitle", e.target.value)}
                                className="w-full bg-black/50 border border-[#332A22] rounded-xl px-3 py-2 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54]"
                            />
                        </div>

                        <div>
                            <label className="text-[#EAE4D9]/70 block mb-1 font-medium">Hero Background Image</label>
                            
                            {/* URL Direct Input */}
                            <div className="mb-2">
                                <input
                                    type="text"
                                    placeholder="Or paste image URL (https://...)"
                                    value={localSettings.heroImage || ""}
                                    onChange={e => set("heroImage", e.target.value)}
                                    className="w-full bg-black/50 border border-[#332A22] rounded-lg px-2.5 py-1.5 text-xs text-[#EAE4D9] focus:outline-none focus:border-[#C89D54] font-mono"
                                />
                            </div>

                            <div className="relative h-36 rounded-xl overflow-hidden border border-[#332A22] mb-3 bg-black">
                                <img
                                    src={getImageUrl(localSettings.heroImage)}
                                    alt="Hero Preview"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <label className="bg-[#C89D54] hover:bg-[#b08743] text-black font-bold px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 text-xs transition-all shadow-lg">
                                        <Upload className="w-4 h-4" /> {uploadingKey === "heroImage" ? "Uploading..." : "Upload New Image"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => handleImageUpload(e, "heroImage")}
                                        />
                                    </label>
                                </div>
                            </div>

                            <label className="text-[#EAE4D9]/50 block mb-1.5 text-[11px]">Select Preset Imagery:</label>
                            <div className="grid grid-cols-4 gap-2">
                                {PRESET_HERO_IMAGES.map((preset, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleSelectPreset("heroImage", preset.url)}
                                        className={`relative h-16 rounded-lg overflow-hidden cursor-pointer border transition-all ${
                                            localSettings.heroImage === preset.url
                                                ? "border-[#C89D54] ring-2 ring-[#C89D54]/50"
                                                : "border-[#332A22] opacity-70 hover:opacity-100"
                                        }`}
                                    >
                                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Collection Categories Imagery (Shop Banners) */}
                <div className="bg-[#181410] border border-[#332A22] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#332A22]">
                        <ImageIcon className="w-5 h-5 text-[#C89D54]" />
                        <div>
                            <h2 className="font-serif font-bold text-[#EAE4D9] text-base">Collection Category Imagery</h2>
                            <p className="text-[11px] text-[#EAE4D9]/50">Card images for shop collections</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                        {[
                            { label: "Category 1 (Floral Serenity)", key: "category1Image" },
                            { label: "Category 2 (Wood & Spice)", key: "category2Image" },
                            { label: "Category 3 (Ocean Breeze)", key: "category3Image" },
                            { label: "Category 4 (Amber Oud)", key: "category4Image" },
                        ].map(cat => (
                            <div key={cat.key} className="space-y-1">
                                <label className="text-[#EAE4D9]/70 block truncate text-[11px]">{cat.label}</label>
                                
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={localSettings[cat.key] || ""}
                                    onChange={e => set(cat.key, e.target.value)}
                                    className="w-full bg-black/50 border border-[#332A22] rounded-md px-2 py-1 text-[11px] text-[#EAE4D9] font-mono focus:outline-none focus:border-[#C89D54] mb-1"
                                />

                                <div className="relative h-24 rounded-lg overflow-hidden border border-[#332A22] bg-black">
                                    <img src={getImageUrl(localSettings[cat.key])} alt="" className="w-full h-full object-cover" />
                                    <label className="absolute bottom-1 right-1 bg-[#181410]/95 text-[#C89D54] border border-[#C89D54]/40 px-2.5 py-1 rounded text-[10px] cursor-pointer hover:bg-[#C89D54] hover:text-black transition-colors font-bold shadow-lg">
                                        {uploadingKey === cat.key ? "..." : "Upload File"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => handleImageUpload(e, cat.key)}
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Page Imagery (About, Customise, Contact) */}
                <div className="bg-[#181410] border border-[#332A22] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#332A22]">
                        <ImageIcon className="w-5 h-5 text-[#C89D54]" />
                        <div>
                            <h2 className="font-serif font-bold text-[#EAE4D9] text-base">Page Banners (About, Customise, Contact)</h2>
                            <p className="text-[11px] text-[#EAE4D9]/50">Imagery for story, custom atelier, and kiosk page</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                        {[
                            { label: "About Page Story Banner", key: "aboutHeroImage" },
                            { label: "Craftsmanship Artisan Image", key: "aboutCraftImage" },
                            { label: "Custom Perfume Atelier Image", key: "customiseBannerImage" },
                            { label: "Contact Kiosk Store Banner", key: "contactBannerImage" },
                        ].map(page => (
                            <div key={page.key} className="space-y-1">
                                <label className="text-[#EAE4D9]/70 block truncate text-[11px]">{page.label}</label>
                                
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={localSettings[page.key] || ""}
                                    onChange={e => set(page.key, e.target.value)}
                                    className="w-full bg-black/50 border border-[#332A22] rounded-md px-2 py-1 text-[11px] text-[#EAE4D9] font-mono focus:outline-none focus:border-[#C89D54] mb-1"
                                />

                                <div className="relative h-24 rounded-lg overflow-hidden border border-[#332A22] bg-black">
                                    <img src={getImageUrl(localSettings[page.key])} alt="" className="w-full h-full object-cover" />
                                    <label className="absolute bottom-1 right-1 bg-[#181410]/95 text-[#C89D54] border border-[#C89D54]/40 px-2.5 py-1 rounded text-[10px] cursor-pointer hover:bg-[#C89D54] hover:text-black transition-colors font-bold shadow-lg">
                                        {uploadingKey === page.key ? "..." : "Upload File"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => handleImageUpload(e, page.key)}
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Announcement & Marquee */}
                <div className="bg-[#181410] border border-[#332A22] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#332A22]">
                        <Megaphone className="w-5 h-5 text-[#C89D54]" />
                        <div>
                            <h2 className="font-serif font-bold text-[#EAE4D9] text-base">Announcements & Marquee</h2>
                            <p className="text-[11px] text-[#EAE4D9]/50">Header message banner and marquee ticker</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="text-[#EAE4D9]/70 block mb-1 font-medium">Announcement Bar Text</label>
                            <input
                                type="text"
                                value={localSettings.announcementBar || ""}
                                onChange={e => set("announcementBar", e.target.value)}
                                className="w-full bg-black/50 border border-[#332A22] rounded-xl px-3 py-2 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54]"
                            />
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer pt-1">
                            <input
                                type="checkbox"
                                checked={localSettings.announcementEnabled || false}
                                onChange={e => set("announcementEnabled", e.target.checked)}
                                className="w-4 h-4 accent-[#C89D54] rounded"
                            />
                            <span className="text-[#EAE4D9]/80">Show Announcement Bar on Header</span>
                        </label>

                        <div className="pt-2 border-t border-[#332A22]">
                            <label className="text-[#EAE4D9]/70 block mb-1 font-medium">Marquee Scrolling Banner</label>
                            <textarea
                                rows={2}
                                value={localSettings.marqueeText || ""}
                                onChange={e => set("marqueeText", e.target.value)}
                                className="w-full bg-black/50 border border-[#332A22] rounded-xl px-3 py-2 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54]"
                            />
                        </div>
                    </div>
                </div>

                {/* 5. Brand Identity & Contact */}
                <div className="bg-[#181410] border border-[#332A22] rounded-2xl p-5 space-y-4 md:col-span-2">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#332A22]">
                        <Globe className="w-5 h-5 text-[#C89D54]" />
                        <div>
                            <h2 className="font-serif font-bold text-[#EAE4D9] text-base">Store Identity & Kiosk Location Details</h2>
                            <p className="text-[11px] text-[#EAE4D9]/50">Brand title, phone, address, and WhatsApp order number</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                            <label className="text-[#EAE4D9]/70 block mb-1 font-medium">Store Name</label>
                            <input
                                type="text"
                                value={localSettings.storeName || ""}
                                onChange={e => set("storeName", e.target.value)}
                                className="w-full bg-black/50 border border-[#332A22] rounded-xl px-3 py-2 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54]"
                            />
                        </div>
                        <div>
                            <label className="text-[#EAE4D9]/70 block mb-1 font-medium">Store Tagline</label>
                            <input
                                type="text"
                                value={localSettings.storeTagline || ""}
                                onChange={e => set("storeTagline", e.target.value)}
                                className="w-full bg-black/50 border border-[#332A22] rounded-xl px-3 py-2 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54]"
                            />
                        </div>
                        <div>
                            <label className="text-[#EAE4D9]/70 block mb-1 font-medium">Currency Symbol</label>
                            <input
                                type="text"
                                value={localSettings.currencySymbol || "Rs."}
                                onChange={e => set("currencySymbol", e.target.value)}
                                className="w-full bg-black/50 border border-[#332A22] rounded-xl px-3 py-2 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54] font-mono"
                            />
                        </div>

                        <div>
                            <label className="text-[#EAE4D9]/70 block mb-1 font-medium">Store Address / Kiosk</label>
                            <input
                                type="text"
                                value={localSettings.storeAddress || ""}
                                onChange={e => set("storeAddress", e.target.value)}
                                className="w-full bg-black/50 border border-[#332A22] rounded-xl px-3 py-2 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54]"
                            />
                        </div>
                        <div>
                            <label className="text-[#EAE4D9]/70 block mb-1 font-medium">Contact Phone</label>
                            <input
                                type="text"
                                value={localSettings.storePhone || ""}
                                onChange={e => set("storePhone", e.target.value)}
                                className="w-full bg-black/50 border border-[#332A22] rounded-xl px-3 py-2 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54]"
                            />
                        </div>
                        <div>
                            <label className="text-[#EAE4D9]/70 block mb-1 font-medium">WhatsApp Number (with country code)</label>
                            <input
                                type="text"
                                value={localSettings.whatsappNumber || ""}
                                onChange={e => set("whatsappNumber", e.target.value)}
                                placeholder="923001234567"
                                className="w-full bg-black/50 border border-[#332A22] rounded-xl px-3 py-2 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54] font-mono"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#332A22] flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-[#C89D54] hover:bg-[#b08743] disabled:opacity-50 text-black font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#C89D54]/20"
                        >
                            <Save className="w-4 h-4" /> {saving ? "Saving All Settings..." : "Save All Changes"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
