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
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error("Error cargando productos:", error);
        return;
      }
      setProducts(data || []);
    };
    getProducts();
  }, []);

  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      category === "all" ? true : p.category === category
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <>
      {/* HERO - Más compacto y elegante */}
      <section className="bg-[#1A1A1A] text-white py-16 md:py-24 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-serif mb-4 tracking-tight">
          Nuestra colección
        </h1>
        <div className="w-12 h-px bg-terracotta mx-auto mb-6"></div>
        <p className="max-w-2xl mx-auto text-stone-400 text-lg font-light">
          Descubre piezas únicas hechas a mano, pensadas para acompañar tus rituales diarios.
        </p>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="px-6 py-12 max-w-7xl mx-auto min-h-screen">

        {/* BARRA DE FILTROS - Diseño más integrado y sutil */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm mb-10 border border-stone-200 sticky top-24 z-10 backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">

            {/* 🔍 BUSCADOR */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pl-10 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all"
              />
              <span className="absolute left-3 top-3.5 opacity-40 group-focus-within:opacity-100 transition-opacity">🔍</span>
            </div>

            {/* 🏺 CATEGORÍA */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer focus:outline-none focus:border-terracotta"
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
              className="p-3 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer focus:outline-none focus:border-terracotta"
            >
              <option value="default">Ordenar por</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>

            {/* ❌ LIMPIAR - Menos dominante, más estético */}
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
                setSort("default");
              }}
              className="text-stone-500 hover:text-stone-800 font-medium text-sm transition-colors py-2"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* CONTADOR Y RESULTADOS */}
        <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
          <p className="text-stone-500 font-light italic">
            Mostrando {filteredProducts.length} piezas artesanales
          </p>
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/tienda/${product.id}`} className="group">
              <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden transition-all duration-500">

                {/* IMAGEN - Con mayor altura y efecto sutil */}
                <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-sm">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Etiqueta solo si es necesario (puedes cambiarla por "Nuevo") */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                    <span className="text-[10px] uppercase tracking-tighter font-bold text-stone-800">
                      Hecho en Chile
                    </span>
                  </div>
                </div>

                {/* INFORMACIÓN - Centrada y limpia */}
                <div className="pt-6 pb-2 px-2 flex flex-col items-center text-center">
                  <h2 className="font-serif text-2xl mb-2 text-stone-800 group-hover:text-terracotta transition-colors">
                    {product.name}
                  </h2>
                  <p className="text-terracotta font-bold text-xl mb-4">
                    ${product.price.toLocaleString("es-CL")}
                  </p>
                  
                  <div className="w-full overflow-hidden rounded-xl">
                    <div className="bg-stone-900 text-white py-3 text-sm font-semibold uppercase tracking-widest translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                      Ver Detalles
                    </div>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* ESTADO VACÍO */}
        {filteredProducts.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-stone-400 text-xl font-light italic">
              No encontramos piezas que coincidan con tu búsqueda.
            </p>
            <button 
              onClick={() => {setSearch(""); setCategory("all");}}
              className="mt-4 text-terracotta underline"
            >
              Ver toda la colección
            </button>
          </div>
        )}
      </main>
    </>
  );
}