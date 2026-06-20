import { useState } from 'react'
import type { Producto } from '../../types'

type QuantityModalProps = {
  producto: Producto
  themeMode: 'light' | 'dark'
  onClose: () => void
  onAdd: (producto: Producto, cantidad: number) => void
}

export default function QuantityModal({ producto, themeMode, onClose, onAdd }: QuantityModalProps) {
  const [cantidad, setCantidad] = useState(1)

  const handleDecrease = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1)
    }
  }

  const handleIncrease = () => {
    setCantidad(cantidad + 1)
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md p-4 ${themeMode === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-[#1a1c1e] w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Añadir Producto</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{producto.nombre}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">${producto.precios.venta_normal.toFixed(2)}</p>
              {producto.cantidadMayoreo && producto.precios.venta_mayoreo && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  A partir de {producto.cantidadMayoreo} uds: ${producto.precios.venta_mayoreo.toFixed(2)} c/u
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={handleDecrease}
              disabled={cantidad <= 1}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-[#2a2d32] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#3a3d42] disabled:opacity-50 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span className="text-3xl font-bold text-slate-900 dark:text-white w-16 text-center">
              {cantidad}
            </span>
            <button
              onClick={handleIncrease}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-[#2a2d32] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#3a3d42] transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>

          <button
            onClick={() => onAdd(producto, cantidad)}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition text-lg"
          >
            Añadir {cantidad} a la orden
          </button>
        </div>
      </div>
    </div>
  )
}
