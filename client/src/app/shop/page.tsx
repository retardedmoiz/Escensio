"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/shared/ProductCard";
import TextReveal from "@/components/ui/TextReveal";
import API_URL, { getImageUrl } from "@/lib/api";

const CATEGORIES = ["All", "Men's", "Women's", "Unisex", "Best Sellers"];

// Fallback dummy products if backend is offline
const DUMMY_PRODUCTS = [
    { _id: "1", name: "SHELLFRESH", price: 3999, category: "Unisex", images: ["/products/perfume-1.jpg"], stock: 20, isFeatured: true },
    { _id: "2", name: "AURA", price: 4499, category: "Women's", images: ["/products/perfume-1.jpg"], stock: 15 },
    { _id: "3", name: "STRONGER", price: 3499, category: "Men's", images: ["/products/perfume-1.jpg"], stock: 10 },
    { _id: "4", name: "SHELL", price: 3799, category: "Women's", images: ["/products/perfume-1.jpg"], stock: 8 },
    { _id: "5", name: "PRIME", price: 4999, category: "Men's", images: ["/products/perfume-1.jpg"], stock: 12 },
    { _id: "6", name: "SIGNATURE", price: 5999, category: "Unisex", images: ["/products/perfume-1.jpg"], stock: 5, isFeatured: true },
    { _id: "7", name: "MUSKY", price: 3299, category: "Unisex", images: ["/products/perfume-1.jpg"], stock: 18 },
    { _id: "8", name: "VELVET NOIR", price: 4799, category: "Women's", images: ["/products/perfume-1.jpg"], stock: 7 },
    { _id: "9", name: "CEDAR MAN", price: 3599, category: "Men's", images: ["/products/perfume-1.jpg"], stock: 14 },
];

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.length > 0 ? data : DUMMY_PRODUCTS);
                } else {
                    setProducts(DUMMY_PRODUCTS);
                }
            } catch {
                setProducts(DUMMY_PRODUCTS);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filtered = activeCategory === "All"
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-14">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-16 text-center space-y-5">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block text-[11px] text-muted-foreground uppercase tracking-[0.35em]"
                    >
                        Our Collection
                    </motion.span>
                    <h1 className="text-5xl md:text-7xl font-serif font-light leading-[1.05] text-foreground">
                        <TextReveal>The Fragrances</TextReveal>
                    </h1>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-14">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 text-[11px] uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${activeCategory === cat
                                ? "bg-foreground text-background"
                                : "text-muted-foreground border border-border hover:border-foreground/30 hover:text-foreground"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-muted rounded-sm animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        key={activeCategory}
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.08 }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filtered.map(product => (
                            <motion.div
                                key={product._id}
                                variants={{
                                    hidden: { opacity: 0, y: 40 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] } }
                                }}
                            >
                                <ProductCard
                                    id={product._id}
                                    title={product.name}
                                    price={product.price}
                                    category={product.category}
                                    image={getImageUrl(product.images?.[0])}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {!isLoading && filtered.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p className="text-lg font-serif">No fragrances in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
