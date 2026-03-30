"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "../../lib/supabaseserver";

const supabase = getSupabase();

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
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  // 📦 metricas

  const fetchStats = async () => {
  // 📦 productos
  const { data: products } = await supabase
    .from("products")
    .select("*");

  // 🛒 órdenes
  const { data: orders } = await supabase
    .from("orders")
    .select("*");

  const totalProducts = products?.length || 0;

  const lowStock =
    products?.filter((p) => p.stock <= 3).length || 0;

  const totalOrders = orders?.length || 0;

  const totalRevenue =
    orders?.reduce((acc, o) => acc + (o.total || 0), 0) || 0;

  setStats({
    totalProducts,
    lowStock,
    totalOrders,
    totalRevenue,
  });
  };

  // ✏️ manejar cambios
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🖼 subir imagen
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const cleanFileName = file.name
      .toLowerCase()
      .normalize("NFD") // quita acentos
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-") // espacios → guiones
      .replace(/[^a-z0-9.-]/g, ""); // elimina caracteres raros

    const fileName = `${Date.now()}-${cleanFileName}`;

    const filePath = `products/${Date.now()}-${cleanFileName}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      console.error("Error subiendo imagen:", error);
      return;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    setForm((prev) => ({
      ...prev,
      image_url: data.publicUrl,
    }));
  };

  // ➕ crear o editar
  const handleSubmit = async (e: any) => {
    e.preventDefault();

  const { id, ...rest } = form;

  const productData = {
    ...rest,
    price: Number(form.price),
    stock: Number(form.stock),
  };

    if (editing) {
      await supabase
        .from("products")
        .update(productData)
        .eq("id", form.id);
    } else {
      await supabase.from("products").insert([productData]);
    }

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
    fetchProducts();
  };

  // 🗑 eliminar
  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
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
        <h1 className="text-4xl font-serif text-[#2C2C2C] mb-2">
          Panel de Administración
        </h1>
        <p className="text-[#5A4A3F]">
          Gestiona tus piezas artesanales
        </p>
      </div>
      
      {/* 📊 DASHBOARD */}
      <div className="max-w-6xl mx-auto mb-10 grid md:grid-cols-4 gap-6">

        {/* PRODUCTOS */}
        <div className="bg-white p-6 rounded-2xl shadow border border-[#e5ded3]">
          <p className="text-sm text-gray-500">Productos</p>
          <h3 className="text-2xl font-bold">
            {stats.totalProducts}
          </h3>
        </div>

        {/* STOCK BAJO */}
        <div className="bg-white p-6 rounded-2xl shadow border border-[#e5ded3]">
          <p className="text-sm text-gray-500">Stock bajo</p>
          <h3 className="text-2xl font-bold text-orange-500">
            {stats.lowStock}
          </h3>
        </div>

        {/* ÓRDENES */}
        <div className="bg-white p-6 rounded-2xl shadow border border-[#e5ded3]">
          <p className="text-sm text-gray-500">Órdenes</p>
          <h3 className="text-2xl font-bold">
            {stats.totalOrders}
          </h3>
        </div>

        {/* INGRESOS */}
        <div className="bg-white p-6 rounded-2xl shadow border border-[#e5ded3]">
          <p className="text-sm text-gray-500">Ingresos</p>
          <h3 className="text-2xl font-bold text-terracotta">
            ${stats.totalRevenue}
          </h3>
        </div>

      </div>

      {/* FORMULARIO */}
      <div className="max-w-6xl mx-auto mb-12 bg-white rounded-2xl shadow-lg p-8 border border-[#e5ded3]">
        
        <h2 className="text-2xl font-serif mb-6">
          {editing ? "Editar producto" : "Nuevo producto"}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

          <input name="name" placeholder="Nombre"
            value={form.name} onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
          />

          <input name="category" placeholder="Categoría"
            value={form.category} onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
          />

          <input name="price" placeholder="Precio"
            value={form.price} onChange={handleChange}
            className="p-3 border rounded-lg"
          />

          <input name="stock" placeholder="Stock"
            value={form.stock} onChange={handleChange}
            className="p-3 border rounded-lg"
          />

          {/* URL */}
          <input name="image_url" placeholder="URL imagen"
            value={form.image_url} onChange={handleChange}
            className="p-3 border rounded-lg col-span-2"
          />

          {/* SUBIR IMAGEN */}
          <input type="file" accept="image/*"
            onChange={handleImageUpload}
            className="col-span-2"
          />

          {/* PREVIEW */}
          {form.image_url && (
            <img
              src={form.image_url}
              alt="preview"
              className="col-span-2 h-40 object-cover rounded-lg border"
            />
          )}

          <textarea name="description" placeholder="Descripción"
            value={form.description} onChange={handleChange}
            className="p-3 border rounded-lg col-span-2"
          />

          <button className="col-span-2 bg-terracotta text-white py-3 rounded-lg hover:opacity-90 transition">
            {editing ? "Actualizar producto" : "Crear producto"}
          </button>

        </form>
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-serif mb-6">
          Productos
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#e5ded3] hover:shadow-xl transition"
            >
              
              {/* IMAGEN */}
              <div className="h-48 bg-gray-100">
                {p.image_url && (
                  <img
                    src={p.image_url}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* INFO */}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{p.name}</h3>

                <p className="text-terracotta font-bold">
                  ${p.price}
                </p>

                <p className="text-sm text-gray-500">
                  Stock: {p.stock}
                </p>

                {/* BOTONES */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => editProduct(p)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:opacity-90"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:opacity-90"
                  >
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