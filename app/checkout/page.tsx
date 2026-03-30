"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🛒 cargar carrito (localStorage)
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
    };

    getUser();
  }, []);

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 🧾 crear pedido
  const handleOrder = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.id,
          items: cart,
          total,
          status: "pendiente",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Error creando pedido");
      setLoading(false);
      return;
    }

    // limpiar carrito
    localStorage.removeItem("cart");

    // redirigir a perfil con mensaje
    router.push(`/perfil?order=${data.id}`);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">

      {/* 🛒 RESUMEN */}
      <div>
        <h1 className="text-3xl font-serif mb-8">
          Tu pedido
        </h1>

        <div className="flex flex-col gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b pb-3"
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

        <div className="flex justify-between mt-6 text-xl font-bold">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      {/* 💳 PAGO */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border">

        <h2 className="text-xl font-semibold mb-4">
          Pago por transferencia
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Realiza la transferencia y confirma tu pedido
        </p>

        <div className="bg-[#f5f0e8] rounded-xl p-4 text-sm space-y-2 mb-6">
          <p><strong>Banco:</strong> BancoEstado</p>
          <p><strong>Nombre:</strong> Juan Pablo XXXX</p>
          <p><strong>Cuenta:</strong> 12345678</p>
          <p><strong>Tipo:</strong> Cuenta RUT</p>
          <p><strong>Email:</strong> correo@email.com</p>
        </div>

        <button
          onClick={handleOrder}
          disabled={loading || cart.length === 0}
          className="w-full bg-terracotta text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Confirmar pedido"}
        </button>

        <p className="text-xs text-gray-400 mt-4 text-center">
          🔒 Tu pedido será confirmado tras recibir el pago
        </p>
      </div>
    </main>
  );
}