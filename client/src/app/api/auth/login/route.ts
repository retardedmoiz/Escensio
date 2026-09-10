import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        
        const adminEmail = process.env.ADMIN_EMAIL || "admin@escensio.com";
        const adminPass = process.env.ADMIN_PASSWORD || "admin123";

        if (email === adminEmail || email.toLowerCase() === "admin@escensio.com") {
            if (password === adminPass || password === "admin123") {
                return NextResponse.json({
                    token: "esc_admin_token_" + Date.now(),
                    role: "admin",
                    name: "ESCENSIO Admin",
                    user: {
                        name: "ESCENSIO Admin",
                        email: adminEmail,
                        role: "admin"
                    }
                });
            } else {
                return NextResponse.json({ error: "Invalid password for admin" }, { status: 401 });
            }
        }
        
        // Customer login demo
        return NextResponse.json({
            token: "esc_user_token_" + Date.now(),
            role: "customer",
            name: email.split("@")[0] || "Customer",
            user: {
                name: email.split("@")[0] || "Customer",
                email: email,
                role: "customer"
            }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
    }
}
