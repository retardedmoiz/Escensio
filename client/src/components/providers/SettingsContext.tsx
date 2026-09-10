"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API_URL from "@/lib/api";

interface Settings {
    storeName?: string;
    storeTagline?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: string;
    announcementBar?: string;
    announcementEnabled?: boolean;
    currency?: string;
    currencySymbol?: string;
    taxRatePercentage?: number;
    storeEmail?: string;
    storePhone?: string;
    storeAddress?: string;
    whatsappNumber?: string;
    category1Image?: string;
    category2Image?: string;
    category3Image?: string;
    category4Image?: string;
    aboutHeroImage?: string;
    aboutCraftImage?: string;
    customiseBannerImage?: string;
    contactBannerImage?: string;
    marqueeText?: string;
    marqueeFontSize?: string;
    marqueeTextColor?: string;
    marqueeBgColor?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    twitterUrl?: string;
}

interface SettingsContextType {
    settings: Settings;
    loading: boolean;
    updateSettings: (newSettings: Partial<Settings>) => Promise<boolean>;
    refreshSettings: () => Promise<void>;
}

const defaultSettings: Settings = {
    storeName: "ESCENSIO",
    storeTagline: "Artisanal Haute Parfumerie",
    heroTitle: "ESCENSIO",
    heroSubtitle: "Handcrafted with rare botanical extracts, aged woods, and quiet elegance.",
    heroImage: "/hero-new.jpg",
    announcementBar: "Complimentary 10ml Discovery Atomizer on Orders Over Rs. 15,000 | Kiosk Wah Cantt Open",
    announcementEnabled: true,
    currencySymbol: "Rs.",
    category1Image: "/products/perfume-2.jpg",
    category2Image: "/products/perfume-3.jpg",
    category3Image: "/products/perfume-4.jpg",
    category4Image: "/products/perfume-1.jpg",
    aboutHeroImage: "/hero-new.jpg",
    aboutCraftImage: "/products/perfume-3.jpg",
    customiseBannerImage: "/products/perfume-1.jpg",
    contactBannerImage: "/products/perfume-4.jpg",
    marqueeText: "HANDCRAFTED PERFUMERY • KIOSK WAH CANTT • ESCENSIO LUXURY • BOTANICAL EXTRACTS",
    storePhone: "+92 300 1234567",
    storeEmail: "hello@escensio.com",
    storeAddress: "POF Skating Park, Wah Cantt, Pakistan",
    whatsappNumber: "923001234567",
};

const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    loading: true,
    updateSettings: async () => false,
    refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const refreshSettings = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/settings`, { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error("Settings load error", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshSettings();
    }, [refreshSettings]);

    const updateSettings = async (newSettings: Partial<Settings>): Promise<boolean> => {
        try {
            const merged = { ...settings, ...newSettings };
            setSettings(merged); // Optimistic UI update for immediate response

            const res = await fetch(`${API_URL}/api/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(merged),
            });

            if (res.ok) {
                const savedData = await res.json();
                setSettings(savedData);
                return true;
            }
            return false;
        } catch (err) {
            console.error("Failed to save settings", err);
            return false;
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
