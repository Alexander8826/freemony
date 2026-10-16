"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { createClient } from "../client";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          referred_by: refCode || null,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.replace("/");
  }

  return (
    <main className="min-h-screen bg-[#07111f] flex items-center justify-center p-6 text-white">
      <div className="bg-[#0b192c] p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-800">
        <h1 className="text-2xl font-bold mb-2 text-center text-emerald-400">Crear Cuenta en Freemony</h1>
        {refCode && (
          <p className="text-xs text-center text-emerald-300 bg-emerald-950/50 py-1 px-3 rounded-full mb-6 border border-emerald-800">
            Invitado por el código: <span className="font-mono font-bold">{refCode}</span>
          </p>
        )}

        {errorMessage && (
          <div className="bg-red-950/60 border border-red-800 text-red-200 text-sm p-3 rounded-lg mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Nombre completo</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#07111f] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#07111f] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#07111f] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 rounded-lg transition-colors cursor-pointer mt-2"
          >
            {loading ? "Registrando..." : "Completar Registro"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07111f] flex items-center justify-center text-white">Cargando registro...</div>}>
      <RegisterContent />
    </Suspense>
  );
}