import { useState } from 'react'

type StartingCashModalProps = {
  themeMode: 'light' | 'dark'
  onSubmit: (amount: number) => void
}

export default function StartingCashModal({ themeMode, onSubmit }: StartingCashModalProps) {
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!isNaN(value) && value >= 0) {
      onSubmit(value)
    }
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm ${themeMode === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#151618]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Apertura de Caja</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Ingresa el capital inicial en efectivo con el que comenzará el turno.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 text-center">Efectivo Inicial</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none text-slate-400 dark:text-slate-500 font-bold text-2xl">
                $
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#151618] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition text-3xl font-black text-center"
                placeholder="0.00"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-xl transition flex items-center justify-center gap-2 text-lg"
          >
            Abrir Caja
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </form>
      </div>
    </div>
  )
}
