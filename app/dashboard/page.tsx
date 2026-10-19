// Componente de Calculadora de Inversión
function InvestmentCalculator() {
  const [amount, setAmount] = useState<number>(10000);
  const [days, setDays] = useState<number>(30); // Cambiado a días para mayor precisión

  // Tasa de ganancia diaria: 15% (0.15) sobre el capital invertido
  const dailyRate = 0.15;
  const estimatedProfit = amount * dailyRate * days;
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
              Plazo (días): <span className="font-bold text-emerald-400">{days} días</span>
            </label>
            <input
              type="range"
              min="1"
              max="180"
              step="1"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
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
              <span className="text-slate-400">Rendimiento diario (15%):</span>
              <span className="font-semibold text-emerald-400">RD$ {formatCalcAmount(amount * dailyRate)} / día</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Ganancia estimada ({days} días):</span>
              <span className="font-semibold text-emerald-400">+ RD$ {formatCalcAmount(estimatedProfit)}</span>
            </div>
            <hr className="border-white/10 my-2" />
            <div className="flex justify-between text-base font-bold">
              <span>Total al finalizar:</span>
              <span className="text-emerald-400">RD$ {formatCalcAmount(totalReturn)}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 mt-4 text-center">
            * Cálculo basado en un rendimiento del 15% diario sobre la inversión.
          </p>
        </div>
      </div>
    </div>
  );
}