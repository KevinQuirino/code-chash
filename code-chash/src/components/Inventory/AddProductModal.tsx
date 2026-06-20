import { useState, useRef, useEffect } from 'react'
import type { Producto, TipoUnidad, ComponenteKit, Categoria } from '../../types'

type AddProductModalProps = {
  onClose: () => void
  onSave: (product: Producto) => void
  todosLosProductos: Producto[] // For kit selection
  categorias: Categoria[]
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>
}

export default function AddProductModal({ onClose, onSave, todosLosProductos, categorias, setCategorias }: AddProductModalProps) {
  const [tipoUnidad, setTipoUnidad] = useState<TipoUnidad>('pieza')
  const barcodeRef = useRef<HTMLInputElement>(null)

  // Form states
  const [barcode, setBarcode] = useState('')
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [categoria, setCategoria] = useState('')
  
  // Category creation states
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryIcon, setNewCategoryIcon] = useState('📦')
  const [costo, setCosto] = useState<number | ''>('')
  const [ventaNormal, setVentaNormal] = useState<number | ''>('')
  const [ventaMayoreo, setVentaMayoreo] = useState<number | ''>('')
  
  const [stockActual, setStockActual] = useState<number | ''>('')
  const [stockMinimo, setStockMinimo] = useState<number | ''>('')
  
  const [iva, setIva] = useState<number>(0.16)
  const [ieps, setIeps] = useState<number>(0)
  
  const [componentesKit, setComponentesKit] = useState<ComponenteKit[]>([])

  // Kit selector states
  const [selectedCompId, setSelectedCompId] = useState('')
  const [selectedCompQty, setSelectedCompQty] = useState<number | ''>('')

  useEffect(() => {
    // Auto-focus barcode on mount
    barcodeRef.current?.focus()
  }, [])

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // Move focus to next field (nombre)
      document.getElementById('input-nombre')?.focus()
    }
  }

  const handleAddComponent = () => {
    if (selectedCompId && selectedCompQty && selectedCompQty > 0) {
      setComponentesKit([...componentesKit, { producto_id: selectedCompId, cantidad: Number(selectedCompQty) }])
      setSelectedCompId('')
      setSelectedCompQty('')
    }
  }

  const handleRemoveComponent = (id: string) => {
    setComponentesKit(componentesKit.filter(c => c.producto_id !== id))
  }

  const handleSaveNewCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat: Categoria = {
      id: `cat_${Date.now()}`,
      nombre: newCategoryName.trim(),
      icono: newCategoryIcon,
      orden: categorias.length + 1
    };
    setCategorias([...categorias, newCat]);
    setCategoria(newCat.nombre);
    setIsCreatingCategory(false);
    setNewCategoryName('');
    setNewCategoryIcon('📦');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Auto calculate cost if kit
    let calculatedCost = Number(costo);
    if (tipoUnidad === 'kit') {
      calculatedCost = componentesKit.reduce((sum, comp) => {
        const prod = todosLosProductos.find(p => p.id === comp.producto_id);
        return sum + (prod ? prod.precios.costo * comp.cantidad : 0);
      }, 0);
    }

    const newProduct: Producto = {
      id: `p_${Date.now()}`,
      barcode,
      nombre,
      descripcion,
      categoria: categoria || 'Sin categoría',
      tipo_unidad: tipoUnidad,
      precios: {
        costo: calculatedCost,
        venta_normal: Number(ventaNormal),
        venta_mayoreo: Number(ventaMayoreo) || Number(ventaNormal),
      },
      stock_actual: tipoUnidad === 'kit' ? 0 : Number(stockActual),
      stock_minimo_alerta: tipoUnidad === 'kit' ? 0 : Number(stockMinimo),
      tasa_impuesto_iva: iva,
      tasa_impuesto_ieps: ieps,
      componentes_kit: tipoUnidad === 'kit' ? componentesKit : undefined,
      imagen: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80', // Default image
    }

    onSave(newProduct)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1c1e] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#1a1c1e] z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nuevo Producto</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Registra un artículo en el inventario.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <form id="add-product-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Tipo Unidad */}
            <div className="bg-slate-50 dark:bg-[#151618] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Tipo de Unidad</label>
              <div className="grid grid-cols-3 gap-3">
                {(['pieza', 'granel', 'kit'] as const).map(tipo => (
                  <label key={tipo} className={`cursor-pointer rounded-lg border-2 p-3 text-center transition ${tipoUnidad === tipo ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-200 dark:hover:border-blue-900'}`}>
                    <input type="radio" name="tipoUnidad" value={tipo} checked={tipoUnidad === tipo} onChange={() => setTipoUnidad(tipo)} className="sr-only" />
                    <span className="font-bold capitalize">{tipo}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* General Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Código de Barras (Barcode)</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/></svg>
                  <input ref={barcodeRef} required type="text" value={barcode} onChange={e => setBarcode(e.target.value)} onKeyDown={handleBarcodeKeyDown} className="w-full pl-10 pr-3 py-2 bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" placeholder="Escanea el código..." />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Producto</label>
                <input id="input-nombre" required type="text" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" placeholder="Ej: Coca Cola 600ml" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción (Opcional)</label>
                <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" placeholder="Descripción breve del artículo" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                {!isCreatingCategory ? (
                  <select 
                    required 
                    value={categoria} 
                    onChange={e => {
                      if (e.target.value === 'CREATE_NEW') {
                        setIsCreatingCategory(true)
                        setCategoria('')
                      } else {
                        setCategoria(e.target.value)
                      }
                    }} 
                    className="w-full px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  >
                    <option value="">-- Seleccionar --</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.nombre}>{cat.icono} {cat.nombre}</option>
                    ))}
                    <option value="CREATE_NEW" className="font-bold text-blue-600 dark:text-blue-400">+ Crear Nueva Categoría...</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={newCategoryIcon} 
                      onChange={e => setNewCategoryIcon(e.target.value)} 
                      className="w-12 px-2 py-2 text-center bg-white dark:bg-[#1a1c1e] border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" 
                      placeholder="Icon" 
                      title="Emoji Icon"
                    />
                    <input 
                      type="text" 
                      value={newCategoryName} 
                      onChange={e => setNewCategoryName(e.target.value)} 
                      className="flex-1 px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" 
                      placeholder="Nombre de categoría" 
                      autoFocus
                    />
                    <button type="button" onClick={handleSaveNewCategory} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" title="Guardar Categoría">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                    <button type="button" onClick={() => setIsCreatingCategory(false)} className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition" title="Cancelar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory / Kit Configuration */}
            {tipoUnidad !== 'kit' ? (
              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/50">
                <h3 className="font-bold text-orange-800 dark:text-orange-400 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  Control de Inventario
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Stock Actual {tipoUnidad === 'granel' ? '(Kg/Lt)' : '(Pzs)'}</label>
                    <input required type="number" step={tipoUnidad === 'granel' ? '0.001' : '1'} min="0" value={stockActual} onChange={e => setStockActual(e.target.value ? Number(e.target.value) : '')} className="w-full px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-orange-200 dark:border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Alerta Mínima</label>
                    <input required type="number" step={tipoUnidad === 'granel' ? '0.001' : '1'} min="0" value={stockMinimo} onChange={e => setStockMinimo(e.target.value ? Number(e.target.value) : '')} className="w-full px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-orange-200 dark:border-orange-800 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 dark:text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/50">
                <h3 className="font-bold text-purple-800 dark:text-purple-400 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"/><polyline points="2.32 6.16 12 11 21.68 6.16"/><line x1="12" y1="22.76" x2="12" y2="11"/></svg>
                  Componentes del Kit
                </h3>
                <p className="text-sm text-purple-600/80 dark:text-purple-400/80 mb-4">El costo y existencia de este kit se calculará en base a los productos agregados.</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <select value={selectedCompId} onChange={e => setSelectedCompId(e.target.value)} className="flex-1 px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-purple-200 dark:border-purple-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white">
                    <option value="">-- Seleccionar Producto --</option>
                    {todosLosProductos.filter(p => p.tipo_unidad !== 'kit').map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} (Stock: {p.stock_actual})</option>
                    ))}
                  </select>
                  <input type="number" min="0.001" step="any" placeholder="Cant." value={selectedCompQty} onChange={e => setSelectedCompQty(e.target.value ? Number(e.target.value) : '')} className="w-24 px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-purple-200 dark:border-purple-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white" />
                  <button type="button" onClick={handleAddComponent} className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold transition">Añadir</button>
                </div>

                {componentesKit.length > 0 && (
                  <ul className="space-y-2 bg-white dark:bg-[#1a1c1e] p-3 rounded-lg border border-purple-100 dark:border-purple-800/50">
                    {componentesKit.map((c, idx) => {
                      const prod = todosLosProductos.find(p => p.id === c.producto_id);
                      return (
                        <li key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700 dark:text-slate-300">
                            <span className="font-bold text-slate-900 dark:text-white">{c.cantidad}x</span> {prod?.nombre || 'Desconocido'}
                          </span>
                          <button type="button" onClick={() => handleRemoveComponent(c.producto_id)} className="text-red-500 hover:text-red-600">Remover</button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )}

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tipoUnidad !== 'kit' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Costo ($)</label>
                  <input required type="number" step="0.01" min="0" value={costo} onChange={e => setCosto(e.target.value ? Number(e.target.value) : '')} className="w-full px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
                </div>
              )}
              <div className={tipoUnidad === 'kit' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Precio Venta Normal ($)</label>
                <input required type="number" step="0.01" min="0" value={ventaNormal} onChange={e => setVentaNormal(e.target.value ? Number(e.target.value) : '')} className="w-full px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Precio Mayoreo ($)</label>
                <input type="number" step="0.01" min="0" value={ventaMayoreo} onChange={e => setVentaMayoreo(e.target.value ? Number(e.target.value) : '')} className="w-full px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" placeholder="Opcional" />
              </div>
            </div>

            {/* Taxes */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Impuesto IVA</label>
                  <select value={iva} onChange={e => setIva(Number(e.target.value))} className="w-full px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white">
                    <option value={0.16}>16% (Tasa General)</option>
                    <option value={0.08}>8% (Frontera)</option>
                    <option value={0}>0% (Exento)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Impuesto IEPS</label>
                  <select value={ieps} onChange={e => setIeps(Number(e.target.value))} className="w-full px-3 py-2 bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white">
                    <option value={0}>0% (No aplica)</option>
                    <option value={0.08}>8% (Alto Calorífico)</option>
                    <option value={0.265}>26.5% (Cerveza)</option>
                  </select>
                </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#151618] flex items-center justify-end gap-3 sticky bottom-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition">
            Cancelar
          </button>
          <button type="submit" form="add-product-form" className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Guardar Producto
          </button>
        </div>

      </div>
    </div>
  )
}
