"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error al iniciar sesión");
      console.error(error);
      return;
    }

    // 🔥 traer rol
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    // 🔀 redirección
    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/perfil");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f0e8] px-6">

      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-[#e5ded3]">

        <h1 className="text-3xl font-serif mb-6 text-center">
          Iniciar sesión
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded-lg"
          />

          <button
            onClick={handleLogin}
            className="bg-terracotta text-white py-3 rounded-lg hover:opacity-90 transition"
          >
            Entrar
          </button>

        </div>
      </div>

    </main>
  );
}