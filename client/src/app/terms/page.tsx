"use client";

import { motion } from "framer-motion";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-14">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <span className="text-primary uppercase tracking-[0.3em] text-sm font-medium">Legal</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-light text-foreground">Terms of Service</h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest">Last Updated: June 2026</p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="prose prose-lg mx-auto text-muted-foreground prose-headings:font-serif prose-headings:font-medium prose-headings:text-foreground prose-a:text-primary"
                >
                    <h2>1. General Conditions</h2>
                    <p>
                        We reserve the right to refuse service to anyone for any reason at any time.
                        You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
                    </p>

                    <h2>2. Products or Services</h2>
                    <p>
                        Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
                        We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
                    </p>

                    <h2>3. Accuracy of Billing and Account Information</h2>
                    <p>
                        We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address.
                    </p>

                    <h2>4. Third-Party Links</h2>
                    <p>
                        Certain content, products and services available via our Service may include materials from third-parties.
                        Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites.
                    </p>

                    <h2>5. Governing Law</h2>
                    <p>
                        These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Pakistan.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
