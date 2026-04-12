"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    fetchOrders();
  };

  const updateShipping = async (id: string, company: string, tracking: string) => {
    await supabase
      .from("orders")
      .update({
        shipping_company: company,
        tracking_number: tracking,
      })
      .eq("id", id);

    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] p-10">
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-serif text-stone-800">
          Gestión de Pedidos 📦
        </h1>
      </div>

      {loading ? (
        <div className="max-w-6xl mx-auto text-center py-20">
          <p className="text-stone-500 animate-pulse">Cargando pedidos...</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              updateStatus={updateStatus}
              updateShipping={updateShipping}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, updateStatus, updateShipping }: any) {
  const [company, setCompany] = useState(order.shipping_company || "");
  const [tracking, setTracking] = useState(order.tracking_number || "");

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
      {/* HEADER: ID Y TOTAL */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-bold text-terracotta uppercase tracking-widest">Orden</span>
          <p className="font-serif text-2xl text-stone-800">
            #{order.id.slice(0, 8)}
          </p>
          <p className="text-sm text-stone-400">
            {new Date(order.created_at).toLocaleString("es-CL")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-stone-400 uppercase">Total</p>
          <p className="font-serif text-2xl text-stone-900">
            ${order.total.toLocaleString("es-CL")}
          </p>
        </div>
      </div>

      {/* ESTADO ACTUAL */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-stone-500">Estado:</span>
        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter
          ${order.status === "pendiente" ? "bg-amber-100 text-amber-700" : 
            order.status === "pagado" ? "bg-emerald-100 text-emerald-700" : 
            order.status === "enviado" ? "bg-blue-100 text-blue-700" : "bg-stone-100"}
        `}>
          {order.status}
        </span>
      </div>

      {/* 📍 DIRECCIÓN DE ENVÍO (CORREGIDO) */}
      <div className="mb-6 p-5 bg-stone-50 rounded-2xl border border-stone-100">
        <p className="text-xs font-bold uppercase text-stone-400 mb-3 tracking-widest">Datos de Entrega</p>
        {order.shipping_address ? (
          <div className="space-y-2">
            <p className="text-stone-800 font-medium flex items-center gap-2">
              <span className="text-lg">🏠</span> {order.shipping_address.street}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-stone-600">
              <p className="flex items-center gap-2"><span>📍</span> {order.shipping_address.city}</p>
              <p className="flex items-center gap-2"><span>📞</span> {order.shipping_address.phone}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-stone-400 italic">No hay datos de dirección registrados.</p>
        )}
      </div>

      {/* PRODUCTOS */}
      <div className="mb-8 border-t border-stone-50 pt-6">
        <p className="text-xs font-bold uppercase text-stone-400 mb-4 tracking-widest">Detalle de Productos</p>
        <div className="space-y-3">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-stone-50 shadow-sm text-sm">
              <span className="font-medium text-stone-700">{item.name} <span className="text-stone-400 font-normal ml-2">x{item.quantity}</span></span>
              <span className="font-serif text-stone-500">${(item.price * item.quantity).toLocaleString("es-CL")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* GESTIÓN DE ESTADO */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button onClick={() => updateStatus(order.id, "pendiente")} className="flex-1 min-w-[120px] bg-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors">Pendiente</button>
        <button onClick={() => updateStatus(order.id, "pagado")} className="flex-1 min-w-[120px] bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors">Confirmar Pago</button>
        <button onClick={() => updateStatus(order.id, "enviado")} className="flex-1 min-w-[120px] bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">Marcar Enviado</button>
      </div>

      {/* 🚚 LOGÍSTICA DE ENVÍO */}
      {order.status === "enviado" && (
        <div className="mt-6 border-t border-stone-100 pt-6 animate-in fade-in slide-in-from-top-2">
          <h4 className="text-sm font-bold text-stone-800 mb-4">Información de Seguimiento</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Empresa (Chilexpress, Starken...)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-terracotta transition-all text-sm"
            />
            <input
              placeholder="Número de seguimiento"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-terracotta transition-all text-sm"
            />
          </div>
          <button
            onClick={() => updateShipping(order.id, company, tracking)}
            className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-all"
          >
            Actualizar Tracking
          </button>
          {order.tracking_number && (
            <p className="text-center text-xs text-emerald-600 mt-3 font-medium flex items-center justify-center gap-1">
              <span>✔</span> El cliente puede ver su número de seguimiento
            </p>
          )}
        </div>
      )}
    </div>
  );
}