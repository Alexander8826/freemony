"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "../client";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(`Error al registrarse: ${error.message}`);
        return;
      }

      const newUser = data.user;

      if (newUser) {
        await supabase.from("profiles").upsert({
          id: newUser.id,
          referred_by: refCode ?? null,
        });

        alert("Registro exitoso. ¡Bienvenido!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#07111f] p-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1727] p-8">
        <h1 className="mb-2 text-2xl font-bold">Crear cuenta</h1>
        {refCode && (
          <p className="mb-4 text-xs text-emerald-400">
            Te estás registrando a través del enlace de un amigo.
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-300">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-400 py-3 font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </main>
  );
}