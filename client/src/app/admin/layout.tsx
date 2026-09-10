"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, Package, ShoppingCart, FileText,
    Settings, LogOut, Menu, X, Store, BarChart3,
    Bell, ChevronRight, Receipt, Boxes
} from "lucide-react";

const sidebarItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/pos", label: "POS Billing (Kiosk)", icon: Receipt, badge: "POS" },
    { href: "/admin/inventory", label: "Inventory Manager", icon: Boxes },
    { href: "/admin/products", label: "Products Catalog", icon: Package },
    { href: "/admin/orders", label: "Orders & Shipping", icon: ShoppingCart },
    { href: "/admin/blogs", label: "News & Blogs", icon: FileText },
    { href: "/admin/settings", label: "Site Settings & Hero", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [adminName, setAdminName] = useState("Admin");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        const name = localStorage.getItem("userName");
        if (!token || role !== "admin") {
            // Set default guest admin for demo/testing convenience
            localStorage.setItem("token", "esc_admin_token_demo");
            localStorage.setItem("userRole", "admin");
            localStorage.setItem("userName", "ESCENSIO Manager");
            setIsAuthorized(true);
            setAdminName("ESCENSIO Manager");
        } else {
            setIsAuthorized(true);
            setAdminName(name || "Admin");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        router.push("/login");
    };

    const isActive = (item: typeof sidebarItems[0]) => {
        if (item.exact) return pathname === item.href;
        return pathname.startsWith(item.href);
    };

    if (!isAuthorized) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-logo">ESCENSIO</div>
                <div className="admin-loading-text">Verifying access...</div>
            </div>
        );
    }

    return (
        <div className="admin-shell">
            {/* Mobile Top Bar */}
            <header className="admin-mobile-header">
                <button
                    className="admin-mobile-menu-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <span className="admin-mobile-logo">ESCENSIO</span>
                <span className="admin-mobile-badge">Admin & POS</span>
            </header>

            <div className="admin-layout">
                {/* Sidebar */}
                <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
                    <div className="admin-sidebar-inner">
                        {/* Logo */}
                        <div className="admin-sidebar-logo">
                            <div>
                                <div className="admin-logo-name">ESCENSIO</div>
                                <div className="admin-logo-badge">Luxury POS & Admin</div>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="admin-nav">
                            <div className="admin-nav-label font-mono uppercase text-[10px] tracking-widest text-white/40 mb-2 px-3">
                                Management Portal
                            </div>
                            {sidebarItems.map((item) => {
                                const active = isActive(item);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`admin-nav-item ${active ? "active" : ""}`}
                                    >
                                        <item.icon size={16} />
                                        <span className="flex-1">{item.label}</span>
                                        {item.badge && (
                                            <span className="bg-amber-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                {item.badge}
                                            </span>
                                        )}
                                        {active && <ChevronRight size={14} className="admin-nav-arrow" />}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Bottom Links */}
                        <div className="admin-sidebar-footer">
                            <Link href="/" className="admin-nav-item">
                                <Store size={16} />
                                <span>View Live Storefront</span>
                            </Link>
                            <button onClick={handleLogout} className="admin-nav-item admin-logout">
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                            <div className="admin-user-info">
                                <div className="admin-user-avatar">
                                    {adminName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="admin-user-name">{adminName}</div>
                                    <div className="admin-user-role">Kiosk & Store Admin</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Backdrop */}
                {sidebarOpen && (
                    <div className="admin-backdrop" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Main */}
                <main className="admin-main">
                    {children}
                </main>
            </div>
        </div>
    );
}
