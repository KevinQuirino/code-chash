import { useState, useEffect, useRef } from 'react'
import type { Cliente } from '../../types'

type CustomerSearchModalProps = {
  onClose: () => void
  onSelectCustomer: (cliente: Cliente) => void
  onSkip: () => void
  clientesDb: Cliente[]
  onRegisterCustomer: (cliente: Cliente) => void
}

export default function CustomerSearchModal({
  onClose,
  onSelectCustomer,
  onSkip,
  clientesDb,
  onRegisterCustomer
}: CustomerSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  
  // Registration Form
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  // Debounce logic
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timerId)
  }, [searchTerm])

  useEffect(() => {
    if (!isRegistering) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [isRegistering])

  const foundCustomer = clientesDb.find(c => 
    c.telefono === debouncedTerm || 
    c.telefono.replace(/\D/g, '') === debouncedTerm.replace(/\D/g, '')
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onSkip()
    } else if (e.key === 'Enter' && foundCustomer) {
      onSelectCustomer(foundCustomer)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aceptaPrivacidad) return;
    
    const nuevoCliente: Cliente = {
      id: `cli_${Date.now()}`,
      telefono: searchTerm,
      nombre,
      correo,
      aceptaPrivacidad,
      fechaRegistro: new Date()
    }
    onRegisterCustomer(nuevoCliente)
    onSelectCustomer(nuevoCliente)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1c1e] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col transform transition-all animate-in zoom-in-95">
        
        <div className="p-6 text-center border-b border-slate-100 dark:border-slate-800 relative">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Identificación de Cliente</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Busca por teléfono o registra un cliente nuevo.</p>
          <button onClick={onClose} className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-6">
          {!isRegistering ? (
            <div className="space-y-6">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <input
                  ref={searchInputRef}
                  type="tel"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Número de teléfono (ej. 555-1234)"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-[#151618] border-2 border-slate-200 dark:border-slate-700 rounded-xl text-lg font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              {debouncedTerm && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  {foundCustomer ? (
                    <div className="p-4 rounded-xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                          {foundCustomer.nombre.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900 dark:text-white">{foundCustomer.nombre}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Cliente Frecuente</p>
                        </div>
                        <button 
                          onClick={() => onSelectCustomer(foundCustomer)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition shadow-md"
                        >
                          Asignar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20 text-center">
                      <p className="text-orange-800 dark:text-orange-400 font-medium mb-3">No hay cliente con este número.</p>
                      <button 
                        onClick={() => setIsRegistering(true)}
                        className="w-full px-4 py-3 bg-white dark:bg-[#1a1c1e] text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 font-bold rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/40 transition shadow-sm"
                      >
                        + Registrar nuevo cliente
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">O</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              <button 
                onClick={onSkip}
                className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#25282d] dark:hover:bg-[#2a2d32] text-slate-700 dark:text-slate-300 font-bold rounded-xl transition"
              >
                Venta como Invitado
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 animate-in slide-in-from-right-4">
              <p className="font-semibold text-slate-900 dark:text-white mb-4">Registro Rápido ({searchTerm})</p>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                <input 
                  required 
                  type="text" 
                  value={nombre} 
                  onChange={e => setNombre(e.target.value)} 
                  className="w-full px-3 py-3 bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" 
                  placeholder="Ej. María García" 
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Correo (Opcional)</label>
                <input 
                  type="email" 
                  value={correo} 
                  onChange={e => setCorreo(e.target.value)} 
                  className="w-full px-3 py-3 bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" 
                  placeholder="Para envío de tickets" 
                />
              </div>

              <label className="flex items-start gap-3 p-3 border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 rounded-xl cursor-pointer mt-2">
                <input 
                  type="checkbox" 
                  checked={aceptaPrivacidad} 
                  onChange={e => setAceptaPrivacidad(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  El cliente acepta los <a href="#" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">términos de privacidad</a> y tratamiento de datos personales para su fidelización.
                </span>
              </label>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsRegistering(false)} className="px-4 py-3 flex-1 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  Atrás
                </button>
                <button type="submit" disabled={!aceptaPrivacidad || !nombre.trim()} className="px-4 py-3 flex-[2] rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
                  Guardar y Asignar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
