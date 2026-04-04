"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Save, RefreshCw, AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";

// Definición del tipo Course con la propiedad image_url para evitar errores de TS
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
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchCourse();
  }, []);

  async function fetchCourse() {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .single();

    if (data) setCourse(data);
    setLoading(false);
  }

  // Manejador para subir la imagen al Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setMessage({ type: "", text: "" });

    // Limpieza de nombre de archivo para evitar errores en la URL
    const cleanFileName = file.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9.-]/g, "");

    const fileName = `cursos/${Date.now()}-${cleanFileName}`;

    // Subida al bucket 'products'
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (uploadError) {
      setMessage({ type: "error", text: "Error al subir imagen: " + uploadError.message });
      setImageUploading(false);
      return;
    }

    // Obtener URL pública
    const { data } = supabase.storage.from("products").getPublicUrl(fileName);

    if (course && data.publicUrl) {
      setCourse({ ...course, image_url: data.publicUrl });
      setMessage({ type: "success", text: "Imagen lista para guardar." });
    }

    setImageUploading(false);
  };

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!course) return;

    setUpdating(true);
    setMessage({ type: "", text: "" });

    // Actualización en la tabla 'courses' incluyendo la nueva image_url
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
        image_url: course.image_url,
      })
      .eq("id", course.id);

    if (error) {
      setMessage({ type: "error", text: "Error al actualizar: " + error.message });
    } else {
      setMessage({ type: "success", text: "¡Taller actualizado exitosamente!" });
    }
    setUpdating(false);
  }

  if (loading) return <div className="p-10 text-center font-serif">Conectando con Supabase...</div>;
  if (!course) return <div className="p-10 text-center font-serif">No se encontró un taller activo.</div>;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-stone-800">Gestionar Taller</h1>
        <button onClick={fetchCourse} className="p-2 text-stone-400 hover:text-stone-800 transition-colors">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-8">
        
        {/* Sección de Imagen */}
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Imagen del Taller</label>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
              {course.image_url ? (
                <img src={course.image_url} alt="Preview" className="object-cover w-full h-full" />
              ) : (
                <ImageIcon className="w-8 h-8 text-stone-300" />
              )}
            </div>
            <div className="md:col-span-2">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload} 
                disabled={imageUploading}
                className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-terracotta/10 file:text-terracotta hover:file:bg-terracotta/20 cursor-pointer disabled:opacity-50"
              />
              <p className="text-[10px] text-stone-400 mt-2 uppercase tracking-tight">Tamaño sugerido: 1200x800px</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Nombre del Taller</label>
            <input 
              type="text"
              value={course.title}
              onChange={(e) => setCourse({...course, title: e.target.value})}
              className="w-full p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-terracotta outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Precio (CLP)</label>
            <input 
              type="number"
              value={course.price}
              onChange={(e) => setCourse({...course, price: Number(e.target.value)})}
              className="w-full p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-terracotta outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Descripción</label>
          <textarea 
            rows={4}
            value={course.description}
            onChange={(e) => setCourse({...course, description: e.target.value})}
            className="w-full p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-terracotta outline-none transition-all resize-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Ubicación</label>
            <input 
              type="text"
              value={course.location}
              onChange={(e) => setCourse({...course, location: e.target.value})}
              className="w-full p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-terracotta outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Fecha y Hora</label>
            <input 
              type="datetime-local"
              value={course.date.slice(0, 16)} 
              onChange={(e) => setCourse({...course, date: e.target.value})}
              className="w-full p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-terracotta outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 p-8 bg-stone-50 rounded-3xl">
          <div className="space-y-2 text-center">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Cupos Totales</label>
            <input 
              type="number"
              value={course.total_slots}
              onChange={(e) => setCourse({...course, total_slots: Number(e.target.value)})}
              className="w-full text-center bg-transparent text-3xl font-bold text-stone-800 outline-none"
            />
          </div>
          <div className="space-y-2 text-center border-l border-stone-200">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Disponibles</label>
            <input 
              type="number"
              value={course.available_slots}
              onChange={(e) => setCourse({...course, available_slots: Number(e.target.value)})}
              className="w-full text-center bg-transparent text-3xl font-bold text-terracotta outline-none"
            />
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-semibold">{message.text}</p>
          </div>
        )}

        <button 
          disabled={updating || imageUploading}
          className="w-full py-5 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 hover:scale-[1.01] active:scale-[0.99] transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
        >
          {updating ? (
            <>Guardando...</>
          ) : imageUploading ? (
            <>Subiendo imagen...</>
          ) : (
            <><Save className="w-5 h-5" /> Actualizar Taller</>
          )}
        </button>
      </form>
    </main>
  );
}