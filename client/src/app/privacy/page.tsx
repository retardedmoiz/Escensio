"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-14">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <span className="text-primary uppercase tracking-[0.3em] text-sm font-medium">Legal</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-light text-foreground">Privacy Policy</h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest">Last Updated: June 2026</p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="prose prose-lg mx-auto text-muted-foreground prose-headings:font-serif prose-headings:font-medium prose-headings:text-foreground prose-a:text-primary"
                >
                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. 
                        When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address, phone number, or credit card information.
                    </p>

                    <h2>2. How We Use Your Information</h2>
                    <p>Any of the information we collect from you may be used in one of the following ways:</p>
                    <ul>
                        <li>To personalize your experience (your information helps us to better respond to your individual needs)</li>
                        <li>To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you)</li>
                        <li>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)</li>
                        <li>To process transactions</li>
                        <li>To send periodic emails</li>
                    </ul>

                    <h2>3. How We Protect Your Information</h2>
                    <p>
                        We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
                        We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems, and are required to keep the information confidential.
                    </p>

                    <h2>4. Do We Use Cookies?</h2>
                    <p>
                        Yes. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your Web browser (if you allow) that enables the sites or service providers systems to recognize your browser and capture and remember certain information.
                    </p>

                    <h2>5. Your Consent</h2>
                    <p>By using our site, you consent to our website's privacy policy.</p>
                </motion.div>
            </div>
        </div>
    );
}
