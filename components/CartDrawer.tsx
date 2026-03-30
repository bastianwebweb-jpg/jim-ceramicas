"use client";

import { useCart } from "../context/CartContext";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CartDrawer() {
  const router = useRouter(); // ✅ AQUÍ (dentro)
  const { 
  cart, 
  removeFromCart, 
  isOpen, 
  closeCart, 
  clearCart,
  increaseQuantity,
  decreaseQuantity
} = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // ✅ AHORA ESTÁ DENTRO
const handleCheckout = async () => {
  if (cart.length === 0) return;

  try {
    // 👤 usuario
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 🧾 crear orden
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        total,
        items: cart,
        status: "pendiente",
        user_id: user?.id || null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 📦 stock
    for (const item of cart) {
      const { error } = await supabase.rpc("decrease_stock", {
        product_id: item.id,
        quantity: item.quantity,
      });

      if (error) throw error;
    }

    // 📩 email
    await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user?.email || "test@email.com",
      }),
    });

    // 🧹 limpiar UI
    clearCart();
    closeCart();

    // 🚀 REDIRECCIÓN PRO
    router.push(`/perfil?order=${order.id}`);

  } catch (err) {
    console.error(err);
    alert("Error al procesar la compra");
  }
};


  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100]">
            <div className="absolute right-0 top-0 h-full w-[360px] 
            bg-white/80 backdrop-blur-xl 
            p-6 shadow-2xl z-[101]
            border-l border-white/20
            animate-slide-in">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Carrito</h2>
              <button onClick={closeCart}>✖</button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500">Carrito vacío</p>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl 
                    bg-white/60 backdrop-blur-md 
                    shadow-md hover:shadow-xl 
                    transition-all duration-300 
                    hover:scale-[1.02]"
                  >
                    {/* 🖼 Imagen */}
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                      <img
                        src={item.image_url}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* 📦 Info */}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ${item.price} c/u
                      </p>

                      {/* 🔢 CONTROL DE CANTIDAD */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center 
                          rounded-full bg-white shadow-md 
                          hover:shadow-lg hover:scale-110 
                          active:scale-95 transition"
                        >
                          −
                        </button>

                        <span className="min-w-[20px] text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="w-8 h-8 flex items-center justify-center 
                          rounded-full bg-terracotta text-white 
                          shadow-md hover:shadow-lg hover:scale-110 
                          active:scale-95 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* 💰 subtotal */}
                    <div className="text-right">
                      <p className="font-semibold">
                        ${item.price * item.quantity}
                      </p>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-600 text-sm transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <p className="text-xl font-semibold tracking-wide">
                Total
              </p>
              <p className="text-2xl font-bold text-terracotta">
                ${total}
              </p>
            </div>

            {cart.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-terracotta text-white py-3 rounded-xl 
                  shadow-lg hover:shadow-2xl 
                  hover:scale-[1.02] active:scale-95 
                  transition-all duration-300"
                >
                  Finalizar compra
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}