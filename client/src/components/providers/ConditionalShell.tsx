"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CartSheet from "@/components/shared/CartSheet";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";
import PageLoader from "@/components/ui/PageLoader";

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <PageLoader />
            <SmoothScroll>
                <Navbar />
                {children}
                <Footer />
                <CartSheet />
                <WhatsAppFloat />
            </SmoothScroll>
        </>
    );
}
