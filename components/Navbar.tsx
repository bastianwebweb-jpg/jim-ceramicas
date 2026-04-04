"use client";

import Link from "next/link";
import { CartButton } from "./CartWrapped";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">

          {/* 🍔 MOBILE MENU BUTTON */}
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
            <Link href="/" className="hover:text-terracotta transition-colors">Inicio</Link>
            <Link href="/tienda" className="hover:text-terracotta transition-colors">Tienda</Link>
            <Link href="/nosotros" className="hover:text-terracotta transition-colors">Nosotros</Link>
            <Link href="/contacto" className="hover:text-terracotta transition-colors">Contacto</Link>
          </div>

          {/* 🛒 + USER CONTROLS */}
          <div className="flex items-center gap-3">
            
            {!user ? (
              /* ESTADO: CERRADO (Login / Register) */
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-stone-600 hover:text-terracotta transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="text-sm px-5 py-2 rounded-full bg-terracotta text-white hover:bg-black transition-all shadow-sm"
                >
                  Crear cuenta
                </Link>
              </div>
            ) : (
              /* ESTADO: CONECTADO (Avatar Menú) */
              <div 
                className="relative hidden md:block"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button className="w-9 h-9 rounded-full bg-[#3B2F2F] text-white flex items-center justify-center text-sm font-bold border-2 border-transparent hover:border-terracotta transition-all">
                  {user.email?.charAt(0).toUpperCase()}
                </button>

                {/* 🔽 MENÚ DESPLEGABLE */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-0 w-48 bg-white shadow-xl rounded-xl border border-stone-100 py-2 z-60 animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-2 border-b border-stone-50">
                      <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Mi Cuenta</p>
                      <p className="text-xs text-stone-600 truncate font-medium">{user.email}</p>
                    </div>
                    
                    <Link 
                      href="/perfil" 
                      className="block px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 hover:text-terracotta transition-colors"
                    >
                      Ver Perfil
                    </Link>
                    
                    <Link 
                      href="/perfil" 
                      className="block px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 hover:text-terracotta transition-colors"
                    >
                      Historial de Pedidos
                    </Link>

                    <div className="border-t border-stone-50 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <CartButton />
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE MENU PANEL */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-100" onClick={() => setMenuOpen(false)}>
          <div 
            className="bg-white w-[80%] h-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-serif text-terracotta">Menú</h2>
              <button className="text-3xl" onClick={() => setMenuOpen(false)}>✕</button>
            </div>

            <div className="flex flex-col gap-6 text-lg font-medium text-stone-700">
              <Link href="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
              <Link href="/tienda" onClick={() => setMenuOpen(false)}>Tienda</Link>
              <Link href="/nosotros" onClick={() => setMenuOpen(false)}>Nosotros</Link>
              <Link href="/contacto" onClick={() => setMenuOpen(false)}>Contacto</Link>
              
              <hr className="border-stone-100 my-2" />

              {!user ? (
                <div className="flex flex-col gap-4">
                  <Link 
                    href="/login" 
                    className="text-stone-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-terracotta text-white text-center py-3 rounded-full"
                    onClick={() => setMenuOpen(false)}
                  >
                    Crear cuenta
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-xs text-stone-400 uppercase tracking-widest">{user.email}</p>
                  <Link href="/perfil" onClick={() => setMenuOpen(false)}>Mi perfil</Link>
                  <Link href="/perfil" onClick={() => setMenuOpen(false)}>Mis pedidos</Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-500 font-bold"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}