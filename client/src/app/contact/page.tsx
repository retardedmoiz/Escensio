"use client";

import TextReveal from "@/components/ui/TextReveal";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useSettings } from "@/components/providers/SettingsContext";
import { getImageUrl } from "@/lib/api";

export default function ContactPage() {
    const { settings } = useSettings();

    return (
        <div className="min-h-screen bg-[#120F0D] text-[#EAE4D9] pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
                <span className="text-[#C89D54] uppercase tracking-[0.3em] text-xs font-mono">Boutique & Kiosks</span>
                <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight text-[#EAE4D9]">
                    <TextReveal>Contact & Physical Locations</TextReveal>
                </h1>
                <p className="text-[#EAE4D9]/60 text-xs md:text-sm max-w-2xl mx-auto font-light leading-relaxed">
                    Whether you wish to sample extraits in person at our Wah Cantt kiosk or submit a bespoke inquiry, we are at your service.
                </p>
            </div>

            {/* Banner Image */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-[#C89D54]/30 bg-black shadow-2xl">
                <img
                    src={getImageUrl(settings.contactBannerImage || "/products/perfume-4.jpg")}
                    alt="ESCENSIO Kiosk Location"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-black/40 to-transparent flex items-end p-8">
                    <div>
                        <span className="text-[#C89D54] text-xs font-mono uppercase tracking-[0.2em]">Operational Counter</span>
                        <h2 className="text-2xl font-serif font-bold text-white">POF Skating Park, Wah Cantt</h2>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-[#181410] p-8 md:p-10 rounded-2xl border border-[#332A22] shadow-xl space-y-6">
                    <h2 className="text-2xl font-serif text-[#C89D54] font-bold">Send an Atelier Message</h2>
                    <form className="space-y-4 text-xs">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[#EAE4D9]/70 font-medium">First Name</label>
                                <input type="text" className="w-full bg-black/50 border border-[#332A22] rounded-xl px-4 py-3 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54]" placeholder="John" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[#EAE4D9]/70 font-medium">Last Name</label>
                                <input type="text" className="w-full bg-black/50 border border-[#332A22] rounded-xl px-4 py-3 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54]" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[#EAE4D9]/70 font-medium">Email Address</label>
                            <input type="email" className="w-full bg-black/50 border border-[#332A22] rounded-xl px-4 py-3 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54]" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[#EAE4D9]/70 font-medium">Message</label>
                            <textarea rows={4} className="w-full bg-black/50 border border-[#332A22] rounded-xl px-4 py-3 text-[#EAE4D9] focus:outline-none focus:border-[#C89D54] resize-none" placeholder="How may we assist your fragrance inquiry?"></textarea>
                        </div>
                        <button type="button" className="w-full bg-[#C89D54] hover:bg-[#b08743] text-black font-bold py-3.5 rounded-sm text-xs uppercase tracking-[0.2em] transition-all">
                            Submit Inquiry
                        </button>
                    </form>
                </div>

                {/* Locations & Info */}
                <div className="space-y-8 bg-[#181410] p-8 md:p-10 rounded-2xl border border-[#332A22] shadow-xl flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-serif text-[#C89D54] font-bold mb-6">Boutique & Kiosks</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-black border border-[#C89D54]/30 text-[#C89D54] rounded-xl shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="space-y-1 text-xs">
                                    <h3 className="text-base font-serif font-bold text-[#EAE4D9]">Wah Cantt Store Kiosk</h3>
                                    <p className="text-[#EAE4D9]/60">{settings.storeAddress || "POF Skating Park, Wah Cantt, Pakistan"}</p>
                                    <p className="text-[#C89D54] font-mono font-semibold">Open Daily: 12:00 PM – 10:00 PM</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start pt-4 border-t border-[#332A22]">
                                <div className="p-3 bg-black border border-[#332A22] text-[#EAE4D9]/40 rounded-xl shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="space-y-1 text-xs">
                                    <h3 className="text-base font-serif font-bold text-[#EAE4D9]">Kiosk #02 Boutique</h3>
                                    <p className="text-[#EAE4D9]/40">Upcoming Flagship Location</p>
                                    <p className="text-[#C89D54]/60 font-mono">Opening Soon</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[#332A22] space-y-4 text-xs font-mono">
                        <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-[#C89D54]" />
                            <div>
                                <span className="text-[#EAE4D9]/40 block text-[10px] uppercase">Direct Phone / WhatsApp</span>
                                <a href={`https://wa.me/${settings.whatsappNumber || "923001234567"}`} className="text-[#EAE4D9] hover:text-[#C89D54]">
                                    {settings.storePhone || "+92 300 1234567"}
                                </a>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-[#C89D54]" />
                            <div>
                                <span className="text-[#EAE4D9]/40 block text-[10px] uppercase">Email Inquiries</span>
                                <a href={`mailto:${settings.storeEmail || "hello@escensio.com"}`} className="text-[#EAE4D9] hover:text-[#C89D54]">
                                    {settings.storeEmail || "hello@escensio.com"}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
