"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import ProductCarousel from "../components/ProductsCarousel";

type Product = {
  id: string; 
  name: string;
  price: number;
  image_url: string;
  category: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lozas, setLozas] = useState<Product[]>([]);
  const [tazas, setTazas] = useState<Product[]>([]);
  const [decoracion, setDecoracion] = useState<Product[]>([]);

  const images = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"];
  const [current, setCurrent] = useState(0);

  // 🔥 productos
  useEffect(() => {
    const getProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error("Error cargando productos:", error);
        return;
      }

      const all = data || [];

      setProducts(all.slice(0, 3)); // destacados

      setLozas(all.filter(p => p.category === "lozas").slice(0, 6));
      setTazas(all.filter(p => p.category === "tazas").slice(0, 6));
      setDecoracion(all.filter(p => p.category === "decoracion").slice(0, 6));
    };

    getProducts();
  }, []);

  // 🔥 carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative h-[70vh] w-full overflow-hidden mt-20">
        <Image
          src={images[current]}
          alt="Hero"
          fill
          className="object-cover scale-105 transition-all duration-1000"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col justify-center items-center text-center text-white px-6">

          {/* LOGO */}
          <Image
            src="/logo.png"
            alt="Logo"
            width={110}
            height={110}
            className="mb-6 opacity-90"
          />

          <h1 className="text-5xl md:text-6xl font-serif mb-4 tracking-wide">
            Hecho a mano, con alma
          </h1>

          <div className="w-16 h-[2px] bg-white mb-6 opacity-60"></div>

          <p className="max-w-xl mb-6 text-lg opacity-90 leading-relaxed">
            Cerámica artesanal creada con tiempo, dedicación y fuego.
            Cada pieza es única, como el proceso que la forma.
          </p>

          <Link
            href="/tienda"
            className="bg-terracotta px-8 py-3 rounded-md font-medium tracking-wide hover:opacity-90 transition"
          >
            Ver colección
          </Link>
        </div>
      </section>

      {/* 👇 NUEVA SECCIÓN VA AQUÍ */}
      <section className="py-28 text-center max-w-4xl mx-auto px-6 bg-[#f5f0e8]">
      
      <h2 className="text-3xl md:text-4xl font-serif mb-6 text-[#2C2C2C]">
        Hecho a mano en Chile
      </h2>

      <div className="w-16 h-[2px] bg-terracotta mx-auto mb-6 opacity-60"></div>

      <p className="text-lg leading-relaxed text-[#5A4A3F] max-w-2xl mx-auto">
        Cada pieza nace de un proceso lento y consciente. Moldeada a mano,
        marcada por el fuego y única en su forma, como todo lo que tiene historia.
      </p>

      </section>
  
      {/* DESTACADOS DINÁMICOS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-serif mb-6 text-center">
          Productos Destacados
        </h2>

        <div className="w-16 h-[2px] bg-terracotta mx-auto mb-10 opacity-60"></div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/tienda/${product.id}`}>
              <div className="group bg-white border border-[#e5ded3] rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer">
                
                <div className="relative h-64">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                      Sin imagen
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-white/80 text-xs px-2 py-1 rounded">
                    Hecho a mano
                  </span>  
                </div>

                <div className="p-5">
                  <h3 className="font-medium text-lg mb-1 text-[#2C2C2C]">
                    {product.name}
                  </h3>

                  <p className="text-lg font-semibold text-[#C46A3C]">
                    ${product.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
            {/* 🏺 CATEGORÍAS DESTACADAS */}
      {/* 🏺 CATEGORÍAS EDITORIALES */}

      {/* LOZAS */}
      <section className="bg-[#3B2F2F] text-white py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          {/* 🖼 Imagen */}
          <div className="relative h-80 rounded-xl overflow-hidden">
            <Image
              src="/lozas.jpg"
              alt="Lozas"
              fill
              className="object-cover"
            />
          </div>

          {/* 📝 Texto */}
          <div>
            <h2 className="text-3xl font-serif mb-4">
              Lozas hechas para compartir
            </h2>

            <p className="text-[#F5EFE6] mb-6 leading-relaxed">
              Platos, bowls y piezas creadas para acompañar momentos reales.
              Cada forma nace del trabajo manual y la imperfección que hace única a cada pieza.
            </p>

            <Link
              href="/tienda?categoria=lozas"
              className="inline-block bg-terracotta px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
            >
              Ver lozas
            </Link>
            {/* 🔥 AQUÍ */}
            <div className="mt-8">
              <ProductCarousel products={lozas} />
            </div>
          </div>

        </div>
      </section>


      {/* TAZAS */}
      <section className="bg-[#f5f0e8] py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          {/* 📝 Texto */}
          <div>
            <h2 className="text-3xl font-serif mb-4 text-[#2C2C2C]">
              Tazas para tus rituales
            </h2>

            <p className="text-[#5A4A3F] mb-6 leading-relaxed">
              Café, té o momentos de pausa. Cada taza está pensada para acompañarte
              en lo cotidiano, transformando lo simple en algo especial.
            </p>

            <Link
              href="/tienda?categoria=tazas"
              className="inline-block bg-terracotta text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
            >
              Ver tazas
            </Link>
            <div className="mt-8">
              <ProductCarousel products={tazas} />
            </div>
          </div>

          {/* 🖼 Imagen */}
          <div className="relative h-80 rounded-xl overflow-hidden">
            <Image
              src="/tazas.jpg"
              alt="Tazas"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>


      {/* DECORACIÓN */}
      <section className="bg-[#3B2F2F] text-white py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          {/* 🖼 Imagen */}
          <div className="relative h-80 rounded-xl overflow-hidden">
            <Image
              src="/decoracion.jpg"
              alt="Decoración"
              fill
              className="object-cover"
            />
          </div>

          {/* 📝 Texto */}
          <div>
            <h2 className="text-3xl font-serif mb-4">
              Detalles que dan vida
            </h2>

            <p className="text-[#F5EFE6] mb-6 leading-relaxed">
              Objetos únicos que transforman espacios. Cada pieza aporta carácter,
              textura y una conexión con lo artesanal.
            </p>

            <Link
              href="/tienda?categoria=decoracion"
              className="inline-block bg-terracotta px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
            >
              Ver decoración
            </Link>

            {/* 🔥 CARRUSEL */}
            <div className="mt-8">
              <ProductCarousel products={decoracion} />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}