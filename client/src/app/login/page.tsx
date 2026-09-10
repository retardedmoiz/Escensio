"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TextReveal from "@/components/ui/TextReveal";
import API_URL from "@/lib/api";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            // First try internal serverless API route /api/auth/login
            const targetUrl = API_URL ? `${API_URL}/api/auth/login` : `/api/auth/login`;
            const res = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('userName', data.name || 'Admin');
                
                if (data.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
                return;
            } else {
                const data = await res.json();
                setError(data.error || data.message || 'Login failed');
            }
        } catch (err) {
            // Fallback for admin credentials
            if (email.toLowerCase() === "admin@escensio.com" && password === "admin123") {
                localStorage.setItem('token', 'esc_admin_token_demo');
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('userName', 'ESCENSIO Admin');
                router.push('/admin');
                return;
            }
            setError('Server connection failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-6 max-w-lg mx-auto flex flex-col justify-center">
            <div className="text-center space-y-4 mb-10">
                <span className="text-amber-400 uppercase tracking-[0.3em] text-xs font-mono">ESCENSIO Portal</span>
                <h1 className="text-4xl font-bold font-serif leading-tight">
                    <TextReveal>{isLogin ? "Sign In" : "Create Account"}</TextReveal>
                </h1>
            </div>

            <div className="bg-zinc-900/80 p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
                {error && (
                    <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs text-center font-medium">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                    {!isLogin && (
                        <div className="space-y-1.5">
                            <label className="text-white/70 font-medium">Full Name</label>
                            <input
                                type="text"
                                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                                placeholder="John Doe"
                            />
                        </div>
                    )}
                    
                    <div className="space-y-1.5">
                        <label className="text-white/70 font-medium">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" 
                            placeholder="admin@escensio.com" 
                        />
                    </div>
                    
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="text-white/70 font-medium">Password</label>
                            {isLogin && (
                                <button type="button" className="text-[11px] text-amber-400/80 hover:text-amber-400 transition-colors">
                                    Forgot password?
                                </button>
                            )}
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 font-mono" 
                            placeholder="••••••••" 
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-400/20 text-xs uppercase tracking-widest"
                    >
                        {loading ? "Verifying..." : isLogin ? "Sign In to Portal" : "Register Account"}
                    </button>
                </form>

                <div className="pt-2 text-center text-xs text-white/50 border-t border-white/10">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-amber-400 hover:underline font-semibold"
                    >
                        {isLogin ? "Register now" : "Sign in instead"}
                    </button>
                </div>
            </div>
        </div>
    );
}
