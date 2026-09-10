import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/providers/CartContext";
import { SettingsProvider } from "@/components/providers/SettingsContext";
import ConditionalShell from "@/components/providers/ConditionalShell";

export const metadata: Metadata = {
  title: "ESCENSIO | Artisanal Haute Parfumerie",
  description: "Discover the art of fine fragrance with Escensio. Crafted with raw natural botanicals, aged woods, and quiet sophistication.",
  keywords: "Perfume, Artisanal fragrance, Luxury perfume, Oud, Sandalwood, Escensio, Pakistan",
  icons: {
    icon: [
      { url: "/escensio-logo.png", type: "image/png" },
      { url: "/logo.png", type: "image/png" }
    ],
    shortcut: "/escensio-logo.png",
    apple: "/escensio-logo.png",
  },
  openGraph: {
    title: "ESCENSIO | Artisanal Haute Parfumerie",
    description: "Discover the art of fine fragrance with Escensio.",
    type: "website",
    images: [{ url: "/escensio-logo.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#120F0D] text-[#EAE4D9] max-w-[100vw] overflow-x-hidden selection:bg-[#C89D54] selection:text-black">
        <SettingsProvider>
          <CartProvider>
            <ConditionalShell>
              {children}
            </ConditionalShell>
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
