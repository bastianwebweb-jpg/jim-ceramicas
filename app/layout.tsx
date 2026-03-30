import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import { Toaster } from "react-hot-toast";
import ClientProviders from "../components/ClientProviders";
import { CartWrapped } from "../components/CartWrapped";
import NavbarWrapper from "../components/NavbarWrapper";

export const metadata: Metadata = {
  title: "Jim Cerámicas - Loza y Cerámica Artesanal",
  description:
    "Piezas únicas hechas a mano con amor. Tazas, lozas y cerámica artesanal en Chile.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-beige text-stone-900 antialiased">
        <CartProvider>
          
          <NavbarWrapper />

          <Toaster position="top-center" />

          {/* 🔥 FIX REAL */}
          <CartWrapped />

          <main>{children}</main>

          <footer className="bg-stone-900 text-beige py-12 mt-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-2xl font-serif tracking-widest mb-2">
                JIM CERÁMICAS
              </p>

              <p className="opacity-75">
                Cerámica artesanal hecha con tierra y fuego en Chile
              </p>

              <p className="text-xs mt-8 opacity-50">
                © 2026 Jim Cerámicas • Todos los derechos reservados
              </p>
            </div>
          </footer>

        </CartProvider>
      </body>
    </html>
  );
}