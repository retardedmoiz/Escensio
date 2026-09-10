import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/providers/CartContext";
import ConditionalShell from "@/components/providers/ConditionalShell";

export const metadata: Metadata = {
  title: "ESCENSIO | The Essence of Luxury",
  description: "Discover the art of fine fragrance with Escensio. Crafted for those who appreciate elegance, our perfumes blend timeless notes with modern sophistication.",
  keywords: "Perfume, Fine fragrance, Luxury perfume, Men's perfume, Women's perfume, Unisex fragrance, Escensio, Pakistan",
  openGraph: {
    title: "ESCENSIO | The Essence of Luxury",
    description: "Discover the art of fine fragrance with Escensio.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background max-w-[100vw] overflow-x-hidden">
        <CartProvider>
          <ConditionalShell>
            {children}
          </ConditionalShell>
        </CartProvider>
      </body>
    </html>
  );
}
