import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    const products = await db.getProducts();
    const totalItems = products.length;
    const totalValuation = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const lowStockItems = products.filter(p => p.stock <= 10);
    const outOfStockItems = products.filter(p => p.stock === 0);

    return NextResponse.json({
        totalItems,
        totalValuation,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
        products,
        lowStockItems,
        outOfStockItems,
    });
}

export async function PUT(req: Request) {
    try {
        const { id, stock, sku, price } = await req.json();
        const updated = await db.updateProduct(id, { stock, sku, price });
        return NextResponse.json(updated);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to update inventory" }, { status: 500 });
    }
}
