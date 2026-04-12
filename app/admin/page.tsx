"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  stock: number;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    description: "",
    image_url: "",
    stock: "",
  });

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  // 🔄 Cargar productos
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error(error);
      return;
    }
    setProducts(data || []);
  };

  // 📊 Estadísticas
  const fetchStats = async () => {
    const { data: productsData } = await supabase.from("products").select("*");
    const { data: ordersData } = await supabase.from("orders").select("total");

    setStats({
      totalProducts: productsData?.length || 0,
      lowStock: productsData?.filter((p) => p.stock <= 3).length || 0,
      totalOrders: ordersData?.length || 0,
      totalRevenue: ordersData?.reduce((acc, o) => acc + (o.total || 0), 0) || 0,
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  // ✏️ Manejar cambios en el formulario
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🖼 Subir imagen a Storage
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const cleanFileName = file.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9.-]/g, "");

    const fileName = `products/${Date.now()}-${cleanFileName}`;

    const { error } = await supabase.storage.from("products").upload(fileName, file);

    if (error) {
      console.error(error);
      alert("Error subiendo imagen");
      setLoading(false);
      return;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    setLoading(false);
  };

  // ➕ Crear o Editar Producto
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert("Faltan campos obligatorios");
      return;
    }

    setLoading(true);
    const productData = {
      name: form.name,
      category: form.category,
      description: form.description,
      image_url: form.image_url,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    const { error } = editing 
      ? await supabase.from("products").update(productData).eq("id", form.id)
      : await supabase.from("products").insert([productData]);

    if (error) {
      console.error(error);
      alert("Error guardando producto");
    } else {
      setForm({ id: "", name: "", category: "", price: "", description: "", image_url: "", stock: "" });
      setEditing(false);
      await fetchProducts();
      await fetchStats();
    }
    setLoading(false);
  };

  // 🗑 Eliminar Producto
  const deleteProduct = async (id: string) => {
    if (!confirm("¿Eliminar producto?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
    fetchStats();
  };

  // ✏️ Cargar datos para editar
  const editProduct = (product: Product) => {
    setForm({
      ...product,
      price: String(product.price),
      stock: String(product.stock),
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] p-10">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10 text-center md:text-left">
        <h1 className="text-4xl font-serif text-stone-800 mb-2">Panel de Administración</h1>
        <p className="text-stone-600">Gestiona tus piezas artesanales y logística</p>
      </div>

      {/* 📊 DASHBOARD STATS */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <p className="text-xs font-bold uppercase text-stone-400 tracking-wider">Productos</p>
            <h3 className="text-3xl font-serif text-stone-800">{stats.totalProducts}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <p className="text-xs font-bold uppercase text-stone-400 tracking-wider">Stock Bajo</p>
            <h3 className="text-3xl font-serif text-orange-500">{stats.lowStock}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <p className="text-xs font-bold uppercase text-stone-400 tracking-wider">Órdenes</p>
            <h3 className="text-3xl font-serif text-stone-800">{stats.totalOrders}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <p className="text-xs font-bold uppercase text-stone-400 tracking-wider">Ingresos</p>
            <h3 className="text-3xl font-serif text-terracotta">${stats.totalRevenue.toLocaleString("es-CL")}</h3>
          </div>
        </div>

        {/* 🚀 ACCESOS DIRECTOS */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link href="/admin/orders" className="bg-stone-900 text-white p-8 rounded-3xl shadow-lg flex justify-between items-center group transition-transform hover:scale-[1.01]">
            <div>
              <p className="text-xs font-bold uppercase opacity-50 tracking-widest mb-1">Logística</p>
              <h3 className="text-2xl font-serif">Gestionar Pedidos</h3>
            </div>
            <span className="text-5xl group-hover:translate-x-2 transition-transform">📦</span>
          </Link>

          <Link href="/admin/cursos" className="bg-white border border-stone-200 p-8 rounded-3xl shadow-sm flex justify-between items-center group transition-transform hover:scale-[1.01]">
            <div>
              <p className="text-xs font-bold uppercase text-stone-400 tracking-widest mb-1">Formación</p>
              <h3 className="text-2xl font-serif text-stone-800">Administrar Talleres</h3>
            </div>
            <span className="text-5xl group-hover:translate-x-2 transition-transform">🏺</span>
          </Link>
        </div>
      </div>

      {/* 📝 FORMULARIO DE PRODUCTOS */}
      <div className="max-w-6xl mx-auto mb-16 bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
        <h2 className="text-2xl font-serif mb-8 text-stone-800">
          {editing ? "Editar Producto" : "Agregar Nueva Pieza"}
        </h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-stone-400 ml-1">Nombre de la pieza</label>
            <input name="name" placeholder="Ej: Jarro de gres" value={form.name} onChange={handleChange} className="p-4 bg-stone-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-terracotta/20" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-stone-400 ml-1">Categoría</label>
            <input name="category" placeholder="Ej: Cocina, Decoración" value={form.category} onChange={handleChange} className="p-4 bg-stone-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-terracotta/20" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-stone-400 ml-1">Precio ($)</label>
            <input name="price" type="number" placeholder="29990" value={form.price} onChange={handleChange} className="p-4 bg-stone-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-terracotta/20" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-stone-400 ml-1">Stock Disponible</label>
            <input name="stock" type="number" placeholder="10" value={form.stock} onChange={handleChange} className="p-4 bg-stone-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-terracotta/20" />
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-stone-400 ml-1">Descripción</label>
            <textarea name="description" placeholder="Detalles de la pieza..." value={form.description} onChange={handleChange} className="p-4 bg-stone-50 border-none rounded-2xl h-32 outline-none focus:ring-2 focus:ring-terracotta/20" />
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-stone-400 ml-1">Imagen del Producto</label>
            <input type="file" onChange={handleImageUpload} className="p-4 border-2 border-dashed border-stone-200 rounded-2xl text-stone-500 cursor-pointer hover:bg-stone-50 transition-colors" />
            {form.image_url && (
              <div className="relative w-full h-48 mt-2 overflow-hidden rounded-2xl border border-stone-100">
                <img src={form.image_url} alt="Vista previa" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <button disabled={loading} className="col-span-2 bg-terracotta text-white py-5 rounded-2xl font-bold text-lg shadow-md hover:bg-opacity-90 transition-all active:scale-[0.98]">
            {loading ? "Procesando..." : editing ? "Actualizar Información" : "Publicar Producto"}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(false); setForm({ id: "", name: "", category: "", price: "", description: "", image_url: "", stock: "" }); }} className="col-span-2 text-stone-400 hover:text-stone-600 font-medium">
              Cancelar Edición
            </button>
          )}
        </form>
      </div>

      {/* 🏺 INVENTARIO DE PRODUCTOS */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-serif mb-8 text-stone-800 italic">Inventario Actual</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-64 w-full overflow-hidden">
                <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-800">
                  {p.stock} unid.
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl text-stone-800">{p.name}</h3>
                  <p className="text-terracotta font-bold text-lg">${p.price.toLocaleString("es-CL")}</p>
                </div>
                <p className="text-stone-500 text-sm line-clamp-2 mb-6">{p.description}</p>
                <div className="flex gap-3">
                  <button onClick={() => editProduct(p)} className="flex-1 bg-stone-100 text-stone-700 py-3 rounded-xl font-bold hover:bg-stone-200 transition-colors">
                    Editar
                  </button>
                  <button onClick={() => deleteProduct(p.id)} className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}