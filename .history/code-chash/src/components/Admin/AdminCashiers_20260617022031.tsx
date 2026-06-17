import { useState } from 'react'

const initialCashiers = [
  { id: 1, name: 'trabajador 1', username: 'trabajador1', role: 'Cajero' },
  { id: 2, name: 'admin', username: 'admin', role: 'Administrador' },
  { id: 3, name: 'trabajador 2', username: 'trabajador2', role: 'Cajero' },
]

const permissions = [
  { id: 'common', label: 'Utilizar Producto Común' },
  { id: 'cancel', label: 'Cancelar tickets y devolver artículos' },
  { id: 'wholesale', label: 'Aplicar Mayoreo' },
  { id: 'delete', label: 'Eliminar artículos de venta' },
  { id: 'discount', label: 'Aplicar Descuento' },
  { id: 'invoice', label: 'Facturar / Ver Facturas' },
  { id: 'history', label: 'Revisar el historial de Ventas' },
  { id: 'services', label: 'Vender un pago de servicio' },
  { id: 'cash_in', label: 'Registrar Entradas de Efectivo' },
  { id: 'recharge', label: 'Vender Recargas Electrónicas' },
  { id: 'cash_out', label: 'Registrar Salidas de Efectivo' },
  { id: 'search', label: 'Usar buscador de productos' },
  { id: 'charge', label: 'Cobrar un ticket' },
  { id: 'credit', label: 'Cobrar a crédito' },
]

export default function AdminCashiers() {
  const [cashiers] = useState(initialCashiers)
  const [selectedCashierId, setSelectedCashierId] = useState<number | null>(1)
  const [activeTab, setActiveTab] = useState('ventas')

  const [formData, setFormData] = useState({
    username: 'trabajador1',
    password: '',
    fullName: 'trabajador 1'
  })

  const [selectedPerms, setSelectedPerms] = useState<Record<string, boolean>>({
    common: true,
    history: true,
    charge: true,
    credit: true,
    cancel: true,
    services: true,
    recharge: true,
    search: true,
  })

  const handleNewCashier = () => {
    setSelectedCashierId(null)
    setFormData({ username: '', password: '', fullName: '' })
    setSelectedPerms({})
  }

  const togglePermission = (id: string) => {
    setSelectedPerms(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 h-full overflow-hidden bg-slate-50 dark:bg-[#111214] transition-colors duration-300">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white uppercase">Administración de Cajeros</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configura usuarios y sus permisos en el sistema.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Sidebar - Cashiers List */}
        <div className="w-full lg:w-80 flex flex-col bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm shrink-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#151618] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-[#25282d] p-3 text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            Nombre del Cajero
          </div>

          <div className="flex-1 overflow-y-auto">
            {cashiers.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCashierId(c.id)
                  setFormData({ username: c.username, password: '••••••••', fullName: c.name })
                }}
                className={`w-full flex items-center gap-3 p-3 border-b border-slate-100 dark:border-slate-800/50 transition text-left ${selectedCashierId === c.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-[#1a1c1e] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#25282d]'
                  }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${selectedCashierId === c.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-[#2a2d32] text-slate-500'
                  }`}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${selectedCashierId === c.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {c.name}
                  </p>
                  <p className={`text-xs truncate ${selectedCashierId === c.id ? 'text-blue-200' : 'text-slate-500'}`}>
                    {c.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Content - Form */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap bg-slate-50 dark:bg-[#1e2023]">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
              {selectedCashierId ? 'Editar Cajero' : 'Nuevo Cajero'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewCashier}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#25282d] border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-[#2a2d32] transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                Nuevo Cajero
              </button>
              {selectedCashierId && (
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#25282d] border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-[#2a2d32] transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  Dar de Baja
                </button>
              )}
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {/* User Info Form */}
            <div className="max-w-xl space-y-4 mb-8">
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-right text-sm font-bold text-slate-700 dark:text-slate-300">Usuario</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151618] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-right text-sm font-bold text-slate-700 dark:text-slate-300">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151618] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-right text-sm font-bold text-slate-700 dark:text-slate-300">Nombre completo</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#151618] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Permissions Tabs */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <div className="flex flex-wrap bg-slate-100 dark:bg-[#25282d] border-b border-slate-200 dark:border-slate-700">
                {['Ventas', 'Clientes', 'Productos', 'Inventario', 'Otros'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-2.5 text-sm font-bold transition flex items-center gap-2 ${activeTab === tab.toLowerCase()
                        ? 'bg-white dark:bg-[#1a1c1e] text-blue-600 dark:text-blue-400 border-t-2 border-t-blue-600'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 border-t-2 border-transparent'
                      }`}
                  >
                    {tab === 'Ventas' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>}
                    {tab === 'Clientes' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>}
                    {tab === 'Productos' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>}
                    {tab === 'Inventario' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Permissions List */}
              <div className="p-6 bg-slate-50 dark:bg-[#151618]">
                {activeTab === 'ventas' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissions.map(perm => (
                      <label key={perm.id} className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={!!selectedPerms[perm.id]}
                            onChange={() => togglePermission(perm.id)}
                          />
                          <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-colors flex items-center justify-center">
                            <svg className={`w-3 h-3 text-white pointer-events-none transition-opacity ${selectedPerms[perm.id] ? 'opacity-100' : 'opacity-0'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                    Permisos de {activeTab} aún no configurados en este demo.
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#1e2023] flex items-center justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Guardar Cajero y Permisos
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-[#25282d] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2a2d32] rounded-xl text-sm font-bold transition shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
