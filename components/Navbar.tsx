"use client";

import Link from "next/link";
import { CartButton } from "./CartWrapped";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.reload(); // simple y efectivo
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-serif text-terracotta tracking-widest"
        >
          JIM CERÁMICAS
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex gap-8 text-lg font-medium text-[#3f3f46]">
          <Link href="/" className="hover:text-terracotta transition">
            Inicio
          </Link>

          <Link href="/tienda" className="hover:text-terracotta transition">
            Tienda
          </Link>

          <Link href="/nosotros" className="hover:text-terracotta transition">
            Nosotros
          </Link>

          <Link href="/contacto" className="hover:text-terracotta transition">
            Contacto
          </Link>
        </div>

        {/* DERECHA */}
        <div className="flex items-center gap-4">

          {/* 👤 AUTH */}
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-sm hover:text-terracotta transition"
              >
                Iniciar sesión
              </Link>

              <Link
                href="/register"
                className="bg-terracotta text-white px-4 py-2 rounded-full text-sm hover:opacity-90 transition"
              >
                Crear cuenta
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/perfil"
                className="text-sm hover:text-terracotta transition"
              >
                Mi perfil
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline"
              >
                Salir
              </button>
            </>
          )}

          {/* 🛒 */}
          <CartButton />
        </div>

      </div>
    </nav>
  );
}