"use client";

import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

// 🔘 BOTÓN DEL CARRITO
export function CartButton() {
  const { cart, openCart } = useCart();

  return (
    <button
      onClick={openCart}
      className="bg-terracotta text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-700 transition"
    >
      Carrito ({cart.length})
    </button>
  );
}

// 🛒 WRAPPER DEL DRAWER (SOLUCIÓN AL ERROR)
export function CartWrapped() {
  return <CartDrawer />;
}