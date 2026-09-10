"use client";

import { motion } from "framer-motion";

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-14">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <span className="text-primary uppercase tracking-[0.3em] text-sm font-medium">Legal</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-light text-foreground">Refund Policy</h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest">Last Updated: June 2026</p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="prose prose-lg mx-auto text-muted-foreground prose-headings:font-serif prose-headings:font-medium prose-headings:text-foreground prose-a:text-primary"
                >
                    <h2>1. Returns</h2>
                    <p>
                        Our policy lasts 14 days. If 14 days have gone by since your purchase, unfortunately, we can’t offer you a refund or exchange.
                        To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging with the seal intact. Due to hygiene reasons, opened fragrances cannot be returned.
                    </p>

                    <h2>2. Refunds</h2>
                    <p>
                        Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                        If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
                    </p>

                    <h2>3. Late or Missing Refunds</h2>
                    <p>
                        If you haven’t received a refund yet, first check your bank account again.
                        Then contact your credit card company, it may take some time before your refund is officially posted.
                        Next contact your bank. There is often some processing time before a refund is posted.
                        If you’ve done all of this and you still have not received your refund yet, please contact us at hello@escensio.com.
                    </p>

                    <h2>4. Exchanges</h2>
                    <p>
                        We only replace items if they are defective or damaged during transit. If you need to exchange it for the same item, send us an email at hello@escensio.com with photographic proof of the damage.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
