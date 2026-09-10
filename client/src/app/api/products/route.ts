import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let products = await db.getProducts();

    if (category && category !== "All") {
        products = products.filter(p => p.category === category);
    }
    if (featured === "true") {
        products = products.filter(p => p.isFeatured);
    }

    return NextResponse.json(products);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.name || !body.price) {
            return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
        }
        const created = await db.createProduct(body);
        return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to create product" }, { status: 500 });
    }
}
