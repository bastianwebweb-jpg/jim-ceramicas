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

  // 🔥 NUEVOS ESTADOS
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

  // 🔥 FILTRO INTELIGENTE
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
      {/* HERO */}
      <section className="bg-stone-900 text-white py-20 text-center">
        <h1 className="text-4xl font-serif mb-4">
          Nuestra colección
        </h1>
        <p className="max-w-2xl mx-auto opacity-80">
          Descubre piezas únicas hechas a mano, pensadas para acompañar tu día a día.
        </p>
      </section>

      {/* CONTENIDO */}
      <main className="px-6 py-20 max-w-7xl mx-auto">

        {/* FILTROS MEJORADOS */}
        <div className="bg-[#f5f0e8] p-6 rounded-2xl shadow-sm mb-12 border border-[#e5ded3]">

          <div className="grid md:grid-cols-4 gap-4 items-center">

            {/* 🔍 BUSCADOR */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar pieza..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border border-[#d6cec2] bg-white focus:outline-none focus:ring-2 focus:ring-terracotta"
              />
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            </div>

            {/* 🏺 CATEGORÍA */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 rounded-lg border border-[#d6cec2] bg-white"
            >
              <option value="all">Todas</option>
              <option value="lozas">Lozas</option>
              <option value="tazas">Tazas</option>
              <option value="decoracion">Decoración</option>
            </select>

            {/* 💰 ORDEN */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="p-3 rounded-lg border border-[#d6cec2] bg-white"
            >
              <option value="default">Ordenar</option>
              <option value="price-asc">Precio ↑</option>
              <option value="price-desc">Precio ↓</option>
            </select>

            {/* ❌ LIMPIAR */}
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
                setSort("default");
              }}
              className="bg-stone-900 text-white py-3 rounded-lg hover:bg-black transition"
            >
              Limpiar
            </button>

          </div>
        </div>

        {/* CONTADOR */}
        <p className="text-gray-600 mb-8">
          Mostrando {filteredProducts.length} productos
        </p>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/tienda/${product.id}`}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group cursor-pointer">

                {/* IMAGEN */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />

                  <span className="absolute top-3 left-3 bg-terracotta text-white text-xs px-3 py-1 rounded-full">
                    Hecho a mano
                  </span>
                </div>

                {/* INFO */}
                <div className="p-5">
                  <h2 className="font-semibold text-lg mb-1">
                    {product.name}
                  </h2>

                  <p className="text-terracotta font-bold text-xl">
                    ${product.price}
                  </p>

                  <button className="mt-4 w-full bg-stone-900 text-white py-2 rounded-full hover:bg-black transition">
                    Ver producto
                  </button>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* SIN RESULTADOS */}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No se encontraron productos 😢
          </p>
        )}

      </main>
    </>
  );
}