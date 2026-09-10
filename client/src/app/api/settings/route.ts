import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    const settings = await db.getSettings();
    return NextResponse.json(settings);
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const updated = await db.updateSettings(body);
        return NextResponse.json(updated);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to update settings" }, { status: 500 });
    }
}
