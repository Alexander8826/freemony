"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../client";

const menu = [
  "Inicio",
  "Mi saldo",
  "Movimientos",
  "Retiros",
  "Referidos",
  "Mi perfil",
  "Registrar movimiento",
];

const PAGE_SIZE = 10;

type Transaction = {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  description: string | null;
};

type ReferredUser = {
  id: string;
  full_name: string | null;
  created_at: string;
};

type WithdrawalRequest = {
  id: string;
  amount: number;
  method: string;
  details: string;
  status: string;
  created_at: string;
};

// Componente de Calculadora de Inversión
function InvestmentCalculator() {
  const [amount, setAmount] = useState<number>(10000);
  const [months, setMonths] = useState<number>(6);

  const monthlyRate = 0.02; // 2% mensual estimado
  const estimatedProfit = amount * Math.pow(1 + monthlyRate, months) - amount;
  const totalReturn = amount + estimatedProfit;

  const formatCalcAmount = (val: number) =>
    val.toLocaleString("es-DO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="bg-[#0b1727] p-6 rounded-2xl border border-white/10 shadow-xl text-white my-6">
      <h3 className="text-xl font-bold mb-2 text-emerald-400">Calculadora de Inversión</h3>
      <p className="text-sm text-slate-400 mb-6">
        Simula tus ganancias estimadas en base al capital invertido en Freemony.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Cantidad a invertir: <span className="font-bold text-emerald-400">RD$ {amount.toLocaleString("es-DO")}</span>
            </label>
            <input
              type="range"
              min="1000"
              max="500000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Plazo (meses): <span className="font-bold text-emerald-400">{months} meses</span>
            </label>
            <input
              type="range"
              min="1"
              max="24"
              step="1"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="bg-[#07111f] p-5 rounded-xl border border-white/10 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Inversión inicial:</span>
              <span className="font-semibold">RD$ {formatCalcAmount(amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Ganancia estimada:</span>
              <span className="font-semibold text-emerald-400">+ RD$ {formatCalcAmount(estimatedProfit)}</span>
            </div>
            <hr className="border-white/10 my-2" />
            <div className="flex justify-between text-base font-bold">
              <span>Total al finalizar:</span>
              <span className="text-emerald-400">RD$ {formatCalcAmount(totalReturn)}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 mt-4 text-center">
            * Cálculo basado en una tasa estimada de rendimiento referencial.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalMovements, setTotalMovements] = useState(0);

  const [historyPage, setHistoryPage] = useState(0);
  const [historyTransactions, setHistoryTransactions] = useState<Transaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyHasMore, setHistoryHasMore] = useState(false);

  const [dataLoading, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("Inicio");
  const [loggingOut, setLoggingOut] = useState(false);
  const [savingTransaction, setSavingTransaction] = useState(false);
  const [userId, setUserId] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  // Estados para Mi Perfil
  const [fullName, setFullName] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Estados para Referidos
  const [referralsCount, setReferralsCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Estados para Retiros
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("bank_transfer");
  const [withdrawalDetails, setWithdrawalDetails] = useState("");
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);

  // CÁLCULOS PARA "MI SALDO"
  const pendingWithdrawalsAmount = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalDeposits = transactions
    .filter((t) => t.type === "deposit" && t.status === "completed")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "withdrawal" && t.status === "completed")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const historyRequestRef = useRef(false);

  const formatAmount = (amount: number) =>
    Number(amount).toLocaleString("es-DO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const transactionLabel = (tx: Transaction) =>
    tx.description ||
    ({
      deposit: "Depósito",
      withdrawal: "Retiro",
      adjustment: "Ajuste",
    }[tx.type] ?? "Movimiento");

  const transactionStatus = (status: string) => {
    if (status === "completed") return "Completado";
    if (status === "rejected") return "Rechazado";
    return "Pendiente";
  };

  const loadHistoryPage = useCallback(
    async (page: number) => {
      if (!userId || page < 0 || historyRequestRef.current) return;

      historyRequestRef.current = true;
      setHistoryLoading(true);

      try {
        const supabase = createClient();
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE;

        const { data, error } = await supabase
          .from("transactions")
          .select("id, type, amount, status, created_at, description")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .range(from, to);

        if (error) {
          console.error("Error al cargar el historial:", error.message);
          alert("No se pudo cargar el historial. Inténtalo de nuevo.");
          return;
        }

        const rows = (data ?? []) as Transaction[];

        setHistoryTransactions(rows.slice(0, PAGE_SIZE));
        setHistoryHasMore(rows.length > PAGE_SIZE);
        setHistoryPage(page);
      } catch (error) {
        console.error("Error inesperado al cargar el historial:", error);
        alert("Ocurrió un error al cargar el historial.");
      } finally {
        historyRequestRef.current = false;
        setHistoryLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const supabase = createClient();
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          router.replace("/");
          return;
        }

        if (!mounted) return;

        const currentUserId = session.user.id;
        setUserId(currentUserId);
        setEmail(session.user.email ?? "");
        setCreatedAt(session.user.created_at ?? "");

        const [
          { data: profileData, error: profileError },
          { data: movements, error: movementsError },
          { count, error: countError },
          { data: refData },
          { data: withdrawalData },
        ] = await Promise.all([
          supabase
            .from("profiles")
            .select("balance, full_name, referral_earnings")
            .eq("id", currentUserId)
            .single(),
          supabase
            .from("transactions")
            .select("id, type, amount, status, created_at, description")
            .eq("user_id", currentUserId)
            .order("created_at", { ascending: false })
            .order("id", { ascending: false })
            .limit(10),
          supabase
            .from("transactions")
            .select("*", { count: "exact", head: true })
            .eq("user_id", currentUserId),
          supabase
            .from("profiles")
            .select("id, full_name, created_at")
            .eq("referred_by", currentUserId),
          supabase
            .from("withdrawals")
            .select("id, amount, method, details, status, created_at")
            .eq("user_id", currentUserId)
            .order("created_at", { ascending: false }),
        ]);

        if (!mounted) return;

        if (!profileError && profileData) {
          setBalance(Number(profileData.balance ?? 0));
          setReferralEarnings(Number(profileData.referral_earnings ?? 0));
          if (profileData.full_name) {
            setFullName(profileData.full_name);
          }
        }

        if (!movementsError && movements) {
          setTransactions(movements as Transaction[]);
        }

        if (!countError) {
          setTotalMovements(count ?? 0);
        }

        if (refData) {
          setReferredUsers(refData as ReferredUser[]);
          setReferralsCount(refData.length);
        }

        if (withdrawalData) {
          setWithdrawals(withdrawalData as WithdrawalRequest[]);
        }
      } catch (err) {
        console.error("Error al verificar la sesión:", err);
      } finally {
        if (mounted) {
          setLoading(false);
          setDataLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (active === "Movimientos" && userId && !loading) {
      void loadHistoryPage(0);
    }
  }, [active, userId, loading, loadHistoryPage]);

  const referralLink = typeof window !== "undefined" && userId
    ? `${window.location.origin}/register?ref=${userId}`
    : userId ? `/register?ref=${userId}` : "";

  function handleCopyReferralLink() {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  async function handleTransactionSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const type = formData.get("type") as string;
    const rawAmount = formData.get("amount") as string;
    const description = formData.get("description") as string;

    const amount = Number(rawAmount);

    if (
      !rawAmount ||
      rawAmount.trim() === "" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isSafeInteger(Math.round(amount * 100))
    ) {
      alert("Introduce un importe válido con un máximo de dos decimales.");
      return;
    }

    if (!description || description.trim() === "" || description.length > 150) {
      alert("La descripción es obligatoria y debe tener hasta 150 caracteres.");
      return;
    }

    setSavingTransaction(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.rpc(
        "create_wallet_transaction",
        {
          p_type: type,
          p_amount: amount,
          p_description: description.trim(),
        }
      );

      if (error) {
        console.error("Error al registrar el movimiento:", error);
        alert(`No se pudo registrar el movimiento: ${error.message}`);
        return;
      }

      const result = data as {
        id: string;
        balance: number | string;
        status: string;
      };

      if (!result || typeof result.balance === "undefined") {
        alert("El movimiento pudo haberse procesado, pero no se recibió el saldo actualizado. Comprueba el historial antes de volver a intentarlo.");
        return;
      }

      setBalance(Number(result.balance));
      form.reset();

      const [
        { data: movements, error: movementsError },
        { count, error: countError },
      ] = await Promise.all([
        supabase
          .from("transactions")
          .select("id, type, amount, status, created_at, description")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .limit(10),

        supabase
          .from("transactions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
      ]);

      if (!movementsError && movements) {
        setTransactions(movements as Transaction[]);
      }

      if (!countError) {
        setTotalMovements(count ?? 0);
      }

      if (active === "Movimientos") {
        await loadHistoryPage(0);
      }

      alert(
        type === "deposit"
          ? "Ingreso registrado correctamente."
          : "Gasto registrado correctamente."
      );
    } catch (error) {
      console.error("Error inesperado al registrar el movimiento:", error);
      alert("Ocurrió un error inesperado. Comprueba el historial antes de reintentar.");
    } finally {
      setSavingTransaction(false);
    }
  }

  async function handleWithdrawalSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(withdrawalAmount);

    if (!withdrawalAmount || !Number.isFinite(amount) || amount <= 0) {
      alert("Introduce un monto de retiro válido.");
      return;
    }

    if (amount > balance) {
      alert("El monto supera tu saldo disponible en la billetera.");
      return;
    }

    if (!withdrawalDetails.trim()) {
      alert("Por favor ingresa los datos de tu cuenta o método de cobro.");
      return;
    }

    setSubmittingWithdrawal(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("withdrawals")
        .insert({
          user_id: userId,
          amount: amount,
          method: withdrawalMethod,
          details: withdrawalDetails.trim(),
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        alert(`Error al solicitar el retiro: ${error.message}`);
        return;
      }

      alert("Solicitud de retiro enviada correctamente. Quedará en estado pendiente de revisión.");
      setWithdrawalAmount("");
      setWithdrawalDetails("");

      setWithdrawals((prev) => [data as WithdrawalRequest, ...prev]);
    } catch (err) {
      console.error("Error inesperado al procesar retiro:", err);
      alert("Ocurrió un error inesperado al enviar la solicitud.");
    } finally {
      setSubmittingWithdrawal(false);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setUpdatingProfile(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("id", userId);

      if (error) {
        alert(`Error al actualizar el perfil: ${error.message}`);
        return;
      }

      alert("Perfil actualizado correctamente.");
    } catch (err) {
      console.error("Error inesperado al actualizar perfil:", err);
      alert("Ocurrió un error inesperado al actualizar el perfil.");
    } finally {
      setUpdatingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      alert("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        alert(`No se pudo actualizar la contraseña: ${error.message}`);
        return;
      }

      alert("Contraseña actualizada exitosamente.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      alert("Ocurrió un error inesperado al cambiar la contraseña.");
    } finally {
      setUpdatingPassword(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setLoggingOut(false);
        alert("No se pudo cerrar la sesión. Inténtalo de nuevo.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setLoggingOut(false);
      alert("No se pudo cerrar la sesión. Inténtalo de nuevo.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        Verificando tu sesión...
      </main>
    );
  }

  function renderTransaction(tx: Transaction) {
    return (
      <div
        key={tx.id}
        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4"
      >
        <div className="min-w-0">
          <p className="break-words font-medium">{transactionLabel(tx)}</p>
          <p className="mt-1 text-xs text-slate-400">
            {new Date(tx.created_at).toLocaleString("es-DO")}
            {" · "}
            {transactionStatus(tx.status)}
          </p>
        </div>

        <p className="shrink-0 font-bold">
          {tx.type === "withdrawal" ? "−" : "+"}
          {"RD$ "}
          {formatAmount(tx.amount)}
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white md:flex">
      <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-[#0b1727] p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <h1 className="mb-2 text-2xl font-black">
          Free<span className="text-emerald-400">mony</span>
        </h1>

        <p className="mb-7 text-sm text-slate-400">
          Tu espacio financiero
        </p>

        <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">
          Menú principal
        </p>

        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-1">
          {menu.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                active === item
                  ? "bg-emerald-400 text-slate-950"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-6 border-t border-white/10 pt-5 md:mt-auto">
          <p className="break-all text-sm font-medium">{email}</p>
          <p className="mt-1 text-xs text-slate-500">Cuenta de usuario</p>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-4 w-full rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5 disabled:opacity-50"
          >
            {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </aside>

      <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">Panel de usuario</p>
            <h2 className="mt-1 text-3xl font-bold">{active}</h2>
          </div>

          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
            Cuenta conectada
          </span>
        </header>

        {active === "Inicio" && (
          <>
            <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-[#103b35] to-[#0b1727] p-6 sm:p-8">
              <p className="text-emerald-100/70">Bienvenido a Freemony</p>
              <h3 className="mt-2 break-all text-xl font-bold">{fullName || email}</h3>
              <p className="mt-3 text-sm text-slate-300">
                Administra y consulta tu espacio personal.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
                <p className="text-sm text-slate-400">Saldo</p>
                <p className="mt-4 text-3xl font-bold">
                  {dataLoading ? "Cargando..." : `RD$ ${formatAmount(balance)}`}
                </p>
                <p className="mt-3 text-xs text-amber-300">
                  Saldo de la billetera
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
                <p className="text-sm text-slate-400">Movimientos</p>
                <p className="mt-4 text-3xl font-bold">
                  {dataLoading ? "..." : totalMovements}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  {dataLoading
                    ? "Consultando base de datos..."
                    : `${totalMovements} movimiento${totalMovements === 1 ? "" : "s"} registrado${totalMovements === 1 ? "" : "s"}`}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
                <p className="text-sm text-slate-400">Referidos</p>
                <p className="mt-4 text-3xl font-bold">
                  {dataLoading ? "..." : referralsCount}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  {referralsCount === 1 ? "1 usuario invitado" : `${referralsCount} usuarios invitados`}
                </p>
              </div>
            </div>

            {/* Integración de la Calculadora de Inversión aquí */}
            <InvestmentCalculator />

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1727] p-6">
              <h3 className="text-lg font-bold">Actividad reciente</h3>

              {dataLoading ? (
                <p className="mt-4 text-sm text-slate-400">
                  Cargando actividad...
                </p>
              ) : transactions.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-white/10 p-6 text-center">
                  <p className="text-slate-300">
                    Todavía no hay movimientos registrados.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Aquí aparecerán tus movimientos cuando se registren.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {transactions.slice(0, 5).map(renderTransaction)}
                </div>
              )}

              <button
                onClick={() => setActive("Movimientos")}
                className="mt-5 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
              >
                Ver todos los movimientos
              </button>
            </div>
          </>
        )}

        {active === "Mi saldo" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-[#0b1727] p-6">
                <p className="text-sm text-slate-400">Saldo disponible</p>
                <p className="mt-4 text-3xl font-bold text-emerald-400">
                  RD$ {formatAmount(balance)}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  Fondos listos para uso o retiro
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
                <p className="text-sm text-slate-400">Retiros pendientes</p>
                <p className="mt-4 text-3xl font-bold text-amber-300">
                  RD$ {formatAmount(pendingWithdrawalsAmount)}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  Solicitudes en proceso de aprobación
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6 sm:col-span-2 xl:col-span-1">
                <p className="text-sm text-slate-400">Ganancias acumuladas (Referidos)</p>
                <p className="mt-4 text-3xl font-bold text-white">
                  RD$ {formatAmount(referralEarnings)}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  Sumado automáticamente a tu cuenta
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
              <h3 className="text-lg font-bold">Resumen de ingresos y gastos</h3>
              <p className="mt-1 text-sm text-slate-400">
                Totales calculados según tus transacciones confirmadas.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/20 bg-[#07111f] p-4">
                  <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">Total Ingresos</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    +RD$ {formatAmount(totalDeposits)}
                  </p>
                </div>

                <div className="rounded-xl border border-red-500/20 bg-[#07111f] p-4">
                  <p className="text-xs text-red-400 uppercase tracking-wider font-semibold">Total Gastos</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    −RD$ {formatAmount(totalExpenses)}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Proporción de balance</span>
                  <span>
                    {totalDeposits > 0
                      ? `${Math.round(((totalDeposits - totalExpenses) / totalDeposits) * 100)}% retenido`
                      : "0%"}
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-[#07111f] overflow-hidden flex">
                  <div
                    className="bg-emerald-400 h-full transition-all"
                    style={{
                      width: `${
                        totalDeposits + totalExpenses > 0
                          ? (totalDeposits / (totalDeposits + totalExpenses)) * 100
                          : 100
                      }%`,
                    }}
                  />
                  <div
                    className="bg-red-400 h-full transition-all"
                    style={{
                      width: `${
                        totalDeposits + totalExpenses > 0
                          ? (totalExpenses / (totalDeposits + totalExpenses)) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {active === "Registrar movimiento" && (
          <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
            <h3 className="text-lg font-bold">Registrar movimiento</h3>

            <p className="mt-2 text-sm text-slate-400">
              Formulario de ingresos y gastos.
            </p>

            <form
              className="mt-6 space-y-4"
              onSubmit={handleTransactionSubmit}
            >
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Tipo de movimiento
                </label>

                <select
                  name="type"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-white"
                  defaultValue="deposit"
                >
                  <option value="deposit">Ingreso</option>
                  <option value="withdrawal">Gasto</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Importe (RD$)
                </label>

                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="Ej. 500.00"
                  className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Descripción
                </label>

                <input
                  name="description"
                  type="text"
                  maxLength={150}
                  required
                  placeholder="Ej. Ingreso personal"
                  className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-white"
                />
              </div>

              <button
                type="submit"
                disabled={savingTransaction}
                className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingTransaction
                  ? "Guardando..."
                  : "Registrar movimiento"}
              </button>

              <p className="text-xs text-slate-400">
                Los movimientos se registran mediante una operación segura
                en Supabase.
              </p>
            </form>
          </div>
        )}

        {active === "Movimientos" && (
          <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">Historial de movimientos</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Total registrado: {totalMovements}
                </p>
              </div>

              <button
                onClick={() => void loadHistoryPage(historyPage)}
                disabled={historyLoading}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
              >
                Actualizar
              </button>
            </div>

            {historyLoading ? (
              <p className="mt-5 text-sm text-slate-400">
                Cargando movimientos...
              </p>
            ) : historyTransactions.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-white/10 p-6 text-center">
                <p className="text-slate-300">
                  Todavía no hay movimientos registrados.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Tus movimientos aparecerán aquí cuando se registren.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {historyTransactions.map(renderTransaction)}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => void loadHistoryPage(historyPage - 1)}
                disabled={historyLoading || historyPage === 0}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-40"
              >
                Anterior
              </button>

              <span className="text-sm text-slate-400">
                Página {historyPage + 1}
              </span>

              <button
                onClick={() => void loadHistoryPage(historyPage + 1)}
                disabled={historyLoading || !historyHasMore}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {active === "Retiros" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
              <h3 className="text-lg font-bold">Solicitar un retiro</h3>
              <p className="mt-1 text-sm text-slate-400">
                Saldo disponible para retirar:{" "}
                <span className="font-bold text-emerald-400">
                  RD$ {formatAmount(balance)}
                </span>
              </p>

              <form onSubmit={handleWithdrawalSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Monto a retirar (RD$)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    max={balance}
                    step="0.01"
                    required
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Método de retiro
                  </label>
                  <select
                    value={withdrawalMethod}
                    onChange={(e) => setWithdrawalMethod(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-white"
                  >
                    <option value="bank_transfer">Transferencia bancaria</option>
                    <option value="crypto">Criptomonedas</option>
                    <option value="cash">Efectivo / Otro</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Detalles de la cuenta (Banco, No. de cuenta, etc.)
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={withdrawalDetails}
                    onChange={(e) => setWithdrawalDetails(e.target.value)}
                    placeholder="Ej. Banco Popular, Cuenta corriente: 123456789"
                    className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingWithdrawal}
                  className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-50"
                >
                  {submittingWithdrawal ? "Enviando solicitud..." : "Solicitar retiro"}
                </button>
              </form>
            </div>

            {/* Listado de Retiros Anteriores */}
            <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
              <h3 className="text-lg font-bold mb-4">Mis solicitudes de retiro</h3>
              {withdrawals.length === 0 ? (
                <p className="text-sm text-slate-400">No has realizado solicitudes de retiro.</p>
              ) : (
                <div className="space-y-3">
                  {withdrawals.map((w) => (
                    <div key={w.id} className="border border-white/10 p-4 rounded-xl flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <p className="font-bold text-emerald-400">RD$ {formatAmount(w.amount)}</p>
                        <p className="text-xs text-slate-400">{w.details} ({w.method})</p>
                        <p className="text-[10px] text-slate-500">{new Date(w.created_at).toLocaleString("es-DO")}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        w.status === "completed" ? "bg-emerald-500/20 text-emerald-300" :
                        w.status === "rejected" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"
                      }`}>
                        {w.status === "completed" ? "Completado" : w.status === "rejected" ? "Rechazado" : "Pendiente"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {active === "Referidos" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
              <h3 className="text-lg font-bold">Invita y gana</h3>
              <p className="mt-1 text-sm text-slate-400">
                Comparte tu enlace personal de referido para invitar a otras personas a Freemony.
              </p>

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-sm text-slate-300"
                />
                <button
                  onClick={handleCopyReferralLink}
                  className="shrink-0 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300"
                >
                  {copiedLink ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
              <h3 className="text-lg font-bold mb-4">Usuarios referidos ({referredUsers.length})</h3>
              {referredUsers.length === 0 ? (
                <p className="text-sm text-slate-400">Aún no tienes usuarios registrados con tu link.</p>
              ) : (
                <div className="space-y-3">
                  {referredUsers.map((u) => (
                    <div key={u.id} className="border border-white/10 p-4 rounded-xl flex justify-between items-center">
                      <p className="font-medium">{u.full_name || "Usuario de Freemony"}</p>
                      <p className="text-xs text-slate-400">{new Date(u.created_at).toLocaleDateString("es-DO")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {active === "Mi perfil" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
              <h3 className="text-lg font-bold">Datos personales</h3>
              <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Correo electrónico</label>
                  <input
                    type="text"
                    disabled
                    value={email}
                    className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Nombre completo</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="rounded-xl bg-emerald-400 px-5 py-2.5 font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-50 text-sm"
                >
                  {updatingProfile ? "Guardando..." : "Actualizar perfil"}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b1727] p-6">
              <h3 className="text-lg font-bold">Cambiar contraseña</h3>
              <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Nueva contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full rounded-xl border border-white/10 bg-[#07111f] p-3 text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="rounded-xl border border-white/10 px-5 py-2.5 font-bold text-white hover:bg-white/5 disabled:opacity-50 text-sm"
                >
                  {updatingPassword ? "Actualizando..." : "Actualizar contraseña"}
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}