"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Eye, X, ChevronDown, Search, Trash2, Printer } from "lucide-react";
import API_URL from "@/lib/api";

const ORDER_STATUSES = ["Processing", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

const statusColor: Record<string, { bg: string; text: string }> = {
    Processing: { bg: "#fef3c7", text: "#d97706" },
    Confirmed: { bg: "#dbeafe", text: "#2563eb" },
    Packed: { bg: "#ede9fe", text: "#7c3aed" },
    Shipped: { bg: "#cffafe", text: "#0891b2" },
    Delivered: { bg: "#d1fae5", text: "#059669" },
    Cancelled: { bg: "#fee2e2", text: "#dc2626" },
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState("");

    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/api/orders`);
            if (res.ok) setOrders(await res.json());
        } catch { }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const updateStatus = async (id: string, status: string) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`${API_URL}/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                const updated = await res.json();
                setOrders(prev => prev.map(o => o._id === id ? updated : o));
                if (selectedOrder?._id === id) setSelectedOrder(updated);
                setSuccessMsg("Order status updated!"); setTimeout(() => setSuccessMsg(""), 3000);
            }
        } catch { } finally { setUpdatingId(null); }
    };

    const deleteOrder = async (id: string) => {
        if (!confirm("Delete this order?")) return;
        try {
            const res = await fetch(`${API_URL}/api/orders/${id}`, { method: "DELETE" });
            if (res.ok) { setOrders(prev => prev.filter(o => o._id !== id)); if (selectedOrder?._id === id) setSelectedOrder(null); }
        } catch { }
    };

    const handlePrintInvoice = () => {
        window.print();
    };

    const filtered = orders.filter(o => {
        const matchSearch = o.customer?.toLowerCase().includes(search.toLowerCase()) || o.phone?.includes(search);
        const matchStatus = filterStatus === "All" || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const formatDate = (d: string | Date) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Orders & Online Fulfillment</h1>
                    <p className="admin-page-subtitle">{orders.length} orders · Rs. {totalRevenue.toLocaleString()} total revenue</p>
                </div>
            </div>

            {successMsg && <div className="admin-success">{successMsg}</div>}

            {/* Filters */}
            <div className="admin-filters">
                <div className="admin-search-wrap">
                    <Search size={15} />
                    <input type="text" placeholder="Search by customer or phone..." className="admin-search" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="admin-filter-tabs">
                    {["All", ...ORDER_STATUSES].map(s => (
                        <button key={s} className={`admin-filter-tab ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>{s}</button>
                    ))}
                </div>
            </div>

            <div className="admin-card admin-table-card">
                {loading ? (
                    <div className="admin-skeleton-list">{[...Array(5)].map((_, i) => <div key={i} className="admin-skeleton admin-skeleton-row" />)}</div>
                ) : filtered.length === 0 ? (
                    <div className="admin-empty"><ShoppingCart size={40} /><p>No orders found</p></div>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Type / Pay</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(o => {
                                    const sc = statusColor[o.status] || { bg: "#f3f4f6", text: "#6b7280" };
                                    return (
                                        <tr key={o._id}>
                                            <td>
                                                <div className="admin-product-name">{o.customer}</div>
                                                <div className="admin-product-desc">{o.phone}</div>
                                            </td>
                                            <td className="admin-muted">{formatDate(o.createdAt)}</td>
                                            <td className="admin-muted">{o.items?.length || 0} item(s)</td>
                                            <td>
                                                <span className={`admin-category-badge ${o.orderType === "pos_kiosk" ? "bg-amber-400/20 text-amber-400 border border-amber-400/30" : ""}`}>
                                                    {o.orderType === "pos_kiosk" ? "KIOSK POS" : o.paymentMethod?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="admin-price">Rs. {o.total.toLocaleString()}</td>
                                            <td>
                                                <div className="admin-status-select-wrap">
                                                    <select
                                                        className="admin-status-select"
                                                        style={{ background: sc.bg, color: sc.text, borderColor: sc.text + '55' }}
                                                        value={o.status}
                                                        onChange={e => updateStatus(o._id, e.target.value)}
                                                        disabled={updatingId === o._id}
                                                    >
                                                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                    <ChevronDown size={12} style={{ color: sc.text }} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="admin-actions">
                                                    <button className="admin-btn-icon admin-btn-edit" onClick={() => setSelectedOrder(o)} title="View Details & Print Packing Slip"><Eye size={14} /></button>
                                                    <button className="admin-btn-icon admin-btn-delete" onClick={() => deleteOrder(o._id)} title="Delete"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Detail & Printable Packing Slip Modal */}
            {selectedOrder && (
                <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedOrder(null)}>
                    <div className="admin-modal max-w-lg">
                        <div className="admin-modal-header">
                            <h2>Order Invoice & Packing Slip</h2>
                            <button onClick={() => setSelectedOrder(null)}><X size={20} /></button>
                        </div>

                        {/* Printable Target Section */}
                        <div className="print-area bg-white text-black p-6 rounded-lg text-xs space-y-4 font-mono border">
                            <div className="text-center pb-3 border-b border-black">
                                <h3 className="text-base font-serif font-bold tracking-widest">ESCENSIO LUXURY PERFUMERY</h3>
                                <p className="text-[10px] opacity-70">Official Invoice / Shipping Packing Slip</p>
                                <p className="text-[10px] font-bold pt-1">ORDER ID: {selectedOrder._id}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] pb-3 border-b border-black">
                                <div>
                                    <div className="font-bold">CUSTOMER DETAILS:</div>
                                    <div>{selectedOrder.customer}</div>
                                    <div>Phone: {selectedOrder.phone}</div>
                                    <div>Address: {selectedOrder.address}{selectedOrder.city ? `, ${selectedOrder.city}` : ""}</div>
                                </div>
                                <div className="text-right">
                                    <div>Date: {formatDate(selectedOrder.createdAt)}</div>
                                    <div>Payment: {selectedOrder.paymentMethod?.toUpperCase()}</div>
                                    <div>Status: {selectedOrder.status}</div>
                                </div>
                            </div>

                            <table className="w-full text-left text-[11px] pb-3 border-b border-black">
                                <thead>
                                    <tr className="border-b border-black">
                                        <th className="py-1">Item Description</th>
                                        <th className="py-1 text-center">Qty</th>
                                        <th className="py-1 text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items?.map((item: any, i: number) => (
                                        <tr key={i}>
                                            <td className="py-1">{item.name}</td>
                                            <td className="py-1 text-center">{item.quantity}</td>
                                            <td className="py-1 text-right">Rs. {(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="text-right space-y-1 text-[11px]">
                                <div className="font-bold text-sm">TOTAL AMOUNT: Rs. {selectedOrder.total?.toLocaleString()}</div>
                            </div>

                            <div className="text-center pt-2 text-[10px] opacity-70 border-t border-black">
                                Thank you for shopping with ESCENSIO. For support: hello@escensio.com
                            </div>
                        </div>

                        {/* Modal Action Controls */}
                        <div className="flex gap-3 pt-4 border-t border-white/10">
                            <button
                                onClick={handlePrintInvoice}
                                className="flex-1 bg-amber-400 hover:bg-amber-300 text-black font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm"
                            >
                                <Printer className="w-4 h-4" /> Print Packing Slip / Invoice
                            </button>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 bg-zinc-800 text-white rounded-xl text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
