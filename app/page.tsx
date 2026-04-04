"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import ProductCarousel from "../components/ProductsCarousel";
import { useCart } from "../context/CartContext";
import { Calendar, MapPin, Users } from "lucide-react";

type Product = {
  id: string; 
  name: string;
  price: number;
  image_url: string;
  category: string;
};

// Tipo para el curso de la DB
type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  location: string;
  date: string;
  available_slots: number;
};

export default function Home() {
  const { addToCart } = useCart(); // 🔥 Hook para reservar
  const [products, setProducts] = useState<Product[]>([]);
  const [lozas, setLozas] = useState<Product[]>([]);
  const [tazas, setTazas] = useState<Product[]>([]);
  const [decoracion, setDecoracion] = useState<Product[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const images = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const getData = async () => {
      // 1. Cargar Productos
      const { data: prodData } = await supabase.from("products").select("*");
      if (prodData) {
        setProducts(prodData.slice(0, 3)); 
        setLozas(prodData.filter(p => p.category === "lozas").slice(0, 6));
        setTazas(prodData.filter(p => p.category === "tazas").slice(0, 6));
        setDecoracion(prodData.filter(p => p.category === "decoracion").slice(0, 6));
      }

      // 2. Cargar Curso Activo
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .single();
      
      if (courseData) setActiveCourse(courseData);
    };

    getData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Función para manejar la reserva del taller
  const handleReserve = () => {
    if (activeCourse && activeCourse.available_slots > 0) {
      addToCart({
        id: activeCourse.id,
        name: `Taller: ${activeCourse.title}`,
        price: activeCourse.price,
        image_url: activeCourse.image_url,
        isCourse: true // Importante para el carrito
      });
    }
  };

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
          <h1 className="text-4xl md:text-7xl font-serif mb-4 tracking-tight drop-shadow-md">Hecho a mano, con alma</h1>
          <div className="w-20 h-0.5g-terracotta mb-6"></div>
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
      <section className="py-24 md:py-32 text-center max-w-5xl mx-auto px-6 bg-[#fdfbf8]">
        <h2 className="text-3xl md:text-5xl font-serif mb-8 text-carbon">Artesanía desde el corazón de Chile</h2>
        <div className="w-12 h-px bg-terracotta mx-auto mb-8"></div>
        <p className="text-lg md:text-xl leading-relaxed text-[#5A4A3F] max-w-3xl mx-auto italic">
          "Cada pieza nace de un proceso lento y consciente. Moldeada a mano,
          marcada por el fuego y única en su forma, como todo lo que tiene historia."
        </p>
      </section>

      {/* 🔥 SECCIÓN TALLER (DINÁMICA) */}
      {activeCourse && (
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="bg-white rounded-[40px] p-8 md:p-16 border border-stone-100 shadow-sm grid md:grid-cols-2 gap-12 items-center relative overflow-hidden">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">Experiencia Presencial</span>
              <h2 className="text-4xl md:text-6xl font-serif text-stone-800 leading-tight">
                {activeCourse.title}
              </h2>
              <p className="text-stone-500 text-lg leading-relaxed">
                {activeCourse.description}
              </p>
              
              <div className="flex flex-wrap gap-6 py-4">
                <div className="flex items-center gap-2 text-stone-600">
                  <Calendar className="w-5 h-5 text-terracotta" />
                  <span className="text-sm font-medium">Sábado 24 de Mayo</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <MapPin className="w-5 h-5 text-terracotta" />
                  <span className="text-sm font-medium">{activeCourse.location}</span>
                </div>
                <div className="flex items-center gap-2 text-terracotta">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-bold">Solo {activeCourse.available_slots} cupos disponibles</span>
                </div>
              </div>

              <Link 
                href="/cursos" 
                className={`px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl shadow-terracotta/20 inline-block text-center ${
                  activeCourse.available_slots > 0 
                  ? "bg-terracotta text-white hover:scale-105" 
                  : "bg-stone-200 text-stone-500 cursor-not-allowed pointer-events-none"
                }`}
              >
                {activeCourse.available_slots > 0 ? "Reservar mi lugar" : "Cupos Agotados"}
              </Link>
            </div>

            <div className="relative aspect-square md:aspect-auto md:h-125 rounded-[30px] overflow-hidden group">
              <Image 
                src={activeCourse.image_url} 
                alt="Taller de cerámica" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-linear-to-trom-black/20 to-transparent"></div>
            </div>
          </div>
        </section>
      )}

      {/* RESTO DE SECCIONES (Destacados, Lozas, Tazas, Decoración) */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center text-carbon">Productos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {products.map((product) => (
            <Link key={product.id} href={`/tienda/${product.id}`}>
              <div className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-4/5 overflow-hidden">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-110 transition duration-700" />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-stone-100 text-stone-400">Sin imagen</div>
                  )}
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full text-stone-800 shadow-sm">Pieza Única</span>  
                </div>
                <div className="p-6 flex flex-col justify-between grow">
                  <h3 className="font-serif text-xl mb-2 text-carbon group-hover:text-terracotta transition-colors">{product.name}</h3>
                  <p className="text-xl font-bold text-terracotta">${product.price.toLocaleString('es-CL')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LOZAS */}
      <section className="bg-[#2D2424] text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative h-100 md:h-125 rounded-2xl overflow-hidden shadow-2xl">
            <Image src="/lozas.jpg" alt="Lozas artesanales" fill className="object-cover" />
          </div>
          <div className="lg:col-span-7 lg:pl-10">
            <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">Lozas hechas para compartir</h2>
            <p className="text-stone-300 text-lg mb-8 max-w-xl leading-relaxed">
              Platos y bowls creados para acompañar momentos reales. La imperfección del trabajo manual es lo que hace que cada mesa sea especial.
            </p>
            <Link href="/tienda?categoria=lozas" className="inline-block border-b-2 border-terracotta pb-1 font-medium hover:text-terracotta transition-all uppercase tracking-widest text-sm">Ver colección de lozas</Link>
            <div className="mt-12"><ProductCarousel products={lozas} /></div>
          </div>
        </div>
      </section>

      {/* TAZAS */}
      <section className="bg-[#fcfaf7] py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 lg:pr-10 order-2 lg:order-1">
            <h2 className="text-3xl md:text-5xl font-serif mb-6 text-carbon">
              Tazas para tus rituales
            </h2>
            <p className="text-[#5A4A3F] text-lg mb-8 max-w-xl leading-relaxed">
              El café de la mañana o el té del atardecer. Cada taza está diseñada para 
              ajustarse a tus manos y transformar lo simple en algo extraordinario.
            </p>
            <Link
              href="/tienda?categoria=tazas"
              className="inline-block border-b-2 border-terracotta pb-1 font-medium text-stone-800 hover:text-terracotta transition-all uppercase tracking-widest text-sm"
            >
              Explorar tazas
            </Link>
            <div className="mt-12">
              <ProductCarousel products={tazas} />
            </div>
          </div>
          <div className="lg:col-span-5 relative h-100 md:h-125 rounded-2xl overflow-hidden shadow-xl order-1 lg:order-2">
            <Image src="/tazas.jpg" alt="Tazas cerámicas" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* DECORACIÓN */}
      <section className="bg-[#3B2F2F] text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative h-100 md:h-125 rounded-2xl overflow-hidden shadow-2xl">
            <Image src="/decoracion.jpg" alt="Decoración artesanal" fill className="object-cover" />
          </div>
          <div className="lg:col-span-7 lg:pl-10">
            <h2 className="text-3xl md:text-5xl font-serif mb-6">
              Detalles que dan vida
            </h2>
            <p className="text-stone-300 text-lg mb-8 max-w-xl">
              Objetos únicos que transforman espacios. Cada pieza aporta carácter, 
              textura y una conexión profunda con la tierra.
            </p>
            <Link
              href="/tienda?categoria=decoracion"
              className="inline-block border-b-2 border-terracotta pb-1 font-medium hover:text-terracotta transition-all uppercase tracking-widest text-sm"
            >
              Ver objetos de decoración
            </Link>
            <div className="mt-12">
              <ProductCarousel products={decoracion} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}