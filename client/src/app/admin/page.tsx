"use client";

import { useState, useEffect } from "react";
import { Package, ShoppingCart, FileText, TrendingUp, AlertTriangle, DollarSign, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import API_URL, { getImageUrl } from "@/lib/api";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [statsRes, ordersRes, productsRes] = await Promise.all([
                    fetch(`${API_URL}/api/admin/stats`),
                    fetch(`${API_URL}/api/orders`),
                    fetch(`${API_URL}/api/products`),
                ]);
                const [statsData, ordersData, productsData] = await Promise.all([
                    statsRes.json(), ordersRes.json(), productsRes.json()
                ]);
                setStats(statsData);
                setRecentOrders(Array.isArray(ordersData) ? ordersData.slice(0, 5) : []);
                setLowStockProducts(Array.isArray(productsData) ? productsData.filter((p: any) => p.stock <= 10) : []);
            } catch (err) {
                console.error("Dashboard load error", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const statCards = [
        { label: "Total Revenue", value: stats ? `Rs. ${stats.totalRevenue.toLocaleString()}` : "—", icon: DollarSign, color: "#a0856c", sub: "All time" },
        { label: "Total Orders", value: stats?.totalOrders ?? "—", icon: ShoppingCart, color: "#7c9a92", sub: `${stats?.processingOrders ?? 0} processing` },
        { label: "Products", value: stats?.totalProducts ?? "—", icon: Package, color: "#9b8ea8", sub: `${stats?.lowStockCount ?? 0} low stock` },
        { label: "Blog Posts", value: stats?.totalBlogs ?? "—", icon: FileText, color: "#c4a882", sub: "Published" },
    ];

    const statusColor: Record<string, string> = {
        Processing: "#f59e0b", Confirmed: "#3b82f6", Packed: "#8b5cf6",
        Shipped: "#06b6d4", Delivered: "#10b981", Cancelled: "#ef4444",
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Dashboard</h1>
                    <p className="admin-page-subtitle">Welcome back. Here's your store overview.</p>
                </div>
                <div className="admin-header-date">
                    {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </div>
            </div>

            <div className="admin-stats-grid">
                {statCards.map((card) => (
                    <div key={card.label} className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: card.color + '22', color: card.color }}>
                            <card.icon size={20} />
                        </div>
                        <div>
                            <div className="admin-stat-label">{card.label}</div>
                            <div className="admin-stat-value">
                                {loading ? <span className="admin-skeleton admin-skeleton-sm" /> : card.value}
                            </div>
                            <div className="admin-stat-sub">{card.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-two-col">
                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title"><ShoppingCart size={16} /> Recent Orders</h2>
                        <Link href="/admin/orders" className="admin-card-link">View all <ArrowUpRight size={14} /></Link>
                    </div>
                    {loading ? (
                        <div className="admin-skeleton-list">{[...Array(4)].map((_, i) => <div key={i} className="admin-skeleton admin-skeleton-row" />)}</div>
                    ) : recentOrders.length === 0 ? (
                        <div className="admin-empty">No orders yet</div>
                    ) : (
                        <div className="admin-order-list">
                            {recentOrders.map((order: any) => (
                                <div key={order._id} className="admin-order-row">
                                    <div>
                                        <div className="admin-order-customer">{order.customer}</div>
                                        <div className="admin-order-meta">{order.phone} · {order.items?.length || 0} item(s)</div>
                                    </div>
                                    <div className="admin-order-right">
                                        <div className="admin-order-total">Rs. {order.total.toLocaleString()}</div>
                                        <span className="admin-status-badge" style={{ background: (statusColor[order.status] || '#888') + '22', color: statusColor[order.status] || '#888' }}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <h2 className="admin-card-title"><AlertTriangle size={16} /> Low Stock Alert</h2>
                        <Link href="/admin/products" className="admin-card-link">Manage <ArrowUpRight size={14} /></Link>
                    </div>
                    {loading ? (
                        <div className="admin-skeleton-list">{[...Array(4)].map((_, i) => <div key={i} className="admin-skeleton admin-skeleton-row" />)}</div>
                    ) : lowStockProducts.length === 0 ? (
                        <div className="admin-empty">All products are well-stocked ✓</div>
                    ) : (
                        <div className="admin-order-list">
                            {lowStockProducts.slice(0, 5).map((p: any) => (
                                <div key={p._id} className="admin-order-row">
                                    <div className="admin-product-thumb">
                                        <img src={getImageUrl(p.images?.[0])} alt={p.name} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="admin-order-customer">{p.name}</div>
                                        <div className="admin-order-meta">{p.category}</div>
                                    </div>
                                    <span className="admin-stock-badge admin-stock-low">{p.stock} left</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
