import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const posOrderData = {
            customer: body.customer || "Walk-In Customer",
            phone: body.phone || "+92 300 0000000",
            address: "Kiosk Counter Sale (Wah Cantt)",
            city: "Wah Cantt",
            items: body.items,
            subtotal: body.subtotal,
            tax: body.tax || 0,
            discount: body.discount || 0,
            total: body.total,
            paymentMethod: body.paymentMethod || "cash",
            cashReceived: body.cashReceived,
            changeGiven: body.changeGiven,
            orderType: "pos_kiosk",
            notes: body.notes || "Processed via POS Kiosk",
            status: "Delivered",
        };

        const createdOrder = await db.createOrder(posOrderData);
        return NextResponse.json({ success: true, order: createdOrder }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to process POS sale" }, { status: 500 });
    }
}
