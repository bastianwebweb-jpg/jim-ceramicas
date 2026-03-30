"use client";

import { CartProvider } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import { Toaster } from "react-hot-toast";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Toaster position="top-center" />
      <CartDrawer />
      {children}
    </CartProvider>
  );
}