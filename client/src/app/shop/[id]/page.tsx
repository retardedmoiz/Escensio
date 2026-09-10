"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, use } from "react";
import { ArrowLeft, Star, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartContext";
import API_URL, { getImageUrl } from "@/lib/api";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { addItem } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products/${id}`);
                if (res.ok) {
                    setProduct(await res.json());
                }
            } catch {
                // fallback – nothing to show
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        for (let i = 0; i < qty; i++) {
            addItem({
                id: product._id,
                title: product.name,
                price: product.price,
                image: getImageUrl(product.images?.[0]),
            });
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="bg-white min-h-screen">
            {loading ? (
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 border border-black/10 rounded-full animate-spin border-t-black mx-auto" />
                        <p className="text-sm text-black/40 uppercase tracking-widest">Loading</p>
                    </div>
                </div>
            ) : !product ? (
                <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
                    <h1 className="text-3xl font-serif">Product Not Found</h1>
                    <Link href="/shop" className="text-sm uppercase tracking-widest border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors">
                        Back to Shop
                    </Link>
                </div>
            ) : (
                <>
                    {(() => {
                        const images = product.images?.length > 0 ? product.images : ["/products/perfume-1.jpg"];
                        const stars = product.rating ? Math.round(product.rating) : 5;
                        return (
                            <>
                                {/* Back Nav */}
            <div className="pt-28 pb-0 px-6 md:px-14">
                <Link href="/shop" className="inline-flex items-center gap-2 text-black/40 hover:text-black transition-colors text-xs uppercase tracking-widest font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                </Link>
            </div>

            {/* Main Product Layout */}
            <div className="max-w-7xl mx-auto px-6 md:px-14 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                {/* Left: Images */}
                <div className="space-y-4">
                    <motion.div
                        className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-50"
                    >
                        <img
                            src={getImageUrl(images[selectedImage])}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {product.isFeatured && (
                            <div className="absolute top-5 left-5 bg-black text-white text-[10px] uppercase tracking-widest px-3 py-1">
                                Best Seller
                            </div>
                        )}
                    </motion.div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex gap-3">
                            {images.map((img: string, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === i ? "border-black" : "border-transparent opacity-60 hover:opacity-100"}`}
                                >
                                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="space-y-8 lg:pt-6">
                    {/* Category & Rating */}
                    <div className="space-y-2">
                        <span className="text-[11px] uppercase tracking-[0.3em] text-black/40">{product.category}</span>
                        <h1 className="text-4xl md:text-6xl font-serif leading-tight">{product.name}</h1>
                        <div className="flex items-center gap-2 pt-1">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < stars ? "fill-black text-black" : "text-black/20"}`} />
                                ))}
                            </div>
                            {product.numReviews > 0 && (
                                <span className="text-xs text-black/40">({product.numReviews} reviews)</span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-black/60 text-base leading-relaxed font-light">
                        {product.description || "A masterfully crafted fragrance, designed to leave an unforgettable impression."}
                    </p>

                    {/* Price & Stock */}
                    <div className="flex items-baseline gap-4 border-t border-b border-black/5 py-6">
                        <span className="text-4xl font-light">Rs. {product.price.toLocaleString()}</span>
                        <span className={`text-xs uppercase tracking-widest ${product.stock <= 5 ? "text-red-500" : product.stock <= 15 ? "text-amber-500" : "text-emerald-600"}`}>
                            {product.stock <= 0 ? "Out of Stock" : product.stock <= 5 ? `Only ${product.stock} left` : "In Stock"}
                        </span>
                    </div>

                    {/* Qty & Add to Cart */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-xs uppercase tracking-widest text-black/40">Quantity</span>
                            <div className="flex items-center border border-black/10 rounded-lg overflow-hidden">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors text-lg font-light">−</button>
                                <span className="w-12 text-center text-sm font-medium">{qty}</span>
                                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors text-lg font-light">+</button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className={`w-full py-4 text-sm uppercase tracking-widest font-medium transition-all duration-300 flex items-center justify-center gap-3 rounded-xl ${
                                added
                                    ? "bg-emerald-600 text-white"
                                    : product.stock <= 0
                                    ? "bg-black/10 text-black/30 cursor-not-allowed"
                                    : "bg-black text-white hover:bg-black/80"
                            }`}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            {added ? "Added to Cart ✓" : product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5">
                        {[
                            { label: "Category", value: product.category },
                            { label: "Stock", value: `${product.stock} units` },
                            { label: "Delivery", value: "2-5 business days" },
                            { label: "Origin", value: "Pakistan 🇵🇰" },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="text-[10px] uppercase tracking-widest text-black/30 mb-1">{item.label}</div>
                                <div className="text-sm font-medium text-black/80">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
                            </>
                        );
                    })()}
                </>
            )}
        </div>
    );
}
