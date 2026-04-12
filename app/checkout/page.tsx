"use client";

import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Estado para la dirección
  const [address, setAddress] = useState({
    street: "",
    city: "",
    phone: ""
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
    };
    getUser();
  }, [router]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (cart.length === 0 || !user) return;

    // Validación de campos de envío
    if (!address.street || !address.city || !address.phone) {
      toast.error("Por favor, completa los datos de envío");
      return;
    }

    setLoading(true);

    try {
      for (const item of cart) {
        const table = item.isCourse ? "courses" : "products";
        const stockField = item.isCourse ? "available_slots" : "stock";

        const { data: currentProduct } = await supabase
          .from(table)
          .select(stockField)
          .eq("id", item.id)
          .single();

        if (!currentProduct || currentProduct[stockField] < item.quantity) {
          toast.error(`Lo sentimos, ya no queda stock suficiente de: ${item.name}`);
          setLoading(false);
          return;
        }
      }

      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            items: cart,
            total,
            status: "pendiente",
            shipping_address: address, // Guardamos la dirección en la DB
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const productList = cart.map(item => `• ${item.name} (x${item.quantity})`).join("\n");
      
      const message = `*NUEVO PEDIDO - JIM CERÁMICAS* 🏺\n\n` +
        `*Cliente:* ${user.email}\n` +
        `*Orden:* #${data.id.slice(0, 8)}\n` +
        `*Total:* $${total.toLocaleString("es-CL")}\n\n` +
        `*Datos de Envío:*\n` +
        `📍 Direccion: ${address.street}, ${address.city}\n` +
        `📞 Teléfono: ${address.phone}\n\n` +
        `*Detalle:*\n${productList}\n\n` +
        `_Ya realicé la transferencia, adjunto el comprobante a continuación._ 🙌`;

      const phone = "56995786212"; 
      const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      toast.success("¡Pedido creado! Redirigiendo a WhatsApp...");
      clearCart();
      
      setTimeout(() => {
        window.open(whatsappURL, "_blank");
        router.push(`/perfil?order=${data.id}`);
      }, 1500);

    } catch (error) {
      console.error(error);
      toast.error("Hubo un problema al procesar tu pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
      <div className="space-y-8">
        <h1 className="text-4xl font-serif text-stone-800">Tu pedido</h1>

        {cart.length === 0 ? (
          <div className="bg-stone-50 p-8 rounded-2xl text-center border border-dashed border-stone-200">
            <p className="text-stone-500 italic">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-stone-50 last:border-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-stone-800">{item.name}</span>
                    <span className="text-sm text-stone-400">Cantidad: {item.quantity}</span>
                  </div>
                  <span className="font-serif text-stone-600">
                    ${(item.price * item.quantity).toLocaleString("es-CL")}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-stone-50 p-6 flex justify-between items-center">
              <span className="text-lg font-bold text-stone-800">Total a pagar</span>
              <span className="text-2xl font-serif text-terracotta font-bold">
                ${total.toLocaleString("es-CL")}
              </span>
            </div>
          </div>
        )}

        {/* 📍 FORMULARIO DE ENVÍO INTEGRADO */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-4">
          <h2 className="text-2xl font-serif text-stone-800">Datos de envío</h2>
          <input
            type="text"
            placeholder="Calle y número (Ej: Av. Providencia 123, Depto 402)"
            value={address.street}
            onChange={(e) => setAddress({...address, street: e.target.value})}
            className="w-full p-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:border-terracotta transition-all"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ciudad / Comuna"
              value={address.city}
              onChange={(e) => setAddress({...address, city: e.target.value})}
              className="w-full p-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:border-terracotta transition-all"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={address.phone}
              onChange={(e) => setAddress({...address, phone: e.target.value})}
              className="w-full p-4 rounded-2xl border border-stone-100 bg-stone-50 focus:bg-white focus:outline-none focus:border-terracotta transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-stone-200/50 border border-stone-100 h-fit sticky top-24">
        <h2 className="text-2xl font-serif mb-2 text-stone-800">Pago por transferencia</h2>
        <p className="text-stone-500 mb-8 text-sm">
          Completa la transferencia para que podamos procesar tu envío o cupo.
        </p>

        <div className="bg-[#fcfaf7] rounded-2xl p-6 border border-stone-100 space-y-3 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-stone-400">Banco</span>
            <span className="font-bold text-stone-700">BancoEstado</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-400">Titular</span>
            <span className="font-bold text-stone-700">Bastián Vidal</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-400">RUT</span>
            <span className="font-bold text-stone-700">12.345.678-9</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-400">Tipo</span>
            <span className="font-bold text-stone-700">Cuenta RUT</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-400">Email</span>
            <span className="font-bold text-stone-700 italic">contacto@jimceramicas.cl</span>
          </div>
        </div>

        <button
          onClick={handleOrder}
          disabled={loading || cart.length === 0}
          className="w-full bg-terracotta text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-terracotta/20 disabled:opacity-50 disabled:scale-100"
        >
          {loading ? "Verificando..." : "Confirmar mi pedido"}
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-stone-400">
          <span>🔒</span>
          <p>Tu pedido se reserva oficialmente al recibir el comprobante</p>
        </div>
      </div>
    </main>
  );
}