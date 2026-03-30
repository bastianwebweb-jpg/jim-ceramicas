"use client";

import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

// 🔘 BOTÓN DEL CARRITO
export function CartButton() {
  const { cart, openCart } = useCart();

  const totalItems = cart.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  return (
    <button
      onClick={openCart}
      className="relative bg-terracotta text-white px-5 py-2.5 rounded-full font-medium hover:opacity-90 transition flex items-center gap-2"
    >
      🛒 Carrito

      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-0.5 rounded-full">
          {totalItems}
        </span>
      )}
    </button>
  );
}

// 🛒 ESTE ES EL QUE TE FALTA
export function CartWrapped() {
  return <CartDrawer />;
}