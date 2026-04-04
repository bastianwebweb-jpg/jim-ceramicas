"use client";

import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

export type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  isCourse?: boolean;
  stock?: number;          // 🔥 Importante para productos
  available_slots?: number; // 🔥 Importante para talleres
};

type CartContextType = {
  cart: Product[];
  addToCart: (product: Omit<Product, "quantity">) => void; 
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function openCart() { setIsOpen(true); }
  function closeCart() { setIsOpen(false); }
  function clearCart() { setCart([]); }

  // 🔥 VALIDACIÓN AL AUMENTAR CANTIDAD DESDE EL CARRITO
  const increaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const limit = item.isCourse ? (item.available_slots ?? 0) : (item.stock ?? 0);
          
          if (item.quantity < limit) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            toast.error("Límite de stock alcanzado");
            return item;
          }
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 🔥 VALIDACIÓN AL AGREGAR DESDE LA TIENDA
  function addToCart(product: Omit<Product, "quantity">) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const limit = product.isCourse ? (product.available_slots ?? 0) : (product.stock ?? 0);

      if (existing) {
        if (existing.quantity < limit) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          toast.error("No hay más stock disponible");
          return prev;
        }
      }
      
      // Si es la primera vez que se agrega, verificar que haya al menos 1
      if (limit > 0) {
        return [...prev, { ...product, quantity: 1 }];
      } else {
        toast.error("Producto agotado");
        return prev;
      }
    });
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        isOpen,
        openCart,
        closeCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}