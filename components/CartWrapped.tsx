"use client";

import { useCart } from "../context/CartContext";

export function CartButton() {
  const { cart, openCart } = useCart();

  // 🔢 total real de productos
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

      {/* 🔴 badge */}
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-0.5 rounded-full">
          {totalItems}
        </span>
      )}
    </button>
  );
}