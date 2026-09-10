"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, X, Upload, Search, Star, Package } from "lucide-react";
import API_URL, { getImageUrl } from "@/lib/api";

const CATEGORIES = ["Extrait de Parfum", "Eau de Parfum", "Discovery Sets", "Men's", "Women's", "Unisex"];

interface Product {
    _id: string;
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    stock: number;
    images: string[];
    isFeatured: boolean;
    rating?: number;
    numReviews?: number;
}

const defaultForm = { name: "", price: "", category: "Unisex", description: "", stock: "", isFeatured: false };

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form, setForm] = useState<any>(defaultForm);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [successMsg, setSuccessMsg] = useState("");

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/products`);
            if (res.ok) setProducts(await res.json());
        } catch { console.error("Could not fetch products"); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
        const urls = files.map(f => URL.createObjectURL(f));
        setImagePreviewUrls(prev => [...prev, ...urls]);
    };

    const removeNewImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== idx));
    };

    const removeExistingImage = (idx: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
    };

    const openAddForm = () => {
        setEditingProduct(null);
        setForm(defaultForm);
        setImages([]); setImagePreviewUrls([]); setExistingImages([]);
        setShowForm(true);
    };

    const openEditForm = (p: Product) => {
        setEditingProduct(p);
        setForm({ name: p.name, price: p.price, category: p.category, description: p.description, stock: p.stock, isFeatured: p.isFeatured });
        setImages([]); setImagePreviewUrls([]);
        setExistingImages(p.images || []);
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditingProduct(null); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let uploadedPaths: string[] = [...existingImages];
            if (images.length > 0) {
                const fd = new FormData();
                images.forEach(img => fd.append("images", img));
                const uploadRes = await fetch(`${API_URL}/api/upload`, { method: "POST", body: fd });
                if (uploadRes.ok) {
                    const { paths } = await uploadRes.json();
                    uploadedPaths = [...uploadedPaths, ...paths];
                }
            }
            if (uploadedPaths.length === 0) uploadedPaths = ["/products/perfume-1.jpg"];

            const payload = {
                name: form.name, price: Number(form.price),
                category: form.category, description: form.description,
                stock: Number(form.stock), images: uploadedPaths,
                isFeatured: form.isFeatured
            };

            const targetId = editingProduct ? (editingProduct._id || editingProduct.id) : "";
            const url = editingProduct ? `${API_URL}/api/products/${targetId}` : `${API_URL}/api/products`;
            const method = editingProduct ? "PUT" : "POST";
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

            if (res.ok) {
                setSuccessMsg(editingProduct ? "Fragrance updated!" : "Fragrance added!");
                setTimeout(() => setSuccessMsg(""), 3000);
                closeForm();
                fetchProducts();
            }
        } catch (err) { console.error(err); }
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async (p: Product) => {
        if (!confirm("Delete this fragrance? This cannot be undone.")) return;
        const targetId = p._id || p.id;
        try {
            const res = await fetch(`${API_URL}/api/products/${targetId}`, { method: "DELETE" });
            if (res.ok) { fetchProducts(); setSuccessMsg("Fragrance deleted."); setTimeout(() => setSuccessMsg(""), 3000); }
        } catch { }
    };

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat = filterCategory === "All" || p.category === filterCategory;
        return matchSearch && matchCat;
    });

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Products Catalog</h1>
                    <p className="admin-page-subtitle">{products.length} total fragrances in your catalog</p>
                </div>
                <button className="admin-btn-primary" onClick={openAddForm}>
                    <Plus size={16} /> Add Fragrance
                </button>
            </div>

            {successMsg && <div className="admin-success">{successMsg}</div>}

            {/* Filters */}
            <div className="admin-filters">
                <div className="admin-search-wrap">
                    <Search size={15} />
                    <input
                        type="text" placeholder="Search fragrances..."
                        className="admin-search" value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="admin-filter-tabs">
                    {["All", ...CATEGORIES].map(cat => (
                        <button key={cat} className={`admin-filter-tab ${filterCategory === cat ? "active" : ""}`}
                            onClick={() => setFilterCategory(cat)}>{cat}</button>
                    ))}
                </div>
            </div>

            {/* Products Table */}
            <div className="admin-card admin-table-card">
                {loading ? (
                    <div className="admin-skeleton-list">{[...Array(5)].map((_, i) => <div key={i} className="admin-skeleton admin-skeleton-row" />)}</div>
                ) : filtered.length === 0 ? (
                    <div className="admin-empty"><Package size={40} /><p>No products found</p></div>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Price</th>
                                    <th>Rating</th>
                                    <th>Featured</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => (
                                    <tr key={p._id || p.id}>
                                        <td>
                                            <div className="admin-product-cell">
                                                <img className="admin-product-img" src={getImageUrl(p.images?.[0])} alt={p.name} />
                                                <div>
                                                    <div className="admin-product-name">{p.name}</div>
                                                    <div className="admin-product-desc">{p.description?.slice(0, 50)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="admin-category-badge">{p.category}</span></td>
                                        <td>
                                            <span className={`admin-stock-badge ${p.stock <= 5 ? "admin-stock-low" : p.stock <= 10 ? "admin-stock-med" : "admin-stock-ok"}`}>
                                                {p.stock} units
                                            </span>
                                        </td>
                                        <td className="admin-price">Rs. {p.price.toLocaleString()}</td>
                                        <td>
                                            {p.rating ? (
                                                <span className="admin-rating"><Star size={12} /> {p.rating} ({p.numReviews})</span>
                                            ) : <span className="admin-muted">—</span>}
                                        </td>
                                        <td>
                                            <span className={`admin-featured-badge ${p.isFeatured ? "yes" : "no"}`}>
                                                {p.isFeatured ? "Yes" : "No"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="admin-btn-icon admin-btn-edit" onClick={() => openEditForm(p)} title="Edit"><Pencil size={14} /></button>
                                                <button className="admin-btn-icon admin-btn-delete" onClick={() => handleDelete(p)} title="Delete"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="admin-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeForm()}>
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h2>{editingProduct ? "Edit Product" : "Add New Fragrance"}</h2>
                            <button onClick={closeForm}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-row">
                                <div className="admin-field">
                                    <label>Product Name *</label>
                                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. VELVET NOIR" />
                                </div>
                                <div className="admin-field">
                                    <label>Category *</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="admin-form-row">
                                <div className="admin-field">
                                    <label>Price (PKR Rs.) *</label>
                                    <input required type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="16500" />
                                </div>
                                <div className="admin-field">
                                    <label>Stock Quantity *</label>
                                    <input required type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="25" />
                                </div>
                            </div>
                            <div className="admin-field">
                                <label>Description</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe this fragrance..." />
                            </div>

                            {/* Images */}
                            <div className="admin-field">
                                <label>Product Images</label>
                                <label className="admin-upload-zone">
                                    <Upload size={24} />
                                    <span>Click to upload images</span>
                                    <span className="admin-upload-hint">PNG, JPG, WEBP up to 10MB each</span>
                                    <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                                </label>
                                {(existingImages.length > 0 || imagePreviewUrls.length > 0) && (
                                    <div className="admin-image-previews">
                                        {existingImages.map((img, i) => (
                                            <div key={`e-${i}`} className="admin-img-thumb">
                                                <img src={getImageUrl(img)} alt="" />
                                                <button type="button" onClick={() => removeExistingImage(i)}><X size={12} /></button>
                                            </div>
                                        ))}
                                        {imagePreviewUrls.map((url, i) => (
                                            <div key={`n-${i}`} className="admin-img-thumb admin-img-new">
                                                <img src={url} alt="" />
                                                <button type="button" onClick={() => removeNewImage(i)}><X size={12} /></button>
                                                <span className="admin-img-new-label">New</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <label className="admin-checkbox-row">
                                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                                <span>Feature on homepage</span>
                            </label>

                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn-secondary" onClick={closeForm}>Cancel</button>
                                <button type="submit" className="admin-btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
