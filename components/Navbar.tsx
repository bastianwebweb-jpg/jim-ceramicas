"use client";

import Link from "next/link";
import { CartButton } from "./CartWrapped";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();

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
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">

          {/* 🍔 MOBILE MENU */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>

          {/* 🏺 LOGO */}
          <Link
            href="/"
            className="text-xl md:text-3xl font-serif text-terracotta tracking-widest"
          >
            JIM CERÁMICAS
          </Link>

          {/* 🔗 DESKTOP LINKS */}
          <div className="hidden md:flex gap-8 text-lg font-medium text-[#3f3f46]">
            <Link href="/">Inicio</Link>
            <Link href="/tienda">Tienda</Link>
            <Link href="/nosotros">Nosotros</Link>
            <Link href="/contacto">Contacto</Link>
          </div>

          {/* 🛒 + USER */}
          <div className="flex items-center gap-3">

            {!user ? (
              <div className="hidden md:flex gap-3">
                <Link href="/login" className="text-sm">
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-terracotta text-white px-4 py-2 rounded-full text-sm"
                >
                  Crear cuenta
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#3B2F2F] text-white flex items-center justify-center text-sm">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            <CartButton />
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE MENU PANEL */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50">
          
          <div className="bg-white w-[75%] h-full p-6 shadow-xl animate-slide-in">

            {/* ❌ cerrar */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-semibold">Menú</h2>
              <button onClick={() => setMenuOpen(false)}>✖</button>
            </div>

            {/* LINKS */}
            <div className="flex flex-col gap-6 text-lg">

              <Link href="/" onClick={() => setMenuOpen(false)}>
                Inicio
              </Link>

              <Link href="/tienda" onClick={() => setMenuOpen(false)}>
                Tienda
              </Link>

              <Link href="/nosotros" onClick={() => setMenuOpen(false)}>
                Nosotros
              </Link>

              <Link href="/contacto" onClick={() => setMenuOpen(false)}>
                Contacto
              </Link>

              <hr />

              {!user ? (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    Iniciar sesión
                  </Link>

                  <Link href="/register" onClick={() => setMenuOpen(false)}>
                    Crear cuenta
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/perfil" onClick={() => setMenuOpen(false)}>
                    Mi perfil
                  </Link>

                  <Link href="/perfil" onClick={() => setMenuOpen(false)}>
                    Mis pedidos
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-left text-red-500"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}