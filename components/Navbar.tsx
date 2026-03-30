"use client";

import Link from "next/link";
import { CartButton } from "./CartWrapped";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 🔥 obtener usuario inicial
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();

    // 🔥 escuchar cambios en tiempo real
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

        {/* 🏺 LOGO */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-serif text-terracotta tracking-widest"
        >
          JIM CERÁMICAS
        </Link>

        {/* 🔗 LINKS */}
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

        {/* 👉 DERECHA */}
        <div className="flex items-center gap-4">

          {/* 👤 USUARIO */}
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
            <div className="relative group">

              {/* 👤 BOTÓN USUARIO */}
              <div className="flex items-center gap-2 cursor-pointer">

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-[#3B2F2F] text-white flex items-center justify-center text-sm font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>

                {/* Email */}
                <span className="text-sm hidden md:block max-w-[120px] truncate">
                  {user.email}
                </span>
              </div>

              {/* 🔽 DROPDOWN */}
              <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

                <div className="p-3 border-b text-xs text-gray-500 truncate">
                  {user.email}
                </div>

                <Link
                  href="/perfil"
                  className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                >
                  Mi perfil
                </Link>

                <Link
                  href="/perfil"
                  className="block px-4 py-3 text-sm hover:bg-gray-100 transition"
                >
                  Mis pedidos
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-100 transition"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}

          {/* 🛒 CARRITO */}
          <CartButton />
        </div>

      </div>
    </nav>
  );
}