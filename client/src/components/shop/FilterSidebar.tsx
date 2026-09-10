"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const filters = [
    {
        id: "category",
        name: "Category",
        options: ["Men's", "Women's", "Unisex", "Best Sellers"],
    },
    {
        id: "scent",
        name: "Scent Family",
        options: ["Fresh", "Floral", "Woody", "Musk", "Oriental"],
    },
    {
        id: "price",
        name: "Price Range",
        options: ["Under $100", "$100 - $150", "$150 - $200", "$200+"],
    },
];

export default function FilterSidebar() {
    const [openSections, setOpenSections] = useState<string[]>(["category", "scent"]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const toggleSection = (id: string) => {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleFilter = (option: string) => {
        setSelectedFilters(prev =>
            prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
        );
    };

    return (
        <aside className="w-full lg:w-64 space-y-8">
            <div className="flex items-center gap-2 pb-4 border-b border-border/40">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm uppercase tracking-widest font-medium">Filters</span>
            </div>

            <div className="space-y-6">
                {filters.map((section) => (
                    <div key={section.id} className="border-b border-border/20 pb-6 last:border-0">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="flex items-center justify-between w-full group"
                        >
                            <h3 className="font-serif text-lg text-foreground/80 group-hover:text-primary transition-colors">
                                {section.name}
                            </h3>
                            {openSections.includes(section.id) ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                        </button>

                        <AnimatePresence>
                            {openSections.includes(section.id) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <ul className="pt-4 space-y-3">
                                        {section.options.map((option) => (
                                            <li key={option}>
                                                <button
                                                    onClick={() => toggleFilter(option)}
                                                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                                                >
                                                    <div className={cn(
                                                        "w-4 h-4 border border-border rounded-sm flex items-center justify-center transition-colors",
                                                        selectedFilters.includes(option) ? "bg-primary border-primary" : "group-hover:border-primary/50"
                                                    )}>
                                                        {selectedFilters.includes(option) && (
                                                            <Check className="w-3 h-3 text-primary-foreground" />
                                                        )}
                                                    </div>
                                                    {option}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </aside>
    );
}
