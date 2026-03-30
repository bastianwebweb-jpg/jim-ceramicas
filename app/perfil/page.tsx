"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function PerfilContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  useEffect(() => {
    const getOrders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setOrders(data || []);
    };

    getOrders();
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-10">Mis compras</h1>

      {orderId && (
        <div className="mb-8 p-4 rounded-xl bg-green-100 border border-green-300">
          <p className="font-medium text-green-800">
            ✅ Compra realizada con éxito
          </p>
          <p className="text-sm text-green-700">
            ID de orden: {orderId}
          </p>
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-gray-500">Aún no tienes pedidos</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/30"
            >
              <div className="flex justify-between mb-4">
                <p className="font-semibold">
                  Pedido #{order.id.slice(0, 6)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <p className="mb-2">
                Estado:{" "}
                <span
                  className={`font-medium px-2 py-1 rounded-full text-sm
                  ${
                    order.status === "pendiente"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "enviado"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "entregado"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>

              <p className="font-bold mb-4">
                Total: ${order.total}
              </p>

              <div className="flex flex-col gap-2">
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function PerfilPage() {
  return (
    <Suspense fallback={<p className="p-10">Cargando...</p>}>
      <PerfilContent />
    </Suspense>
  );
}