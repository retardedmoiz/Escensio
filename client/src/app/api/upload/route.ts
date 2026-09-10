import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("images") as File[];
        const paths: string[] = [];

        for (const file of files) {
            if (typeof file === "object" && file.arrayBuffer) {
                const buffer = await file.arrayBuffer();
                const base64 = Buffer.from(buffer).toString("base64");
                const mimeType = file.type || "image/jpeg";
                const dataUrl = `data:${mimeType};base64,${base64}`;
                paths.push(dataUrl);
            }
        }

        if (paths.length === 0) {
            // Fallback preset product image
            paths.push("/products/perfume-1.jpg");
        }

        return NextResponse.json({ paths });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
    }
}
