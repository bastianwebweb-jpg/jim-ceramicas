"use client"; // CRÍTICO: Debe ser la primera línea

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

// Definimos una interfaz para evitar el error de "any" y propiedades faltantes
interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  date: string;
  location: string;
  available_slots: number;
  total_slots: number;
  is_active: boolean;
}

export default function CursoDetalle() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchActiveCourse = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .single();

      if (!error && data) {
        setCourse(data as Course);
      }
      setLoading(false);
    };
    fetchActiveCourse();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-32 text-center font-serif text-stone-500">
        No hay talleres programados por el momento. ¡Vuelve pronto!
      </div>
    );
  }

  const handleAddToCart = () => {
    if (course.available_slots > 0) {
      addToCart({
        id: course.id,
        name: `Taller: ${course.title}`,
        price: course.price,
        image_url: course.image_url, 
        isCourse: true,               // ✅ Coma agregada aquí
        available_slots: course.available_slots, // ✅ Usamos 'course' y la propiedad correcta
      });
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        
        {/* COLUMNA IZQUIERDA: IMAGEN */}
        <div className="sticky top-32">
          <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-stone-100">
            <Image
              src={course.image_url}
              alt={course.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: INFO */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="inline-block bg-terracotta/10 text-terracotta px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em]">
              Experiencia Presencial
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-stone-800 leading-tight">
              {course.title}
            </h1>
            <p className="text-stone-600 leading-relaxed text-lg font-light">
              {course.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-8 border-y border-stone-100">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-terracotta mt-1" />
              <div>
                <p className="text-[10px] uppercase text-stone-400 font-bold tracking-widest">Fecha</p>
                <p className="text-stone-800 font-medium capitalize">
                  {new Date(course.date).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-terracotta mt-1" />
              <div>
                <p className="text-[10px] uppercase text-stone-400 font-bold tracking-widest">Ubicación</p>
                <p className="text-stone-800 font-medium">{course.location}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#fdfbf8] p-8 rounded-3xl border border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-4xl font-bold text-stone-900">${course.price.toLocaleString("es-CL")}</p>
              <p className="text-sm text-stone-500">Materiales y horneado incluidos</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="flex items-center gap-2 justify-center sm:justify-end mb-1">
                <Users className={`w-4 h-4 ${course.available_slots < 3 ? 'text-red-500' : 'text-stone-400'}`} />
                <p className={`text-xl font-bold ${course.available_slots < 3 ? 'text-red-500' : 'text-stone-800'}`}>
                  {course.available_slots} cupos
                </p>
              </div>
              <p className="text-xs text-stone-400 uppercase tracking-tighter">Disponibles de {course.total_slots}</p>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={course.available_slots === 0}
            className={`w-full py-5 rounded-2xl text-white font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl 
              ${course.available_slots > 0 
                ? 'bg-stone-900 hover:bg-terracotta' 
                : 'bg-stone-300 cursor-not-allowed'}`}
          >
            {course.available_slots > 0 ? 'Reservar mi lugar' : 'Agotado'}
          </button>
          
          <p className="text-center text-xs text-stone-400">
            * Se requiere el pago del 100% para asegurar el cupo.
          </p>
        </div>
      </div>
    </main>
  );
}