"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import ProductCarousel from "../components/ProductsCarousel";
// Importamos algunos iconos para darle un toque profesional
import { Calendar, Users, MapPin } from "lucide-react";

type Product = {
  id: string; 
  name: string;
  price: number;
  image_url: string;
  category: string;
};

// --- NUEVO COMPONENTE DE ANUNCIO ---
function CourseAnnouncement() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-24">
      <div className="bg-[#FDFCFB] border border-terracotta/20 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
        {/* Imagen del Taller */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border-2 border-terracotta/10 animate-pulse" />
          <Image
            src="/taller-info.jpg" // Asegúrate de que esta imagen exista en /public
            alt="Taller de cerámica"
            fill
            className="rounded-full object-cover p-2"
          />
        </div>

        {/* Texto del Anuncio */}
        <div className="flex-1 text-center md:text-left">
          <span className="text-terracotta uppercase tracking-[0.2em] text-xs font-bold mb-3 block">
            Experiencia Presencial
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] mb-4">
            Taller de Iniciación: Modelado Manual
          </h2>
          <p className="text-[#5A4A3F] text-lg mb-6 max-w-xl">
            Ven a ensuciarte las manos y conectar con la tierra. En este taller aprenderás las técnicas básicas para crear tu propia pieza desde cero. No necesitas experiencia previa.
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-5 mb-8 text-sm text-[#5A4A3F]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-terracotta" />
              <span>Sábado 24 de Mayo</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta" />
              <span>Yumbel, Región del Biobío</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-terracotta">
              <Users className="w-4 h-4" />
              <span>Solo 4 cupos disponibles</span>
            </div>
          </div>

          <Link
            href="/talleres"
            className="inline-block bg-terracotta text-white px-8 py-4 rounded-full font-semibold hover:bg-black transition-all shadow-md"
          >
            Reservar mi lugar
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lozas, setLozas] = useState<Product[]>([]);
  const [tazas, setTazas] = useState<Product[]>([]);
  const [decoracion, setDecoracion] = useState<Product[]>([]);

  const images = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error cargando productos:", error);
        return;
      }
      const all = data || [];
      setProducts(all.slice(0, 3)); 
      setLozas(all.filter(p => p.category === "lozas").slice(0, 6));
      setTazas(all.filter(p => p.category === "tazas").slice(0, 6));
      setDecoracion(all.filter(p => p.category === "decoracion").slice(0, 6));
    };
    getProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden mt-16 md:mt-20">
        <Image
          src={images[current]}
          alt="Hero Jim Cerámicas"
          fill
          priority
          className="object-cover transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white px-6">
          <Image src="/logo.png" alt="Logo" width={120} height={120} className="mb-8 drop-shadow-lg" />
          <h1 className="text-4xl md:text-7xl font-serif mb-4 tracking-tight drop-shadow-md">
            Hecho a mano, con alma
          </h1>
          <div className="w-20 h-[2px] bg-terracotta mb-6"></div>
          <p className="max-w-xl mb-8 text-lg md:text-xl font-light opacity-95 leading-relaxed drop-shadow-sm">
            Cerámica artesanal creada con tiempo, dedicación y fuego. <br />
            Cada pieza es única, como el proceso que la forma.
          </p>
          <Link href="/tienda" className="bg-terracotta px-10 py-4 rounded-full font-semibold tracking-wide hover:scale-105 transition-transform shadow-lg">
            Explorar Colección
          </Link>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24 md:py-32 text-center max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-serif mb-8 text-[#2C2C2C]">
          Artesanía desde el corazón de Chile
        </h2>
        <div className="w-12 h-[1px] bg-terracotta mx-auto mb-8"></div>
        <p className="text-lg md:text-xl leading-relaxed text-[#5A4A3F] max-w-3xl mx-auto italic">
          "Cada pieza nace de un proceso lento y consciente. Moldeada a mano,
          marcada por el fuego y única en su forma, como todo lo que tiene historia."
        </p>
      </section>

      {/* --- INSERCIÓN DEL ANUNCIO DEL CURSO --- */}
      <CourseAnnouncement />
  
      {/* DESTACADOS */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center text-[#2C2C2C]">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {products.map((product) => (
            <Link key={product.id} href={`/tienda/${product.id}`}>
              <div className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-110 transition duration-700" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-stone-100 text-stone-400">Sin imagen</div>
                  )}
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full text-stone-800 shadow-sm">
                    Pieza Única
                  </span>  
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <h3 className="font-serif text-xl mb-2 text-[#2C2C2C] group-hover:text-terracotta transition-colors">{product.name}</h3>
                  <p className="text-xl font-bold text-terracotta">${product.price.toLocaleString('es-CL')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECCIONES EDITORIALES (LOZAS, TAZAS, DECORACIÓN)... resto del código igual */}
      {/* ... */}
    </>
  );
}