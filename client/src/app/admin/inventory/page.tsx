"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, AlertTriangle, AlertCircle, TrendingUp, Search, Plus, Minus, Edit3, Save, Check, RefreshCw, BarChart2 } from "lucide-react";
import API_URL, { getImageUrl } from "@/lib/api";

interface ProductInventory {
    _id: string;
    id: string;
    name: string;
    category: string;
    stock: number;
    price: number;
    sku?: string;
    barcode?: string;
    images?: string[];
}

export default function AdminInventory() {
    const [products, setProducts] = useState<ProductInventory[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Low Stock" | "Out of Stock" | "In Stock">("All");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editStock, setEditStock] = useState<number>(0);
    const [editSku, setEditSku] = useState<string>("");
    const [editPrice, setEditPrice] = useState<number>(0);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const fetchInventory = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/inventory`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
            }
        } catch (err) {
            console.error("Failed to fetch inventory", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchInventory(); }, [fetchInventory]);

    const handleQuickStockChange = async (id: string, currentStock: number, delta: number) => {
        const newStock = Math.max(0, currentStock + delta);
        try {
            const res = await fetch(`${API_URL}/api/inventory`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, stock: newStock })
            });

            if (res.ok) {
                setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? { ...p, stock: newStock } : p));
            }
        } catch (err) {
            console.error("Failed to update stock", err);
        }
    };

    const startEditing = (p: ProductInventory) => {
        setEditingId(p._id || p.id);
        setEditStock(p.stock);
        setEditSku(p.sku || `ESC-${p.name.slice(0, 3).toUpperCase()}`);
        setEditPrice(p.price);
    };

    const saveEditing = async (id: string) => {
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/inventory`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, stock: editStock, sku: editSku, price: editPrice })
            });

            if (res.ok) {
                setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? { ...p, stock: editStock, sku: editSku, price: editPrice } : p));
                setEditingId(null);
                setSuccessMsg("Inventory item updated!");
                setTimeout(() => setSuccessMsg(""), 3000);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // Derived Statistics
    const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const totalValuation = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);
    const lowStockItems = products.filter(p => p.stock <= 10 && p.stock > 0);
    const outOfStockItems = products.filter(p => p.stock === 0);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku?.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase());
        
        if (statusFilter === "Low Stock") return matchesSearch && p.stock <= 10 && p.stock > 0;
        if (statusFilter === "Out of Stock") return matchesSearch && p.stock === 0;
        if (statusFilter === "In Stock") return matchesSearch && p.stock > 10;
        return matchesSearch;
    });

    return (
        <div className="admin-page space-y-6">
            {/* Header */}
            <div className="admin-page-header flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                    <h1 className="admin-page-title text-2xl font-serif font-bold text-amber-400 flex items-center gap-2">
                        <Package className="w-6 h-6" /> Professional Inventory Manager
                    </h1>
                    <p className="admin-page-subtitle text-xs text-white/60">
                        Real-time Stock Tracking, SKU Barcodes & POS Inventory Valuation
                    </p>
                </div>
                <button
                    onClick={fetchInventory}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/30 text-xs text-white flex items-center gap-2 transition-all"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Inventory
                </button>
            </div>

            {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4" /> {successMsg}
                </div>
            )}

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xs text-white/50 block">Total Units Stocked</span>
                        <span className="text-xl font-bold font-mono text-white">{totalUnits} units</span>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center font-bold">
                        <BarChart2 className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xs text-white/50 block">Inventory Valuation</span>
                        <span className="text-xl font-bold font-mono text-amber-400">
                            Rs. {totalValuation.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-400/10 border border-orange-400/20 text-orange-400 flex items-center justify-center font-bold">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xs text-white/50 block">Low Stock Alert (&lt; 10)</span>
                        <span className="text-xl font-bold font-mono text-orange-400">{lowStockItems.length} items</span>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xs text-white/50 block">Out of Stock</span>
                        <span className="text-xl font-bold font-mono text-red-400">{outOfStockItems.length} items</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search by SKU, Barcode, Name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                    {(["All", "In Stock", "Low Stock", "Out of Stock"] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                                statusFilter === status
                                    ? "bg-amber-400 text-black font-semibold shadow-lg shadow-amber-400/20"
                                    : "bg-zinc-900 border border-white/10 text-white/70 hover:border-white/30"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Inventory Data Table */}
            <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="p-8 text-center text-white/40 text-xs">Loading inventory database...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-12 text-center text-white/30 text-xs space-y-2">
                        <Package className="w-8 h-8 mx-auto opacity-40" />
                        <p>No inventory records found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-white">
                            <thead className="bg-black/60 text-white/50 border-b border-white/10 font-mono text-[11px] uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Fragrance</th>
                                    <th className="p-4">SKU / Code</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Retail Price</th>
                                    <th className="p-4">Stock Level</th>
                                    <th className="p-4 text-center">Quick Adjust</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredProducts.map(p => {
                                    const id = p._id || p.id;
                                    const isEditing = editingId === id;

                                    return (
                                        <tr key={id} className="hover:bg-white/[0.02] transition-colors">
                                            {/* Product Cell */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={getImageUrl(p.images?.[0])}
                                                        alt={p.name}
                                                        className="w-10 h-10 rounded-lg object-cover border border-white/10"
                                                    />
                                                    <div>
                                                        <span className="font-semibold font-serif text-sm block">{p.name}</span>
                                                        <span className="text-[10px] text-white/40">Valuation: Rs. {(p.price * p.stock).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* SKU Cell */}
                                            <td className="p-4 font-mono text-amber-400">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editSku}
                                                        onChange={e => setEditSku(e.target.value)}
                                                        className="bg-black border border-amber-400/50 rounded px-2 py-1 text-white text-xs w-28"
                                                    />
                                                ) : (
                                                    p.sku || `ESC-${p.name.slice(0, 3).toUpperCase()}`
                                                )}
                                            </td>

                                            {/* Category */}
                                            <td className="p-4 text-white/70">
                                                <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-[10px]">
                                                    {p.category}
                                                </span>
                                            </td>

                                            {/* Retail Price */}
                                            <td className="p-4 font-bold text-white font-mono">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editPrice}
                                                        onChange={e => setEditPrice(parseFloat(e.target.value) || 0)}
                                                        className="bg-black border border-amber-400/50 rounded px-2 py-1 text-white text-xs w-24"
                                                    />
                                                ) : (
                                                    `Rs. ${p.price.toLocaleString()}`
                                                )}
                                            </td>

                                            {/* Stock Level */}
                                            <td className="p-4">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editStock}
                                                        onChange={e => setEditStock(parseInt(e.target.value) || 0)}
                                                        className="bg-black border border-amber-400/50 rounded px-2 py-1 text-white text-xs w-20"
                                                    />
                                                ) : (
                                                    <div className="space-y-1">
                                                        <span className={`inline-block font-mono font-bold px-2.5 py-0.5 rounded text-[11px] ${
                                                            p.stock === 0
                                                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                                                : p.stock <= 10
                                                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                        }`}>
                                                            {p.stock} units
                                                        </span>
                                                        {/* Progress indicator */}
                                                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${
                                                                    p.stock === 0 ? "bg-red-500" : p.stock <= 10 ? "bg-amber-400" : "bg-emerald-400"
                                                                }`}
                                                                style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Quick Stock Controls */}
                                            <td className="p-4 text-center">
                                                <div className="inline-flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg p-1">
                                                    <button
                                                        onClick={() => handleQuickStockChange(id, p.stock, -5)}
                                                        className="px-1.5 py-0.5 hover:bg-white/10 text-white/70 hover:text-white rounded text-[10px]"
                                                        title="Reduce 5 units"
                                                    >
                                                        -5
                                                    </button>
                                                    <button
                                                        onClick={() => handleQuickStockChange(id, p.stock, -1)}
                                                        className="px-1.5 py-0.5 hover:bg-white/10 text-white/70 hover:text-white rounded text-[10px]"
                                                        title="Reduce 1 unit"
                                                    >
                                                        -1
                                                    </button>
                                                    <button
                                                        onClick={() => handleQuickStockChange(id, p.stock, 1)}
                                                        className="px-1.5 py-0.5 hover:bg-white/10 text-white/70 hover:text-white rounded text-[10px]"
                                                        title="Add 1 unit"
                                                    >
                                                        +1
                                                    </button>
                                                    <button
                                                        onClick={() => handleQuickStockChange(id, p.stock, 5)}
                                                        className="px-1.5 py-0.5 hover:bg-white/10 text-white/70 hover:text-white rounded text-[10px]"
                                                        title="Add 5 units"
                                                    >
                                                        +5
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 text-right">
                                                {isEditing ? (
                                                    <button
                                                        disabled={saving}
                                                        onClick={() => saveEditing(id)}
                                                        className="bg-amber-400 hover:bg-amber-300 text-black px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto"
                                                    >
                                                        <Save className="w-3.5 h-3.5" /> Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => startEditing(p)}
                                                        className="text-white/60 hover:text-amber-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                                                        title="Edit SKU & Stock"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
