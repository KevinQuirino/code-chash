import { useState } from 'react'

type CorteCajaModalProps = {
  onClose: () => void
  onComplete: () => void
  datosTurno: {
    fondoInicial: number
    ventasEfectivo: number
    salidasEfectivo: number
    efectivoEsperado: number
  }
}

export default function CorteCajaModal({ onClose, onComplete, datosTurno }: CorteCajaModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  
  // Step 2: Physical Count
  const [efectivoContado, setEfectivoContado] = useState<number | ''>('')
  
  // Step 3: PIN
  const [pin, setPin] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const diferencia = Number(efectivoContado) - datosTurno.efectivoEsperado

  // Traffic light colors
  let bgColor = 'bg-green-50 dark:bg-green-950/30'
  let textColor = 'text-green-700 dark:text-green-400'
  let borderColor = 'border-green-200 dark:border-green-900/50'
  let icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>

  if (Math.abs(diferencia) > 0 && Math.abs(diferencia) <= 5) {
    bgColor = 'bg-yellow-50 dark:bg-yellow-950/30'
    textColor = 'text-yellow-700 dark:text-yellow-400'
    borderColor = 'border-yellow-200 dark:border-yellow-900/50'
    icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  } else if (Math.abs(diferencia) > 5) {
    bgColor = 'bg-red-50 dark:bg-red-950/30'
    textColor = 'text-red-700 dark:text-red-400'
    borderColor = 'border-red-200 dark:border-red-900/50'
    icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
  }

  const printTicket = () => {
    const receiptContent = `
      <html>
        <head>
          <title>Corte de Caja - Code Cash</title>
          <style>
            body { font-family: monospace; padding: 20px; color: black; font-size: 14px; max-width: 300px; margin: 0 auto; }
            .center { text-align: center; }
            .flex { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .divider { border-bottom: 1px dashed black; margin: 15px 0; }
            .bold { font-weight: bold; }
            h2 { margin: 0 0 5px 0; font-size: 20px; }
            p { margin: 0 0 10px 0; }
          </style>
        </head>
        <body>
          <div class="center">
            <h2>CORTE DE CAJA</h2>
            <p>Code Cash</p>
            <p>${new Date().toLocaleString()}</p>
          </div>
          <div class="divider"></div>
          <div class="flex">
            <span>Fondo Inicial</span>
            <span>$${datosTurno.fondoInicial.toFixed(2)}</span>
          </div>
          <div class="flex">
            <span>Ventas Efectivo</span>
            <span>+$${datosTurno.ventasEfectivo.toFixed(2)}</span>
          </div>
          <div class="flex">
            <span>Salidas/Gastos</span>
            <span>-$${datosTurno.salidasEfectivo.toFixed(2)}</span>
          </div>
          <div class="divider"></div>
          <div class="flex bold">
            <span>EFECTIVO ESPERADO</span>
            <span>$${datosTurno.efectivoEsperado.toFixed(2)}</span>
          </div>
          <div class="flex">
            <span>Efectivo Contado</span>
            <span>$${Number(efectivoContado).toFixed(2)}</span>
          </div>
          <div class="flex bold" style="margin-top: 10px;">
            <span>DIFERENCIA</span>
            <span>$${diferencia.toFixed(2)}</span>
          </div>
          <div class="divider"></div>
          <p class="center" style="margin-top: 30px;">_________________________</p>
          <p class="center">Firma Cajero (PIN: ****)</p>
          <p class="center" style="margin-top: 20px;">Turno Cerrado Exitosamente</p>
        </body>
      </html>
    `

    const printWindow = window.open('', '', 'width=400,height=600')
    if (printWindow) {
      printWindow.document.write(receiptContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
        onComplete()
      }, 250)
    }
  }

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === '1234') {
      setIsProcessing(true)
      setTimeout(() => {
        printTicket()
      }, 1000)
    } else {
      alert('PIN Incorrecto. El PIN de demostración es 1234.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1c1e] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Corte de Caja</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cierre de turno y auditoría de efectivo.</p>
          </div>
          {!isProcessing && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-slate-50 dark:bg-[#25282d] p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Fondo Inicial (Apertura)</span>
                  <span className="font-medium text-slate-900 dark:text-white">${datosTurno.fondoInicial.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Ventas en Efectivo</span>
                  <span className="font-medium text-green-600 dark:text-green-400">+${datosTurno.ventasEfectivo.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Salidas / Gastos</span>
                  <span className="font-medium text-red-600 dark:text-red-400">-${datosTurno.salidasEfectivo.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-lg">
                  <span className="text-slate-900 dark:text-white">Efectivo Esperado</span>
                  <span className="text-blue-600 dark:text-blue-400">${datosTurno.efectivoEsperado.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-2"
              >
                Siguiente: Conteo Físico
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="text-center">
                <p className="text-slate-500 dark:text-slate-400 mb-2 font-medium">¿Cuánto efectivo hay en el cajón?</p>
                <div className="relative max-w-xs mx-auto">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0"
                    value={efectivoContado}
                    onChange={(e) => setEfectivoContado(e.target.value ? Number(e.target.value) : '')}
                    className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-[#151618] border-2 border-blue-500 rounded-xl text-3xl font-black text-slate-900 dark:text-white text-center focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition"
                    autoFocus
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <button 
                disabled={efectivoContado === ''}
                onClick={() => setStep(3)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Auditar Diferencia
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleFinish} className="space-y-6 animate-in slide-in-from-right-4">
              
              <div className={`p-5 rounded-xl border flex items-center gap-4 ${bgColor} ${borderColor} transition-colors`}>
                <div className={`p-3 bg-white dark:bg-[#1a1c1e] rounded-full shadow-sm ${textColor}`}>
                  {icon}
                </div>
                <div>
                  <p className={`font-bold ${textColor}`}>
                    {diferencia === 0 ? 'Corte Exacto' : diferencia > 0 ? 'Sobrante detectado' : 'Faltante detectado'}
                  </p>
                  <p className={`text-2xl font-black ${textColor}`}>
                    {diferencia > 0 ? '+' : ''}{diferencia.toFixed(2)}
                  </p>
                </div>
              </div>

              {!isProcessing ? (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Ingresa tu NIP para firmar e imprimir ticket</p>
                  <div className="flex justify-center mb-6">
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-40 tracking-[1em] text-center px-4 py-3 bg-slate-50 dark:bg-[#151618] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-2xl font-black"
                      placeholder="••••"
                      required
                      autoFocus
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={pin.length < 4}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 font-bold py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    Firmar e Imprimir
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Imprimiendo Ticket...</p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
