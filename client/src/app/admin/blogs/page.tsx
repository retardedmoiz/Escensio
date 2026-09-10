"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pencil, X, Upload, Search, FileText, Eye, EyeOff } from "lucide-react";

const API = "http://localhost:5000";
const BLOG_CATEGORIES = ["Guide", "Education", "News", "Brand Story", "Behind the Scenes"];

interface Blog {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    image: string;
    author: string;
    isPublished: boolean;
    createdAt: string;
}

const defaultForm = { title: "", excerpt: "", content: "", category: "News", author: "Escensio Team", isPublished: true };

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [form, setForm] = useState<any>(defaultForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [existingImage, setExistingImage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [successMsg, setSuccessMsg] = useState("");

    const fetchBlogs = useCallback(async () => {
        try {
            const res = await fetch(`${API}/api/blogs`);
            if (res.ok) setBlogs(await res.json());
        } catch { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

    const openAddForm = () => {
        setEditingBlog(null);
        setForm(defaultForm);
        setImageFile(null); setImagePreview(""); setExistingImage("");
        setShowForm(true);
    };

    const openEditForm = (b: Blog) => {
        setEditingBlog(b);
        setForm({ title: b.title, excerpt: b.excerpt, content: b.content, category: b.category, author: b.author, isPublished: b.isPublished });
        setImageFile(null); setImagePreview("");
        setExistingImage(b.image || "");
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditingBlog(null); };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let imageUrl = existingImage;
            if (imageFile) {
                const fd = new FormData();
                fd.append("images", imageFile);
                const uploadRes = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
                if (uploadRes.ok) {
                    const { paths } = await uploadRes.json();
                    imageUrl = paths[0] || imageUrl;
                }
            }
            if (!imageUrl) imageUrl = "/hero-bg.jpg";

            const payload = { ...form, image: imageUrl };
            const url = editingBlog ? `${API}/api/blogs/${editingBlog._id}` : `${API}/api/blogs`;
            const method = editingBlog ? "PUT" : "POST";
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

            if (res.ok) {
                setSuccessMsg(editingBlog ? "Blog updated!" : "Blog published!");
                setTimeout(() => setSuccessMsg(""), 3000);
                closeForm(); fetchBlogs();
            }
        } catch (err) { console.error(err); }
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this blog post?")) return;
        try {
            const res = await fetch(`${API}/api/blogs/${id}`, { method: "DELETE" });
            if (res.ok) { fetchBlogs(); setSuccessMsg("Blog deleted."); setTimeout(() => setSuccessMsg(""), 3000); }
        } catch { }
    };

    const togglePublish = async (blog: Blog) => {
        try {
            const res = await fetch(`${API}/api/blogs/${blog._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...blog, isPublished: !blog.isPublished })
            });
            if (res.ok) fetchBlogs();
        } catch { }
    };

    const filtered = blogs.filter(b => {
        const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCategory === "All" || b.category === filterCategory;
        return matchSearch && matchCat;
    });

    const getImageUrl = (img: string) => img?.startsWith("/uploads") ? `${API}${img}` : img;
    const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">News & Blogs</h1>
                    <p className="admin-page-subtitle">{blogs.length} posts · {blogs.filter(b => b.isPublished).length} published</p>
                </div>
                <button className="admin-btn-primary" onClick={openAddForm}>
                    <Plus size={16} /> New Post
                </button>
            </div>

            {successMsg && <div className="admin-success">{successMsg}</div>}

            <div className="admin-filters">
                <div className="admin-search-wrap">
                    <Search size={15} />
                    <input type="text" placeholder="Search blog posts..." className="admin-search" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="admin-filter-tabs">
                    {["All", ...BLOG_CATEGORIES].map(cat => (
                        <button key={cat} className={`admin-filter-tab ${filterCategory === cat ? "active" : ""}`} onClick={() => setFilterCategory(cat)}>{cat}</button>
                    ))}
                </div>
            </div>

            {/* Blog Grid */}
            {loading ? (
                <div className="admin-blog-grid">
                    {[...Array(3)].map((_, i) => <div key={i} className="admin-skeleton admin-blog-skeleton" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="admin-empty"><FileText size={40} /><p>No blog posts yet</p></div>
            ) : (
                <div className="admin-blog-grid">
                    {filtered.map(blog => (
                        <div key={blog._id} className={`admin-blog-card ${!blog.isPublished ? "admin-blog-draft" : ""}`}>
                            <div className="admin-blog-img">
                                <img src={getImageUrl(blog.image) || "/hero-bg.jpg"} alt={blog.title} />
                                <span className="admin-blog-category">{blog.category}</span>
                                <span className={`admin-blog-status ${blog.isPublished ? "published" : "draft"}`}>
                                    {blog.isPublished ? "Published" : "Draft"}
                                </span>
                            </div>
                            <div className="admin-blog-body">
                                <div className="admin-blog-meta">{formatDate(blog.createdAt)} · By {blog.author}</div>
                                <h3 className="admin-blog-title">{blog.title}</h3>
                                <p className="admin-blog-excerpt">{blog.excerpt}</p>
                            </div>
                            <div className="admin-blog-actions">
                                <button className="admin-btn-icon admin-btn-edit" onClick={() => openEditForm(blog)} title="Edit"><Pencil size={14} /></button>
                                <button className="admin-btn-icon" onClick={() => togglePublish(blog)} title={blog.isPublished ? "Unpublish" : "Publish"}>
                                    {blog.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                                <button className="admin-btn-icon admin-btn-delete" onClick={() => handleDelete(blog._id)} title="Delete"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && closeForm()}>
                    <div className="admin-modal admin-modal-wide">
                        <div className="admin-modal-header">
                            <h2>{editingBlog ? "Edit Blog Post" : "New Blog Post"}</h2>
                            <button onClick={closeForm}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-field">
                                <label>Title *</label>
                                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Blog post title..." />
                            </div>
                            <div className="admin-form-row">
                                <div className="admin-field">
                                    <label>Category *</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="admin-field">
                                    <label>Author</label>
                                    <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Escensio Team" />
                                </div>
                            </div>
                            <div className="admin-field">
                                <label>Excerpt (shown on blog listing) *</label>
                                <textarea required rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description of the blog post..." />
                            </div>
                            <div className="admin-field">
                                <label>Full Content</label>
                                <textarea rows={6} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write the full blog post content here..." />
                            </div>
                            <div className="admin-field">
                                <label>Cover Image</label>
                                <label className="admin-upload-zone">
                                    <Upload size={24} />
                                    <span>Click to upload cover image</span>
                                    <span className="admin-upload-hint">PNG, JPG, WEBP up to 10MB</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                </label>
                                {(imagePreview || existingImage) && (
                                    <div className="admin-blog-img-preview">
                                        <img src={imagePreview || getImageUrl(existingImage)} alt="" />
                                        {imagePreview && <span className="admin-img-new-label">New image selected</span>}
                                    </div>
                                )}
                            </div>
                            <label className="admin-checkbox-row">
                                <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
                                <span>Publish immediately</span>
                            </label>
                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn-secondary" onClick={closeForm}>Cancel</button>
                                <button type="submit" className="admin-btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : editingBlog ? "Update Post" : "Publish Post"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
