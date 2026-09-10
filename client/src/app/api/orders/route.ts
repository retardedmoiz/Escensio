import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    const orders = await db.getOrders();
    return NextResponse.json(orders);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.items || body.items.length === 0) {
            return NextResponse.json({ error: "Order items cannot be empty" }, { status: 400 });
        }
        const created = await db.createOrder(body);
        return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
    }
}
