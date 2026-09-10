"use client";

import { motion } from "framer-motion";

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-14">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <span className="text-primary uppercase tracking-[0.3em] text-sm font-medium">Legal</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-light text-foreground">Shipping Policy</h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest">Last Updated: June 2026</p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="prose prose-lg mx-auto text-muted-foreground prose-headings:font-serif prose-headings:font-medium prose-headings:text-foreground prose-a:text-primary"
                >
                    <h2>1. Processing Time</h2>
                    <p>
                        All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
                        If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
                    </p>

                    <h2>2. Shipping Rates & Delivery Estimates</h2>
                    <p>
                        Shipping charges for your order will be calculated and displayed at checkout.
                    </p>
                    <ul>
                        <li><strong>Standard Shipping:</strong> 3-5 business days</li>
                        <li><strong>Express Shipping:</strong> 1-2 business days</li>
                    </ul>
                    <p>Delivery delays can occasionally occur due to weather conditions or carrier issues beyond our control.</p>

                    <h2>3. Shipment Confirmation & Order Tracking</h2>
                    <p>
                        You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
                    </p>

                    <h2>4. Damages</h2>
                    <p>
                        Escensio takes great care in packaging our glass bottles. However, if your order arrives damaged, please save all packaging materials and damaged goods and contact us immediately so we can file a claim with the carrier and send you a replacement.
                    </p>

                    <h2>5. International Shipping</h2>
                    <p>
                        Currently, we offer shipping within Pakistan. We are working on expanding our logistics network to offer international shipping soon.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
