"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Save, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  date: string;
  total_slots: number;
  available_slots: number;
  image_url: string;
}

export default function AdminCursos() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setImageUploading(true);
  setMessage({ type: "", text: "" });

  // Limpiar el nombre del archivo (quitar espacios, tildes, etc.)
  const cleanFileName = file.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");

  // Crear una ruta única en la carpeta 'cursos'
  const fileName = `cursos/${Date.now()}-${cleanFileName}`;

  // Subir la imagen al storage de Supabase (bucket 'products')
  const { error } = await supabase.storage
    .from("products") // Usamos el mismo bucket 'products'
    .upload(fileName, file);

  if (error) {
    console.error(error);
    setMessage({ type: "error", text: "Error subiendo la imagen" });
    setImageUploading(false);
    return;
  }

  // Obtener la URL pública para guardarla en la tabla
  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  // Actualizar el estado del curso con la nueva URL
  if (course && data.publicUrl) {
    setCourse({ ...course, image_url: data.publicUrl });
  }

  setImageUploading(false);
};

  useEffect(() => {
    fetchCourse();
  }, []);

  async function fetchCourse() {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_active", true) // Traemos el curso que está visible actualmente
      .single();

    if (data) setCourse(data);
    setLoading(false);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!course) return;

    setUpdating(true);
    setMessage({ type: "", text: "" });

    const { error } = await supabase
      .from("courses")
      .update({
        title: course.title,
        description: course.description,
        price: course.price,
        location: course.location,
        date: course.date,
        total_slots: course.total_slots,
        available_slots: course.available_slots,
      })
      .eq("id", course.id);

    if (error) {
      setMessage({ type: "error", text: "Error al actualizar: " + error.message });
    } else {
      setMessage({ type: "success", text: "¡Curso actualizado correctamente!" });
    }
    setUpdating(false);
  }

  if (loading) return <div className="p-10 text-center">Cargando datos de Supabase...</div>;
  if (!course) return <div className="p-10 text-center">No se encontró un curso activo.</div>;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-stone-800">Gestionar Taller</h1>
        <button onClick={fetchCourse} className="p-2 text-stone-400 hover:text-stone-800">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Título */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Nombre del Taller</label>
            <input 
              type="text"
              value={course.title}
              onChange={(e) => setCourse({...course, title: e.target.value})}
              className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-terracotta outline-none"
            />
          </div>

          {/* Precio */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Precio (CLP)</label>
            <input 
              type="number"
              value={course.price}
              onChange={(e) => setCourse({...course, price: Number(e.target.value)})}
              className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-terracotta outline-none"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Descripción</label>
          <textarea 
            rows={3}
            value={course.description}
            onChange={(e) => setCourse({...course, description: e.target.value})}
            className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-terracotta outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ubicación */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Ubicación</label>
            <input 
              type="text"
              value={course.location}
              onChange={(e) => setCourse({...course, location: e.target.value})}
              className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-terracotta outline-none"
            />
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Fecha y Hora</label>
            <input 
              type="datetime-local"
              // Formateo simple para el input datetime-local
              value={course.date.slice(0, 16)} 
              onChange={(e) => setCourse({...course, date: e.target.value})}
              className="w-full p-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-terracotta outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 p-6 bg-stone-50 rounded-2xl">
          <div className="space-y-2 text-center">
            <label className="text-[10px] font-black uppercase tracking-tighter text-stone-400">Cupos Totales</label>
            <input 
              type="number"
              value={course.total_slots}
              onChange={(e) => setCourse({...course, total_slots: Number(e.target.value)})}
              className="w-full text-center bg-transparent text-2xl font-bold text-stone-800 outline-none"
            />
          </div>
          <div className="space-y-2 text-center border-l border-stone-200">
            <label className="text-[10px] font-black uppercase tracking-tighter text-stone-400">Disponibles</label>
            <input 
              type="number"
              value={course.available_slots}
              onChange={(e) => setCourse({...course, available_slots: Number(e.target.value)})}
              className="w-full text-center bg-transparent text-2xl font-bold text-terracotta outline-none"
            />
          </div>
        </div>

        {/* Mensajes de Feedback */}
        {message.text && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <button 
          disabled={updating}
          className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {updating ? "Guardando cambios..." : <><Save className="w-5 h-5" /> Guardar Información</>}
        </button>
      </form>
    </main>
  );
}