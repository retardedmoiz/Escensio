import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        
        const adminEmail = process.env.ADMIN_EMAIL || "admin@escensio.com";
        const adminPass = process.env.ADMIN_PASSWORD || "admin123";

        if (email === adminEmail && password === adminPass) {
            return NextResponse.json({
                token: "esc_admin_token_" + Date.now(),
                user: {
                    name: "ESCENSIO Admin",
                    email: adminEmail,
                    role: "admin"
                }
            });
        } else {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
    }
}
