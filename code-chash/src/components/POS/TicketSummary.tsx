import { useState } from 'react'
import type { ItemTicket, Cliente } from '../../types'

type TicketSummaryProps = {
  items: ItemTicket[]
  onClear: () => void
  cliente?: Cliente | null
  onRemoveCliente?: () => void
}

export default function TicketSummary({ items, onClear, cliente, onRemoveCliente }: TicketSummaryProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [pinStep, setPinStep] = useState(false)
  const [pin, setPin] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = items.reduce((total, item) => total + item.total, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setPinStep(false)
    setPin('')
  }

  const processPayment = (method: 'Cash' | 'Card') => {
    setIsProcessing(true)
    // Simulate short network delay for card
    setTimeout(() => {
      setIsProcessing(false)
      // Generate and print receipt
      const receiptContent = `
        <html>
          <head>
            <title>Receipt - Code Cash</title>
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
              <h2>Code Cash</h2>
              <p>Tu negocio, bajo control</p>
              <p>${new Date().toLocaleString()}</p>
            </div>
            <div class="divider"></div>
            ${items.map(item => `
              <div class="flex">
                <span>${item.cantidad}x ${item.nombre}</span>
                <span>$${item.total.toFixed(2)}</span>
              </div>
            `).join('')}
            <div class="divider"></div>
            <div class="flex">
              <span>Subtotal</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="flex">
              <span>Tax (8%)</span>
              <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="divider"></div>
            <div class="flex bold" style="font-size: 18px;">
              <span>TOTAL</span>
              <span>$${total.toFixed(2)}</span>
            </div>
            <div class="divider"></div>
            <div class="flex">
              <span>Payment Method</span>
              <span>${method}</span>
            </div>
            <div class="divider"></div>
            <p class="center">Thank you for your purchase!</p>
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
          onClear()
          closePaymentModal()
        }, 250)
      }
    }, method === 'Card' ? 1000 : 0)
  }

  const handlePayment = (method: 'Cash' | 'Card') => {
    if (method === 'Card' && total > 100) {
      setPinStep(true)
      return
    }
    processPayment(method)
  }

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin.length >= 4) {
      processPayment('Card')
    }
  }

  return (
    <>
      <section className="flex flex-col h-full bg-slate-50 dark:bg-[#1a1c1e] text-slate-900 dark:text-slate-100 p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Current Order</h2>
          <button
            type="button"
            onClick={onClear}
            className="p-2 rounded-lg bg-slate-200 dark:bg-[#2a2d32] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300 dark:hover:bg-[#3a3d42] transition"
            aria-label="Clear order"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>

        {cliente && (
          <div className="mb-4 flex items-center justify-between bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 p-3 rounded-xl animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span className="font-bold text-sm">{cliente.nombre}</span>
            </div>
            {onRemoveCliente && (
              <button onClick={onRemoveCliente} className="text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-300 transition" aria-label="Remove Customer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4">
          {items.map((item) => (
            <div
              key={item.productoId}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-200 dark:bg-[#2a2d32] text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.cantidad}
                </span>
                <p className="font-medium text-slate-900 dark:text-slate-200">{item.nombre}</p>
              </div>
              <p className="font-bold text-slate-900 dark:text-slate-200">
                ${item.total.toFixed(2)}
              </p>
            </div>
          ))}
          {items.length === 0 && (
            <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
              <p>No items in current order.</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 space-y-3">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mt-4 border-t border-slate-200 dark:border-slate-800 pt-6">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">Total</span>
            <span className="text-4xl font-extrabold text-green-600 dark:text-[#00e676]">
              ${total.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="mt-6 w-full flex items-center justify-center gap-3 rounded-xl bg-green-500 dark:bg-[#00e676] px-6 py-4 text-[17px] font-bold text-white dark:text-black transition hover:bg-green-600 dark:hover:bg-[#00c853] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={items.length === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            Complete Payment
          </button>
        </div>
      </section>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {pinStep ? 'Ingresar NIP' : 'Payment Method'}
              </h3>
              {!isProcessing && (
                <button 
                  onClick={closePaymentModal}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            <div className="p-6">
              {!pinStep ? (
                <>
                  <div className="text-center mb-6">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total to Pay</p>
                    <p className="text-4xl font-extrabold text-green-600 dark:text-[#00e676] mt-1">${total.toFixed(2)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handlePayment('Cash')}
                      className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-[#25282d] border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2a2d32] hover:border-slate-300 dark:hover:border-slate-600 transition"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">Efectivo</span>
                    </button>
                    <button
                      onClick={() => handlePayment('Card')}
                      className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 dark:bg-[#25282d] border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-[#2a2d32] hover:border-slate-300 dark:hover:border-slate-600 transition"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">Tarjeta</span>
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handlePinSubmit} className="flex flex-col items-center">
                  <p className="text-slate-600 dark:text-slate-300 text-center mb-6 font-medium">
                    {isProcessing ? 'Procesando pago...' : 'Compra mayor a $100. Por favor, ingresa tu NIP.'}
                  </p>
                  
                  {!isProcessing ? (
                    <>
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-32 tracking-[1em] text-center px-4 py-3 bg-slate-50 dark:bg-[#151618] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-2xl font-black mb-6"
                        placeholder="••••"
                        required
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={pin.length < 4}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Aceptar
                      </button>
                    </>
                  ) : (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
