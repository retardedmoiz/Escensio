"use client";

import TextReveal from "@/components/ui/TextReveal";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import API_URL from "@/lib/api";

export default function ContactPage() {
    const [settings, setSettings] = useState<any>({});
    useEffect(() => {
        fetch(`${API_URL}/api/settings`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(() => {});
    }, []);

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-20">
                <span className="text-primary uppercase tracking-[0.3em] text-sm font-medium">Get in Touch</span>
                <h1 className="text-5xl md:text-7xl font-bold font-serif leading-tight">
                    <TextReveal>Contact & Locations</TextReveal>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Whether you have a question about our collections or want to experience our fragrances in person, we are here for you.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
                {/* Contact Form */}
                <div className="bg-card p-10 rounded-2xl border border-border/40 shadow-sm">
                    <h2 className="text-3xl font-serif mb-6">Send us a Message</h2>
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input type="email" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <textarea rows={5} className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none" placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="button" className="w-full bg-primary text-primary-foreground font-medium py-4 rounded-lg hover:bg-primary/90 transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Locations & Info */}
                <div className="space-y-12">
                    <div>
                        <h2 className="text-3xl font-serif mb-6">Physical Locations</h2>
                        <div className="space-y-8">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif mb-2">Escensio Kiosk 1</h3>
                                    <p className="text-muted-foreground">POF Skating Park<br/>Wah Cantt, Pakistan</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0 relative overflow-hidden">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-serif">Escensio Kiosk 2</h3>
                                        <span className="flex items-center gap-2 px-2.5 py-1 bg-red-500/10 text-red-500 text-xs font-semibold uppercase tracking-widest rounded-full">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute"></span>
                                            <span className="w-2 h-2 rounded-full bg-red-500 relative"></span>
                                            Coming Soon
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground">Location to be announced<br/>Stay tuned!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border/40">
                        <h2 className="text-3xl font-serif mb-6">Direct Contact</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-center">
                                <div className="p-3 bg-muted rounded-full shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider">Phone / WhatsApp</p>
                                    <p className="font-medium">{settings?.storePhone || "+92 311 0043738"}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="p-3 bg-muted rounded-full shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider">Email</p>
                                    <p className="font-medium">{settings?.storeEmail || "Support@ecsensiofragrance.com"}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="p-3 bg-muted rounded-full shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground uppercase tracking-wider">Hours</p>
                                    <p className="font-medium">Mon - Sun: 10AM - 10PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
