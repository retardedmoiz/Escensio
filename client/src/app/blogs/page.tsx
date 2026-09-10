"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TextReveal from "@/components/ui/TextReveal";
import Link from "next/link";

const API = "http://localhost:5000";
const BLOG_CATEGORIES = ["Guide", "Education", "News", "Brand Story", "Behind the Scenes"];

const FALLBACK_BLOGS = [
    { _id: "b1", title: "The Art of Layering Fragrances", date: "October 12, 2026", category: "Guide", excerpt: "Discover how to mix different perfumes to create a scent that is uniquely yours. Layering is a well-kept secret in the world of high perfumery.", image: "/hero-bg.jpg", createdAt: "2026-10-12" },
    { _id: "b2", title: "Understanding Eau de Parfum vs. Extrait", date: "September 28, 2026", category: "Education", excerpt: "Confused by concentration levels? We break down the differences in longevity, projection, and composition.", image: "/products/perfume-1.jpg", createdAt: "2026-09-28" },
    { _id: "b3", title: "Behind the Scenes: Crafting AURA", date: "September 15, 2026", category: "Behind the Scenes", excerpt: "A deep dive into the creation of our best-selling women's fragrance, AURA. From sourcing Madagascan vanilla to the final curing process.", image: "/hero-bg.jpg", createdAt: "2026-09-15" },
];

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch(`${API}/api/blogs`);
                if (res.ok) {
                    const data = await res.json();
                    setBlogs(data.filter((b: any) => b.isPublished !== false));
                } else {
                    setBlogs(FALLBACK_BLOGS);
                }
            } catch {
                setBlogs(FALLBACK_BLOGS);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const filtered = activeCategory === "All" ? blogs : blogs.filter(b => b.category === activeCategory);

    const getImageUrl = (img: string) => img?.startsWith("/uploads") ? `${API}${img}` : img;
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
                <span className="text-primary uppercase tracking-[0.3em] text-sm font-medium">Journal</span>
                <h1 className="text-5xl md:text-7xl font-bold font-serif leading-tight">
                    <TextReveal>News &amp; Blogs</TextReveal>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Dive into the world of luxury fragrances. Read our latest stories, guides, and brand updates.
                </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {["All", ...BLOG_CATEGORIES].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${activeCategory === cat
                            ? "bg-foreground text-background"
                            : "text-muted-foreground border border-border hover:border-foreground/30 hover:text-foreground"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="w-full aspect-[4/3] bg-muted rounded-lg animate-pulse" />
                            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                            <div className="h-6 bg-muted rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg font-serif">No posts in this category yet.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filtered.map((blog, idx) => (
                        <motion.div
                            key={blog._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.12, duration: 0.8 }}
                            className="group cursor-pointer space-y-4"
                        >
                            <div className="w-full aspect-[4/3] bg-muted relative overflow-hidden rounded-lg">
                                <img
                                    src={getImageUrl(blog.image) || "/hero-bg.jpg"}
                                    alt={blog.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-4 text-xs tracking-widest uppercase text-muted-foreground">
                                    <span>{blog.category}</span>
                                    <span>{formatDate(blog.createdAt)}</span>
                                </div>
                                <h2 className="text-2xl font-serif group-hover:text-primary transition-colors">{blog.title}</h2>
                                <p className="text-muted-foreground leading-relaxed">{blog.excerpt}</p>
                                <span className="inline-block mt-4 text-sm font-medium border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
                                    Read More
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
