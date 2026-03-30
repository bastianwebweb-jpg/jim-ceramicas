"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      ...product,
      quantity: 1,
    });

    setAdded(true);

    toast.success("Producto agregado 🛒");

    // vuelve al estado normal después de 2 segundos
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`px-6 py-3 rounded-full font-medium transition-all duration-300
        ${
          added
            ? "bg-green-600 text-white scale-105"
            : "bg-terracotta text-white hover:bg-orange-700"
        }`}
    >
      {added ? "✓ Agregado" : "Agregar al carrito"}
    </button>
  );
}