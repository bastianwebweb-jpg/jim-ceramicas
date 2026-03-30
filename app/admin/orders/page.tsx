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

  // 🔄 cambiar estado
  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    fetchOrders();
  };

  // 🚚 actualizar envío
  const updateShipping = async (
    id: string,
    company: string,
    tracking: string
  ) => {
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
        <h1 className="text-4xl font-serif">
          Gestión de Pedidos 📦
        </h1>
      </div>

      {loading ? (
        <p>Cargando...</p>
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

// 🔥 COMPONENTE TARJETA
function OrderCard({ order, updateStatus, updateShipping }: any) {
  const [company, setCompany] = useState(order.shipping_company || "");
  const [tracking, setTracking] = useState(order.tracking_number || "");

  return (
    <div className="bg-white p-6 rounded-2xl shadow border">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <div>
          <p className="font-semibold">
            Pedido #{order.id.slice(0, 6)}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <p className="font-bold text-lg">
          ${order.total}
        </p>
      </div>

      {/* ESTADO */}
      <div className="mb-4">
        <span className="font-medium mr-2">Estado:</span>

        <span className={`px-3 py-1 rounded-full text-sm
          ${
            order.status === "pendiente"
              ? "bg-yellow-100 text-yellow-700"
              : order.status === "pagado"
              ? "bg-green-100 text-green-700"
              : order.status === "enviado"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100"
          }
        `}>
          {order.status}
        </span>
      </div>

      {/* BOTONES */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => updateStatus(order.id, "pendiente")}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Pendiente
        </button>

        <button
          onClick={() => updateStatus(order.id, "pagado")}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Pagado
        </button>

        <button
          onClick={() => updateStatus(order.id, "enviado")}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Enviado
        </button>
      </div>

      {/* PRODUCTOS */}
      <div className="mb-4">
        {order.items?.map((item: any, i: number) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{item.name} x{item.quantity}</span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* 🚚 ENVÍO SOLO SI ESTÁ ENVIADO */}
      {order.status === "enviado" && (
        <div className="mt-4 border-t pt-4">

          <p className="font-medium mb-2">
            Datos de envío
          </p>

          <input
            placeholder="Empresa (Chilexpress, Starken...)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <input
            placeholder="Número de seguimiento"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <button
            onClick={() =>
              updateShipping(order.id, company, tracking)
            }
            className="bg-black text-white px-4 py-2 rounded"
          >
            Guardar envío
          </button>

          {order.tracking_number && (
            <p className="text-sm text-green-600 mt-2">
              ✔ Tracking guardado
            </p>
          )}

        </div>
      )}

    </div>
  );
}