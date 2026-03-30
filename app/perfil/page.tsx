"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

function PerfilContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");

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

    getData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#f5f0e8] px-6 py-20">

      {/* HEADER PERFIL */}
      <div className="max-w-5xl mx-auto mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        
        <div>
          <h1 className="text-3xl font-serif text-[#2C2C2C]">
            Mi perfil
          </h1>
          <p className="text-[#5A4A3F] text-sm">
            {userEmail}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-[#3B2F2F] text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="max-w-5xl mx-auto">

        {/* ALERTA COMPRA */}
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

        {/* SIN PEDIDOS */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow">
            <p className="text-gray-500 mb-4">
              Aún no tienes pedidos
            </p>

            <button
              onClick={() => router.push("/tienda")}
              className="bg-terracotta text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              Ir a la tienda
            </button>
          </div>
        ) : (

          <>
            <h2 className="text-2xl font-serif mb-6 text-[#2C2C2C]">
              Mis compras
            </h2>

            <div className="flex flex-col gap-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
                >
                  <div className="flex justify-between mb-4">
                    <p className="font-semibold">
                      Pedido #{order.id.slice(0, 6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {order.status === "pendiente" && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⏳ Pedido pendiente
                    </p>
                    <p className="text-sm text-yellow-700">
                      Estamos esperando la confirmación del pago.
                    </p>
                  </div>
                )}

                {order.status === "pagado" && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      💰 Pago confirmado
                    </p>
                    <p className="text-sm text-green-700">
                      Tu pedido está siendo preparado.
                    </p>
                  </div>
                )}

                {order.status === "enviado" && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      📦 Pedido enviado
                    </p>

                    {order.shipping_company ? (
                      <p className="text-sm text-blue-700">
                        Empresa: <span className="font-medium">{order.shipping_company}</span>
                      </p>
                    ) : (
                      <p className="text-sm text-blue-700 italic">
                        Empresa no especificada
                      </p>
                    )}

                    {order.tracking_number ? (
                      <p className="text-sm text-blue-700">
                        Seguimiento:{" "}
                        <span className="font-medium">
                          {order.tracking_number}
                        </span>
                      </p>
                    ) : (
                      <p className="text-sm text-blue-700 italic">
                        Número de seguimiento pendiente
                      </p>
                    )}
                  </div>
                )}

                {order.status === "entregado" && (
                  <div className="mt-3 p-3 bg-gray-100 border border-gray-300 rounded-lg">
                    <p className="text-sm text-gray-800 font-medium">
                      ✅ Pedido entregado
                    </p>
                    <p className="text-sm text-gray-600">
                      Esperamos que disfrutes tu pieza ✨
                    </p>
                  </div>
                )}

                  <p className="font-bold mb-4 text-[#C46A3C]">
                    Total: ${order.total}
                  </p>

                  <div className="flex flex-col gap-2 border-t pt-4">
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
          </>
        )}
      </div>
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