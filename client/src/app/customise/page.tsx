"use client";

import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { useState } from "react";

const NOTES = {
    top: ["Citrus", "Bergamot", "Lemon", "Apple", "Pink Pepper"],
    heart: ["Jasmine", "Rose", "Lavender", "Cinnamon", "Cardamom"],
    base: ["Vanilla", "Sandalwood", "Amber", "Musk", "Oud", "Cedarwood"]
};

export default function CustomisePage() {
    const [selected, setSelected] = useState({ top: "", heart: "", base: "" });

    const handleSelect = (layer: "top" | "heart" | "base", note: string) => {
        setSelected(prev => ({ ...prev, [layer]: note }));
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
                <span className="text-primary uppercase tracking-[0.3em] text-sm font-medium">Create Your Signature</span>
                <h1 className="text-5xl md:text-7xl font-bold font-serif leading-tight">
                    <TextReveal>Customise Fragrance</TextReveal>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Design your own bespoke perfume by selecting your preferred top, heart, and base notes. Our master perfumers will craft it exclusively for you.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                {/* Top Notes */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif border-b border-border/40 pb-4">1. Top Notes</h2>
                    <p className="text-sm text-muted-foreground">The first impression. Fresh and uplifting.</p>
                    <div className="flex flex-wrap gap-3">
                        {NOTES.top.map(note => (
                            <button
                                key={note}
                                onClick={() => handleSelect("top", note)}
                                className={`px-4 py-2 border rounded-full text-sm transition-colors ${selected.top === note ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50 text-foreground"}`}
                            >
                                {note}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Heart Notes */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif border-b border-border/40 pb-4">2. Heart Notes</h2>
                    <p className="text-sm text-muted-foreground">The core identity. Floral, spicy, or fruity.</p>
                    <div className="flex flex-wrap gap-3">
                        {NOTES.heart.map(note => (
                            <button
                                key={note}
                                onClick={() => handleSelect("heart", note)}
                                className={`px-4 py-2 border rounded-full text-sm transition-colors ${selected.heart === note ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50 text-foreground"}`}
                            >
                                {note}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Base Notes */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif border-b border-border/40 pb-4">3. Base Notes</h2>
                    <p className="text-sm text-muted-foreground">The lingering trail. Deep and rich.</p>
                    <div className="flex flex-wrap gap-3">
                        {NOTES.base.map(note => (
                            <button
                                key={note}
                                onClick={() => handleSelect("base", note)}
                                className={`px-4 py-2 border rounded-full text-sm transition-colors ${selected.base === note ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50 text-foreground"}`}
                            >
                                {note}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-20 p-8 border border-border/40 rounded-xl bg-card text-center max-w-2xl mx-auto space-y-6">
                <h3 className="text-2xl font-serif">Your Unique Blend</h3>
                <div className="text-lg text-muted-foreground">
                    {selected.top || selected.heart || selected.base ? (
                        <p>
                            Top: <span className="text-foreground font-medium">{selected.top || "..."}</span> <br/>
                            Heart: <span className="text-foreground font-medium">{selected.heart || "..."}</span> <br/>
                            Base: <span className="text-foreground font-medium">{selected.base || "..."}</span>
                        </p>
                    ) : (
                        <p>Select your notes above to see your blend.</p>
                    )}
                </div>
                <MagneticButton className="mx-auto bg-primary text-primary-foreground mt-4" strength={20}>
                    Order Custom Blend - $199
                </MagneticButton>
            </div>
        </div>
    );
}
