import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext"; // Asumiendo que tienes un context de carrito

export default function CursoDetalle() {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchActiveCourse = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_active", true)
        .single();

      if (!error) setCourse(data);
      setLoading(false);
    };
    fetchActiveCourse();
  }, []);

  if (loading) return <div className="py-20 text-center font-serif">Cargando taller...</div>;
  if (!course) return <div className="py-20 text-center font-serif">No hay cursos programados por ahora.</div>;

  const handleAddToCart = () => {
    if (course.available_slots > 0) {
      addToCart({
        id: course.id,
        name: `Taller: ${course.title}`,
        price: course.price,
        image: course.image_url,
        quantity: 1,
        isCourse: true // Para diferenciarlo en el carrito
      });
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        
        {/* IMAGEN DEL CURSO */}
        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src={course.image_url}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>

        {/* INFO DEL CURSO */}
        <div className="space-y-6">
          <span className="bg-terracotta/10 text-terracotta px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
            Próximo Taller Presencial
          </span>
          
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800">
            {course.title}
          </h1>

          <p className="text-stone-600 leading-relaxed text-lg">
            {course.description}
          </p>

          <div className="grid grid-cols-2 gap-4 py-6 border-y border-stone-100">
            <div>
              <p className="text-[10px] uppercase text-stone-400 font-bold">Fecha y Hora</p>
              <p className="text-stone-800 font-medium">{new Date(course.date).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-stone-400 font-bold">Ubicación</p>
              <p className="text-stone-800 font-medium">{course.location}</p>
            </div>
          </div>

          <div className="flex justify-between items-center bg-stone-50 p-6 rounded-2xl">
            <div>
              <p className="text-3xl font-bold text-terracotta">${course.price.toLocaleString("es-CL")}</p>
              <p className="text-sm text-stone-500">Inscripción individual</p>
            </div>
            <div className="text-right">
              <p className={`text-xl font-bold ${course.available_slots < 5 ? 'text-red-500' : 'text-green-600'}`}>
                {course.available_slots} cupos
              </p>
              <p className="text-xs text-stone-400">Disponibles de {course.total_slots}</p>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={course.available_slots === 0}
            className={`w-full py-4 rounded-full text-white font-bold text-lg transition-all shadow-lg 
              ${course.available_slots > 0 
                ? 'bg-stone-900 hover:bg-terracotta' 
                : 'bg-stone-300 cursor-not-allowed'}`}
          >
            {course.available_slots > 0 ? 'Inscribirme y pagar' : 'Cupos Agotados'}
          </button>
        </div>
      </div>
    </main>
  );
}