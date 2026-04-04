"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // 🔥 mejor en cliente
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

  const [editing, setEditing] = useState(false);

  // 🔄 cargar productos
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
  };

  // 📊 stats
  const fetchStats = async () => {
    const { data: products } = await supabase.from("products").select("*");
    const { data: orders } = await supabase.from("orders").select("*");

    setStats({
      totalProducts: products?.length || 0,
      lowStock: products?.filter((p) => p.stock <= 3).length || 0,
      totalOrders: orders?.length || 0,
      totalRevenue:
        orders?.reduce((acc, o) => acc + (o.total || 0), 0) || 0,
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  // ✏️ cambios
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🖼 subir imagen
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

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      alert("Error subiendo imagen");
      setLoading(false);
      return;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    setForm((prev) => ({
      ...prev,
      image_url: data.publicUrl,
    }));

    setLoading(false);
  };

  // ➕ crear / editar
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

    let error;

    if (editing) {
      const res = await supabase
        .from("products")
        .update(productData)
        .eq("id", form.id);

      error = res.error;
    } else {
      const res = await supabase
        .from("products")
        .insert([productData]);

      error = res.error;
    }

    if (error) {
      console.error(error);
      alert("Error guardando producto");
      setLoading(false);
      return;
    }

    // reset
    setForm({
      id: "",
      name: "",
      category: "",
      price: "",
      description: "",
      image_url: "",
      stock: "",
    });

    setEditing(false);

    await fetchProducts();
    await fetchStats();

    setLoading(false);
  };

  // 🗑 eliminar
  const deleteProduct = async (id: string) => {
    if (!confirm("¿Eliminar producto?")) return;

    await supabase.from("products").delete().eq("id", id);

    fetchProducts();
    fetchStats();
  };

  // ✏️ editar
  const editProduct = (product: Product) => {
    setForm({
      ...product,
      price: String(product.price),
      stock: String(product.stock),
    });
    setEditing(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] p-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-serif text-carbon mb-2">
          Panel de Administración
        </h1>
        <p className="text-[#5A4A3F]">
          Gestiona tus piezas artesanales
        </p>
      </div>
      {/* DASHBOARD 2 */}
      <div className="max-w-6xl mx-auto mb-10 grid md:grid-cols-4 gap-6">

        {/* 📦 PRODUCTOS */}
        <div className="bg-white p-6 rounded-2xl shadow border border-[#e5ded3]">
          <p className="text-sm text-gray-500">Productos</p>
          <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
        </div>

        {/* ⚠️ STOCK */}
        <div className="bg-white p-6 rounded-2xl shadow border border-[#e5ded3]">
          <p className="text-sm text-gray-500">Stock bajo</p>
          <h3 className="text-2xl font-bold text-orange-500">
            {stats.lowStock}
          </h3>
        </div>

        {/* 🛒 ÓRDENES */}
        <div className="bg-white p-6 rounded-2xl shadow border border-[#e5ded3]">
          <p className="text-sm text-gray-500">Órdenes</p>
          <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
        </div>

        {/* 💰 INGRESOS */}
        <div className="bg-white p-6 rounded-2xl shadow border border-[#e5ded3]">
          <p className="text-sm text-gray-500">Ingresos</p>
          <h3 className="text-2xl font-bold text-terracotta">
            ${stats.totalRevenue}
          </h3>
        </div>

      </div>

      {/* 🚀 ACCESO RÁPIDO A PEDIDOS */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="bg-linear-to-r from-black to-carbon text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">

          <div>
            <p className="text-sm opacity-70">Gestión</p>
            <h3 className="text-xl font-semibold">
              Administrar pedidos
            </h3>
          </div>

          <Link
            href="/admin/orders"
            className="flex-1 bg-white text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition border border-stone-200 flex items-center justify-center text-center"
          >
            Ver pedidos
          </Link>

          <Link 
            href="/admin/cursos" 
            className="flex-1 bg-stone-100 text-stone-800 px-6 py-3 rounded-xl font-bold hover:bg-stone-200 transition-all flex items-center justify-center text-center"
          >
            Gestionar Talleres
          </Link>

        </div>
      </div>
{/* 🔥 AGREGA ESTO AQUÍ (DEBAJO DE LA LÍNEA 240) */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">Talleres</p>
            <h3 className="text-xl font-semibold text-stone-800">
              Gestionar Cursos
            </h3>
          </div>
          <Link
            href="/admin/cursos"
            className="bg-terracotta text-white px-6 py-2 rounded-lg font-medium hover:scale-105 transition"
          >
            Editar cursos
          </Link>
        </div>
      </div>

      {/* FORM */}
      <div className="max-w-6xl mx-auto mb-12 bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-serif mb-6">
          {editing ? "Editar producto" : "Nuevo producto"}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

          <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="p-3 border rounded-lg" />

          <input name="category" placeholder="Categoría" value={form.category} onChange={handleChange} className="p-3 border rounded-lg" />

          <input name="price" type="number" placeholder="Precio" value={form.price} onChange={handleChange} className="p-3 border rounded-lg" />

          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="p-3 border rounded-lg" />

          <input name="image_url" placeholder="URL imagen" value={form.image_url} onChange={handleChange} className="p-3 border rounded-lg col-span-2" />

          <input type="file" onChange={handleImageUpload} className="col-span-2" />

          {form.image_url && (
            <img src={form.image_url} className="col-span-2 h-40 object-cover rounded-lg" />
          )}

          <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} className="p-3 border rounded-lg col-span-2" />

          <button disabled={loading} className="col-span-2 bg-terracotta text-white py-3 rounded-lg">
            {loading ? "Guardando..." : editing ? "Actualizar producto" : "Crear producto"}
          </button>

        </form>
      </div>

      {/* PRODUCTOS */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow p-4">

            <img src={p.image_url} className="h-40 w-full object-cover rounded-lg mb-4" />

            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-terracotta font-bold">${p.price}</p>
            <p className="text-sm">Stock: {p.stock}</p>

            <div className="flex gap-2 mt-4">
              <button onClick={() => editProduct(p)} className="flex-1 bg-blue-500 text-white py-2 rounded">
                Editar
              </button>

              <button onClick={() => deleteProduct(p.id)} className="flex-1 bg-red-500 text-white py-2 rounded">
                Eliminar
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}