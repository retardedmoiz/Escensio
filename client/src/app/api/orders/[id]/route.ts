import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const updated = await db.updateOrderStatus(id, body.status);
        if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });
        return NextResponse.json(updated);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to update order status" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await db.deleteOrder(id);
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to delete order" }, { status: 500 });
    }
}
