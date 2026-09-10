import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    const orders = await db.getOrders();
    const products = await db.getProducts();

    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
    const totalOrders = orders.length;
    const processingOrders = orders.filter(o => o.status === "Processing" || o.status === "Confirmed").length;
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock <= 10).length;

    return NextResponse.json({
        totalRevenue,
        totalOrders,
        processingOrders,
        totalProducts,
        lowStockCount,
        totalBlogs: 4,
    });
}
