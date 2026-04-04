"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  stock?: number;          // Stock para productos normales
  available_slots?: number; // Stock para talleres
  isCourse?: boolean;      // Para saber qué propiedad validar
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);

  // 1. Buscamos si el producto ya está en el carrito para saber cuántos lleva
  const itemInCart = cart.find((item) => item.id === product.id);
  const currentQuantity = itemInCart ? itemInCart.quantity : 0;

  // 2. Definimos el límite real dependiendo de si es curso o producto
  const maxAvailable = product.isCourse ? (product.available_slots ?? 0) : (product.stock ?? 0);

  // 3. Verificamos si ya alcanzó el límite
  const hasReachedLimit = currentQuantity >= maxAvailable;

  const handleAdd = () => {
    if (hasReachedLimit) {
      toast.error("Lo sentimos, no hay más stock disponible 🚫");
      return;
    }

    addToCart({
      ...product,
    });

    setAdded(true);
    toast.success("Producto agregado 🛒");

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={hasReachedLimit || maxAvailable <= 0}
      className={`px-6 py-3 rounded-full font-medium transition-all duration-300
        ${
          maxAvailable <= 0 || hasReachedLimit
            ? "bg-stone-200 text-stone-500 cursor-not-allowed scale-100"
            : added
            ? "bg-green-600 text-white scale-105"
            : "bg-terracotta text-white hover:bg-orange-700"
        }`}
    >
      {maxAvailable <= 0 
        ? "Sin Stock" 
        : hasReachedLimit 
        ? "Límite alcanzado" 
        : added 
        ? "✓ Agregado" 
        : "Agregar al carrito"}
    </button>
  );
}