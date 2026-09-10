"use client";

import { Droplet, Flame, Wind } from "lucide-react";

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
        <div className="bg-[#181410] border border-[#332A22] rounded-2xl p-6 md:p-8 space-y-8 text-[#EAE4D9]">
            {/* Header */}
            <div className="text-center space-y-2">
                <span className="text-[#C89D54] font-mono text-xs uppercase tracking-[0.25em] block font-semibold">
                    Olfactory Architecture
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#EAE4D9]">
                    The Fragrance Pyramid
                </h3>
                <p className="text-xs text-[#EAE4D9]/50 max-w-md mx-auto font-light">
                    How this bespoke formulation unfolds on your skin across time
                </p>
            </div>

            {/* Pyramid Grid */}
            <div className="space-y-4 max-w-xl mx-auto">
                {/* Top Notes */}
                <div className="bg-[#120F0D] border border-[#332A22] rounded-xl p-4 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-xs text-[#C89D54] font-mono uppercase tracking-wider font-semibold">
                        <Wind className="w-3.5 h-3.5" /> Top Notes (Head) · Opening 15 Mins
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center pt-1">
                        {topNotes.map((note, i) => (
                            <span key={i} className="bg-[#1A1612] text-[#EAE4D9]/90 border border-[#C89D54]/20 text-xs px-3 py-1 rounded-sm font-serif">
                                {note}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Heart Notes */}
                <div className="bg-[#120F0D] border border-[#332A22] rounded-xl p-5 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-xs text-[#C89D54] font-mono uppercase tracking-wider font-semibold">
                        <Flame className="w-3.5 h-3.5" /> Heart Notes (Heart) · 2 to 6 Hours
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center pt-1">
                        {heartNotes.map((note, i) => (
                            <span key={i} className="bg-[#1A1612] text-[#EAE4D9]/90 border border-[#C89D54]/20 text-xs px-3 py-1 rounded-sm font-serif">
                                {note}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Base Notes */}
                <div className="bg-[#120F0D] border border-[#332A22] rounded-xl p-6 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-xs text-[#C89D54] font-mono uppercase tracking-wider font-semibold">
                        <Droplet className="w-3.5 h-3.5" /> Base Notes (Soul) · All Day & Night
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center pt-1">
                        {baseNotes.map((note, i) => (
                            <span key={i} className="bg-[#1A1612] text-[#C89D54] border border-[#C89D54]/30 text-xs px-3.5 py-1 rounded-sm font-serif font-medium">
                                {note}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#332A22] max-w-xl mx-auto text-xs font-mono">
                <div className="bg-[#120F0D] border border-[#332A22] p-3.5 rounded-xl flex items-center justify-between">
                    <span className="text-[#EAE4D9]/50">Longevity</span>
                    <span className="text-[#C89D54] font-bold">{longevity}</span>
                </div>
                <div className="bg-[#120F0D] border border-[#332A22] p-3.5 rounded-xl flex items-center justify-between">
                    <span className="text-[#EAE4D9]/50">Sillage / Trail</span>
                    <span className="text-[#C89D54] font-bold">{projection}</span>
                </div>
            </div>
        </div>
    );
}
