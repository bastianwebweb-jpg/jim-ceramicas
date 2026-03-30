"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Cuenta creada 🧡");

    setTimeout(() => {
      router.push("/perfil");
    }, 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f0e8] px-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* TITULO */}
        <h1 className="text-3xl font-serif text-center mb-6 text-[#2C2C2C]">
          Crear cuenta
        </h1>

        <p className="text-center text-gray-500 mb-8 text-sm">
          Únete a nuestra comunidad artesanal
        </p>

        {/* FORM */}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-terracotta"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-terracotta"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-terracotta text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        {/* LOGIN */}
        <p className="text-sm text-center mt-6 text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-terracotta cursor-pointer hover:underline"
          >
            Inicia sesión
          </span>
        </p>

      </div>
    </main>
  );
}