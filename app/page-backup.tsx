"use client";

import { useState } from "react";
import { createClient } from "./client";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(
          "No se pudo iniciar sesión. Verifica tu correo y contraseña, y confirma tu correo si es necesario."
        );
        return;
      }

      if (!data.session) {
        setMessage(
          "Se verificaron las credenciales, pero no se encontró una sesión activa."
        );
        return;
      }

      setPassword("");
      setMessage("¡Inicio de sesión correcto!");

      // La autenticación funcionó. La redirección se configura
      // cuando confirmemos la ruta del panel de usuario.
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      setMessage(
        error instanceof Error
          ? `Error al iniciar sesión: ${error.message}`
          : "Ocurrió un error inesperado al iniciar sesión."
      );
    "use client";

import { useState } from "react";
import { createClient } from "./client";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(
          "No se pudo iniciar sesión. Verifica tu correo y contraseña, y confirma tu correo si es necesario."
        );
        return;
      }

      if (!data.session) {
        setMessage(
          "Se verificaron las credenciales, pero no se encontró una sesión activa."
        );
        return;
      }

      setPassword("");
      setMessage("¡Inicio de sesión correcto!");

      // La autenticación funcionó. La redirección se configura
      // cuando confirmemos la ruta del panel de usuario.
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      setMessage(
        error instanceof Error
          ? `Error al iniciar sesión: ${error.message}`
          : "Ocurrió un error inesperado al iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  }
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#inicio" className="text-2xl font-extrabold">
            Free<span className="text-emerald-400">mony</span>
          </a>

          <button
            className="rounded-lg border border-white/20 px-3 py-2 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            ☰
          </button>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#inicio" className="hover:text-emerald-400">Inicio</a>
            <a href="#como-funciona" className="hover:text-emerald-400">
              Cómo funciona
            </a>
            <a href="#afiliados" className="hover:text-emerald-400">
              Afiliados
            </a>
            <a href="#seguridad" className="hover:text-emerald-400">
              Seguridad
            </a>
          </div>

          <div className="hidden gap-3 md:flex">
            <a
              href="#acceso"
              onClick={() => {
                setIsLogin(true);
                setMessage("");
              }}
              className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Iniciar sesión
            </a>

            <a
              href="#acceso"
              onClick={() => {
                setIsLogin(false);
                setMessage("");
              }}
              className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300"
            >
              Crear cuenta
            </a>
          </div>
        </nav>

        {menuOpen && (
          <div className="flex flex-col gap-4 px-6 pb-6 text-slate-200 md:hidden">
            <a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>
              Cómo funciona
            </a>
            <a href="#afiliados" onClick={() => setMenuOpen(false)}>
              Afiliados
            </a>
            <a href="#seguridad" onClick={() => setMenuOpen(false)}>
              Seguridad
            </a>
            <a
              href="#acceso"
              onClick={() => {
                setIsLogin(true);
                setMenuOpen(false);
                setMessage("");
              }}
            >
              Iniciar sesión
            </a>
            <a
              href="#acceso"
              onClick={() => {
                setIsLogin(false);
                setMenuOpen(false);
                setMessage("");
              }}
            >
              Crear cuenta
            </a>
          </div>
        )}
      </header>

      <section
        id="inicio"
        className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28"
      >
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Tu futuro financiero comienza aquí
          </div>

          <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
            Construye tu futuro con{" "}
            <span className="text-emerald-400">Freemony.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            Una plataforma para gestionar tu cuenta, consultar tus movimientos
            y descubrir oportunidades con información transparente.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#acceso"
              onClick={() => setIsLogin(false)}
              className="rounded-xl bg-emerald-400 px-7 py-4 font-bold text-slate-950 hover:bg-emerald-300"
            >
              Comenzar ahora →
            </a>
            <a
              href="#como-funciona"
              className="rounded-xl border border-white/15 px-7 py-4 font-semibold hover:bg-white/5"
            >
              Conocer más
            </a>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Información clara. Operaciones registradas. Seguridad primero.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-950 p-6 shadow-2xl md:p-8">
          <p className="text-sm text-slate-400">Vista previa de tu cuenta</p>
          <h2 className="mt-1 text-xl font-bold">Panel financiero</h2>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Saldo de demostración</p>
            <p className="mt-2 text-4xl font-bold">RD$ 0.00</p>
            <p className="mt-3 text-xs text-slate-500">
              No representa fondos reales.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Inversiones</p>
              <p className="mt-2 text-xl font-bold">RD$ 0.00</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Ganancias</p>
              <p className="mt-2 text-xl font-bold text-emerald-400">
                RD$ 0.00
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="border-t border-white/10 bg-white/[0.02] px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-semibold text-emerald-400">
            SENCILLO Y TRANSPARENTE
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Tu cuenta, bajo control.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Crea tu cuenta",
                description: "Regístrate para acceder a tu espacio personal.",
              },
              {
                number: "02",
                title: "Consulta tus operaciones",
                description: "Revisa tus movimientos con información clara.",
              },
              {
                number: "03",
                title: "Gestiona tus solicitudes",
                description: "Consulta el estado de tus solicitudes.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-white/10 bg-[#0b1727] p-7"
              >
                <p className="text-sm font-bold text-emerald-400">
                  {item.number}
                </p>
                <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="afiliados" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-8 md:p-12">
          <p className="font-semibold text-emerald-400">PROGRAMA DE AFILIADOS</p>
          <h2 className="mt-3 text-3xl font-bold">Comparte Freemony.</h2>
          <p className="mt-4 leading-7 text-slate-400">
            Un espacio para consultar referidos y comisiones, sujeto a las
            condiciones publicadas del programa.
          </p>
        </div>
      </section>

      <section id="seguridad" className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-bold">Transparencia</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Movimientos explicados claramente.
            </p>
          </div>
          <div>
            <h3 className="font-bold">Seguridad</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Acceso mediante autenticación.
            </p>
          </div>
          <div>
            <h3 className="font-bold">Riesgos visibles</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Toda inversión real debe explicar sus riesgos.
            </p>
          </div>
        </div>
      </section>

      <section id="acceso" className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#0b1727] p-8">
          <h2 className="text-3xl font-bold">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </h2>

          <p className="mt-3 text-slate-400">
            {isLogin
              ? "Accede a tu cuenta de Freemony."
              : "Regístrate para comenzar con Freemony."}
          </p>

          <form
            onSubmit={isLogin ? handleSignIn : handleSignUp}
            className="mt-8 space-y-5"
          >
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Nombre completo
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#07111f] px-4 py-3 text-white"
                  placeholder="Tu nombre"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Correo electrónico
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#07111f] px-4 py-3 text-white"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Contraseña
              </label>
              <input
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#07111f] px-4 py-3 text-white"
                placeholder={
                  isLogin ? "Tu contraseña" : "Mínimo 8 caracteres"
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-400 px-5 py-4 font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-50"
            >
              {loading
                ? "Procesando..."
                : isLogin
                  ? "Iniciar sesión"
                  : "Crear cuenta"}
            </button>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className="break-words text-sm text-emerald-300"
              >
                {message}
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isLogin
              ? "¿Todavía no tienes cuenta?"
              : "¿Ya tienes una cuenta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
                setPassword("");
              }}
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              {isLogin ? "Crear cuenta" : "Iniciar sesión"}
            </button>
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-7 text-center text-sm text-slate-500">
        © 2026 Freemony. Todos los derechos reservados.
        <p className="mt-2">
          Esta versión es una demostración y no acepta dinero real.
        </p>
      </footer>
    </main>
  );
}
  }
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#inicio" className="text-2xl font-extrabold">
            Free<span className="text-emerald-400">mony</span>
          </a>

          <button
            className="rounded-lg border border-white/20 px-3 py-2 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            ☰
          </button>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#inicio" className="hover:text-emerald-400">Inicio</a>
            <a href="#como-funciona" className="hover:text-emerald-400">
              Cómo funciona
            </a>
            <a href="#afiliados" className="hover:text-emerald-400">
              Afiliados
            </a>
            <a href="#seguridad" className="hover:text-emerald-400">
              Seguridad
            </a>
          </div>

          <div className="hidden gap-3 md:flex">
            <a
              href="#acceso"
              onClick={() => {
                setIsLogin(true);
                setMessage("");
              }}
              className="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-white/10"
            >
              Iniciar sesión
            </a>

            <a
              href="#acceso"
              onClick={() => {
                setIsLogin(false);
                setMessage("");
              }}
              className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300"
            >
              Crear cuenta
            </a>
          </div>
        </nav>

        {menuOpen && (
          <div className="flex flex-col gap-4 px-6 pb-6 text-slate-200 md:hidden">
            <a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>
              Cómo funciona
            </a>
            <a href="#afiliados" onClick={() => setMenuOpen(false)}>
              Afiliados
            </a>
            <a href="#seguridad" onClick={() => setMenuOpen(false)}>
              Seguridad
            </a>
            <a
              href="#acceso"
              onClick={() => {
                setIsLogin(true);
                setMenuOpen(false);
                setMessage("");
              }}
            >
              Iniciar sesión
            </a>
            <a
              href="#acceso"
              onClick={() => {
                setIsLogin(false);
                setMenuOpen(false);
                setMessage("");
              }}
            >
              Crear cuenta
            </a>
          </div>
        )}
      </header>

      <section
        id="inicio"
        className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28"
      >
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Tu futuro financiero comienza aquí
          </div>

          <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
            Construye tu futuro con{" "}
            <span className="text-emerald-400">Freemony.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            Una plataforma para gestionar tu cuenta, consultar tus movimientos
            y descubrir oportunidades con información transparente.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#acceso"
              onClick={() => setIsLogin(false)}
              className="rounded-xl bg-emerald-400 px-7 py-4 font-bold text-slate-950 hover:bg-emerald-300"
            >
              Comenzar ahora →
            </a>
            <a
              href="#como-funciona"
              className="rounded-xl border border-white/15 px-7 py-4 font-semibold hover:bg-white/5"
            >
              Conocer más
            </a>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Información clara. Operaciones registradas. Seguridad primero.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-950 p-6 shadow-2xl md:p-8">
          <p className="text-sm text-slate-400">Vista previa de tu cuenta</p>
          <h2 className="mt-1 text-xl font-bold">Panel financiero</h2>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-slate-400">Saldo de demostración</p>
            <p className="mt-2 text-4xl font-bold">RD$ 0.00</p>
            <p className="mt-3 text-xs text-slate-500">
              No representa fondos reales.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Inversiones</p>
              <p className="mt-2 text-xl font-bold">RD$ 0.00</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Ganancias</p>
              <p className="mt-2 text-xl font-bold text-emerald-400">
                RD$ 0.00
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="border-t border-white/10 bg-white/[0.02] px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-semibold text-emerald-400">
            SENCILLO Y TRANSPARENTE
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Tu cuenta, bajo control.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Crea tu cuenta",
                description: "Regístrate para acceder a tu espacio personal.",
              },
              {
                number: "02",
                title: "Consulta tus operaciones",
                description: "Revisa tus movimientos con información clara.",
              },
              {
                number: "03",
                title: "Gestiona tus solicitudes",
                description: "Consulta el estado de tus solicitudes.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-white/10 bg-[#0b1727] p-7"
              >
                <p className="text-sm font-bold text-emerald-400">
                  {item.number}
                </p>
                <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="afiliados" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.06] p-8 md:p-12">
          <p className="font-semibold text-emerald-400">PROGRAMA DE AFILIADOS</p>
          <h2 className="mt-3 text-3xl font-bold">Comparte Freemony.</h2>
          <p className="mt-4 leading-7 text-slate-400">
            Un espacio para consultar referidos y comisiones, sujeto a las
            condiciones publicadas del programa.
          </p>
        </div>
      </section>

      <section id="seguridad" className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-bold">Transparencia</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Movimientos explicados claramente.
            </p>
          </div>
          <div>
            <h3 className="font-bold">Seguridad</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Acceso mediante autenticación.
            </p>
          </div>
          <div>
            <h3 className="font-bold">Riesgos visibles</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Toda inversión real debe explicar sus riesgos.
            </p>
          </div>
        </div>
      </section>

      <section id="acceso" className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#0b1727] p-8">
          <h2 className="text-3xl font-bold">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </h2>

          <p className="mt-3 text-slate-400">
            {isLogin
              ? "Accede a tu cuenta de Freemony."
              : "Regístrate para comenzar con Freemony."}
          </p>

          <form
            onSubmit={isLogin ? handleSignIn : handleSignUp}
            className="mt-8 space-y-5"
          >
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Nombre completo
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#07111f] px-4 py-3 text-white"
                  placeholder="Tu nombre"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Correo electrónico
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#07111f] px-4 py-3 text-white"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Contraseña
              </label>
              <input
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#07111f] px-4 py-3 text-white"
                placeholder={
                  isLogin ? "Tu contraseña" : "Mínimo 8 caracteres"
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-400 px-5 py-4 font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-50"
            >
              {loading
                ? "Procesando..."
                : isLogin
                  ? "Iniciar sesión"
                  : "Crear cuenta"}
            </button>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className="break-words text-sm text-emerald-300"
              >
                {message}
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isLogin
              ? "¿Todavía no tienes cuenta?"
              : "¿Ya tienes una cuenta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
                setPassword("");
              }}
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              {isLogin ? "Crear cuenta" : "Iniciar sesión"}
            </button>
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-7 text-center text-sm text-slate-500">
        © 2026 Freemony. Todos los derechos reservados.
        <p className="mt-2">
          Esta versión es una demostración y no acepta dinero real.
        </p>
      </footer>
    </main>
  );
}