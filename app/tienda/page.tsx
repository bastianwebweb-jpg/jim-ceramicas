"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
};

export default function Tienda() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const getProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error cargando productos:", error);
        return;
      }
      setProducts(data || []);
    };
    getProducts();
  }, []);

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (category === "all" ? true : p.category === category))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <>
      {/* HERO - Diseño consistente con la marca */}
      <section className="bg-[#1A1A1A] text-white py-16 md:py-24 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-serif mb-4 tracking-tight">
          Nuestra colección
        </h1>
        <div className="w-12 h-px bg-terracotta mx-auto mb-6"></div>
        <p className="max-w-2xl mx-auto text-stone-400 text-lg font-light">
          Descubre piezas únicas hechas a mano, pensadas para acompañar tus rituales diarios.
        </p>
      </section>

      <main className="px-6 py-12 max-w-7xl mx-auto min-h-screen">
        
        {/* BARRA DE FILTROS - Corregida: Ya no es sticky y tiene mejor integración */}
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 mb-12 -mt-20 relative z-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">

            {/* 🔍 BUSCADOR */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Buscar pieza..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-4 pl-12 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-terracotta/5 focus:border-terracotta transition-all"
              />
              <span className="absolute left-4 top-4.5 opacity-40 group-focus-within:opacity-100 transition-opacity">🔍</span>
            </div>

            {/* 🏺 CATEGORÍA */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-4 rounded-2xl border border-stone-100 bg-stone-50 cursor-pointer focus:outline-none focus:border-terracotta transition-all appearance-none"
            >
              <option value="all">Todas las categorías</option>
              <option value="lozas">Lozas</option>
              <option value="tazas">Tazas</option>
              <option value="decoracion">Decoración</option>
            </select>

            {/* 💰 ORDEN */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="p-4 rounded-2xl border border-stone-100 bg-stone-50 cursor-pointer focus:outline-none focus:border-terracotta transition-all appearance-none"
            >
              <option value="default">Ordenar por</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>

            {/* ❌ LIMPIAR */}
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
                setSort("default");
              }}
              className="text-stone-400 hover:text-terracotta font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>✕</span> Limpiar filtros
            </button>
          </div>
        </div>

        {/* CONTADOR */}
        <div className="mb-10">
          <p className="text-stone-400 font-light italic text-lg">
            Mostrando {filteredProducts.length} piezas únicas
          </p>
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/tienda/${product.id}`} className="group">
              <div className="flex flex-col h-full bg-transparent transition-all duration-500">
                
                {/* IMAGEN */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-sm mb-6">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-stone-800">
                      Hecho en Chile
                    </span>
                  </div>
                </div>

                {/* INFORMACIÓN */}
                <div className="flex flex-col items-center text-center px-4">
                  <h2 className="font-serif text-2xl mb-1 text-stone-800 group-hover:text-terracotta transition-colors uppercase tracking-tight">
                    {product.name}
                  </h2>
                  <p className="text-terracotta font-bold text-xl">
                    ${product.price.toLocaleString("es-CL")}
                  </p>
                  <span className="mt-4 text-[11px] uppercase tracking-widest text-stone-400 font-bold border-b border-stone-200 pb-1 group-hover:border-terracotta group-hover:text-stone-800 transition-all">
                    Explorar pieza
                  </span>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* ESTADO VACÍO */}
        {filteredProducts.length === 0 && (
          <div className="py-40 text-center bg-stone-50 rounded-[3rem] border border-dashed border-stone-200 mt-10">
            <p className="text-stone-400 text-xl font-light italic">
              No encontramos piezas que coincidan con tu búsqueda.
            </p>
            <button 
              onClick={() => {setSearch(""); setCategory("all");}}
              className="mt-6 bg-terracotta text-white px-8 py-3 rounded-full hover:scale-105 transition-transform"
            >
              Ver toda la colección
            </button>
          </div>
        )}
      </main>
    </>
  );
}