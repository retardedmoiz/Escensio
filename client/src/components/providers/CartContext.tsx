"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const addItem = (newItem: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === newItem.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
        setIsOpen(true);
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    return (
        <CartContext.Provider value={{ items, isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false), addItem, removeItem }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
