"use client";

import { Droplet, Flame, Sparkles, Wind, ShieldCheck } from "lucide-react";

interface OlfactoryProps {
    topNotes?: string[];
    heartNotes?: string[];
    baseNotes?: string[];
    longevity?: string;
    projection?: string;
}

export default function OlfactoryNotesVisualizer({
    topNotes = ["Calabrian Bergamot", "Pink Pepper", "Black Cherry"],
    heartNotes = ["Bulgarian Rose", "Orris Root", "Incense"],
    baseNotes = ["Madagascan Vanilla", "Oud", "Leather", "Ambergris"],
    longevity = "14+ Hours",
    projection = "Heavy Sillage"
}: OlfactoryProps) {
    return (
        <div className="bg-zinc-950 border border-amber-400/20 rounded-3xl p-6 md:p-8 space-y-8 text-white">
            {/* Title Header */}
            <div className="text-center space-y-2">
                <span className="text-amber-400 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Olfactory Architecture
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">
                    The Fragrance Pyramid
                </h3>
                <p className="text-xs text-white/50 max-w-md mx-auto font-light">
                    How this bespoke extract evolves on your skin across time
                </p>
            </div>

            {/* Pyramid Grid */}
            <div className="space-y-6 max-w-xl mx-auto">
                {/* Top Notes (Head) */}
                <div className="bg-gradient-to-r from-amber-400/10 via-zinc-900 to-amber-400/10 border border-amber-400/30 rounded-2xl p-4 text-center space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-mono uppercase tracking-wider font-semibold">
                        <Wind className="w-3.5 h-3.5" /> Top Notes (Head) · First 15 Mins
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center pt-1">
                        {topNotes.map((note, i) => (
                            <span key={i} className="bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs px-3 py-1 rounded-full font-serif">
                                {note}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Heart Notes (Heart) */}
                <div className="bg-gradient-to-r from-amber-500/10 via-zinc-900 to-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-center space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-mono uppercase tracking-wider font-semibold">
                        <Flame className="w-3.5 h-3.5" /> Heart Notes (Heart) · 2 to 6 Hours
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center pt-1">
                        {heartNotes.map((note, i) => (
                            <span key={i} className="bg-amber-500/10 text-amber-200 border border-amber-500/20 text-xs px-3 py-1 rounded-full font-serif">
                                {note}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Base Notes (Soul) */}
                <div className="bg-gradient-to-r from-amber-600/10 via-zinc-900 to-amber-600/10 border border-amber-600/30 rounded-2xl p-6 text-center space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-mono uppercase tracking-wider font-semibold">
                        <Droplet className="w-3.5 h-3.5" /> Base Notes (Soul) · All Day & Night
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center pt-1">
                        {baseNotes.map((note, i) => (
                            <span key={i} className="bg-amber-600/10 text-amber-100 border border-amber-600/20 text-xs px-3.5 py-1.5 rounded-full font-serif font-medium">
                                {note}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 max-w-xl mx-auto text-xs">
                <div className="bg-zinc-900 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                    <span className="text-white/60">Longevity</span>
                    <span className="text-amber-400 font-mono font-bold">{longevity}</span>
                </div>
                <div className="bg-zinc-900 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between">
                    <span className="text-white/60">Sillage / Trail</span>
                    <span className="text-amber-400 font-mono font-bold">{projection}</span>
                </div>
            </div>
        </div>
    );
}
