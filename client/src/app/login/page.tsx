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
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        try {
            const res = await fetch(`${API_URL}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('userName', data.name || 'Admin');
                
                if (data.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server connection failed. Ensure backend is running.');
        }
    };

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 max-w-lg mx-auto flex flex-col justify-center">
            <div className="text-center space-y-4 mb-10">
                <span className="text-primary uppercase tracking-[0.3em] text-sm font-medium">Welcome Back</span>
                <h1 className="text-4xl font-bold font-serif leading-tight">
                    <TextReveal>{isLogin ? "Client Portal" : "Create Account"}</TextReveal>
                </h1>
            </div>

            <div className="bg-card p-8 md:p-10 rounded-2xl border border-border/40 shadow-sm">
                {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" 
                            placeholder="you@example.com" 
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium">Password</label>
                            {isLogin && <button type="button" className="text-xs text-muted-foreground hover:text-primary transition-colors">Forgot password?</button>}
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" 
                            placeholder="••••••••" 
                        />
                    </div>
                    
                    <button type="submit" className="w-full bg-primary text-primary-foreground font-medium py-4 rounded-lg hover:bg-primary/90 transition-colors">
                        {isLogin ? "Sign In" : "Register"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-foreground hover:text-primary font-medium transition-colors"
                    >
                        {isLogin ? "Register now" : "Sign in instead"}
                    </button>
                </div>
                
            </div>
        </div>
    );
}
