import { useState } from 'react'
import type { Producto, Categoria } from '../../types'
import AddProductModal from './AddProductModal'

type InventoryProps = {
  productos: Producto[]
  setProductos: React.Dispatch<React.SetStateAction<Producto[]>>
  categorias: Categoria[]
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>
}

export default function Inventory({ productos, setProductos, categorias, setCategorias }: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredData = productos.filter(
    (item) =>
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate stock carefully since kits don't have direct stock
  const totalStock = productos.reduce((sum, item) => sum + (item.tipo_unidad === 'kit' ? 0 : item.stock_actual), 0)
  const totalValue = productos.reduce((sum, item) => sum + (item.tipo_unidad === 'kit' ? 0 : item.stock_actual * item.precios.costo), 0)

  const handleSaveProduct = (newProduct: Producto) => {
    setProductos((prev) => [...prev, newProduct])
    setIsAddModalOpen(false)
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 h-full overflow-y-auto bg-slate-50 dark:bg-[#111214] transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inventario de Cafetería</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestión de stock y productos disponibles.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 dark:bg-[#3b82f6] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Product
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            className="w-full bg-white dark:bg-[#1a1c1e] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
            placeholder="Buscar productos o Barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-[#1a1c1e] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#25282d] rounded-xl text-sm font-bold transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-[#1e2023] text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Barcode</th>
                <th className="px-6 py-4">Precio Venta</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredData.map((item) => {
                // Calculate stock for display. For kits, we show N/A or compute it
                let displayStock = item.stock_actual;
                if (item.tipo_unidad === 'kit') {
                  displayStock = item.componentes_kit ? Math.min(...item.componentes_kit.map(c => {
                    const pb = productos.find(p => p.id === c.producto_id);
                    return pb ? Math.floor(pb.stock_actual / c.cantidad) : 0;
                  })) : 0;
                }
                
                const isKit = item.tipo_unidad === 'kit';
                const isLowStock = displayStock <= item.stock_minimo_alerta;
                const isOutOfStock = displayStock === 0;

                return (
                  <tr key={item.id} className={`transition ${isOutOfStock ? 'bg-red-50 dark:bg-red-950/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-[#2a2d32] flex items-center justify-center text-slate-500 shrink-0">
                        {isKit ? '📦' : '☕'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-200">{item.nombre}</p>
                        <p className="text-xs text-slate-500">{item.categoria} {isKit && '(Kit)'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{item.barcode}</td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-200 font-bold">${item.precios.venta_normal.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border ${!isLowStock && !isOutOfStock
                        ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                        : !isOutOfStock
                          ? 'bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/50'
                          : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${!isLowStock && !isOutOfStock
                          ? 'bg-emerald-500 dark:bg-emerald-400'
                          : !isOutOfStock
                            ? 'bg-orange-500 dark:bg-orange-400'
                            : 'bg-red-500 dark:bg-red-400'
                          }`}></span>
                        {isOutOfStock ? 'Agotado' : (isLowStock ? 'Bajo stock' : 'En stock')} ({displayStock})
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Stock Total (Pzs/Gr)</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalStock}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Valor del Inventario (Costo)</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">${totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Categorías</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{new Set(productos.map(item => item.categoria)).size}</p>
        </div>
      </div>

      {isAddModalOpen && (
        <AddProductModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSave={handleSaveProduct} 
          todosLosProductos={productos}
          categorias={categorias}
          setCategorias={setCategorias}
        />
      )}
    </div>
  )
}
