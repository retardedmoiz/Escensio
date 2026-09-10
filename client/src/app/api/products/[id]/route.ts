import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await db.getProductById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const updated = await db.updateProduct(id, body);
        if (!updated) return NextResponse.json({ error: "Product not found" }, { status: 404 });
        return NextResponse.json(updated);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await db.deleteProduct(id);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to delete product" }, { status: 500 });
    }
}
