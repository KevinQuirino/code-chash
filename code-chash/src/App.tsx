import { useState, useEffect } from 'react'
import MainLayout from './layouts/MainLayout'
import ProductGrid from './components/POS/ProductGrid'
import TicketSummary from './components/POS/TicketSummary'
import Inventory from './components/Inventory/Inventory'
import Analytics from './components/Analytics/Analytics'
import Customers from './components/Customers/Customers'
import AdminCashiers from './components/Admin/AdminCashiers'
import Login from './components/Auth/Login'
import type { User } from './components/Auth/Login'
import StartingCashModal from './components/POS/StartingCashModal'
import QuantityModal from './components/POS/QuantityModal'
import CustomerSearchModal from './components/POS/CustomerSearchModal'
import type { ItemTicket, Producto, Categoria, Cliente } from './types'

const initialCategorias: Categoria[] = [
  { id: 'cat_1', nombre: 'Coffee', orden: 1, icono: '☕' },
  { id: 'cat_2', nombre: 'Pastries', orden: 2, icono: '🥐' },
  { id: 'cat_3', nombre: 'Merchandise', orden: 3, icono: '👕' },
]

const initialProductos: Producto[] = [
  {
    id: 'p1',
    barcode: 'COF-PO-001',
    nombre: 'Pour Over',
    descripcion: 'Classic pour over coffee',
    tipo_unidad: 'pieza',
    precios: { costo: 2.00, venta_normal: 4.50, venta_mayoreo: 4.00 },
    categoria: 'Coffee',
    imagen: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80',
    stock_actual: 100,
    stock_minimo_alerta: 10,
    tasa_impuesto_iva: 0.16,
    tasa_impuesto_ieps: 0,
  },
  {
    id: 'p2',
    barcode: 'COF-NC-001',
    nombre: 'Nitro Cold Brew',
    descripcion: 'Cold brew infused with nitrogen',
    tipo_unidad: 'pieza',
    precios: { costo: 2.50, venta_normal: 5.50, venta_mayoreo: 5.00 },
    categoria: 'Coffee',
    imagen: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    stock_actual: 100,
    stock_minimo_alerta: 10,
    tasa_impuesto_iva: 0.16,
    tasa_impuesto_ieps: 0,
  },
  {
    id: 'p3',
    barcode: 'PAS-AC-001',
    nombre: 'Almond Croissant',
    descripcion: 'Fresh baked almond croissant',
    tipo_unidad: 'pieza',
    precios: { costo: 1.50, venta_normal: 4.00, venta_mayoreo: 3.50 },
    categoria: 'Pastries',
    imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    stock_actual: 100,
    stock_minimo_alerta: 15,
    tasa_impuesto_iva: 0, // Food
    tasa_impuesto_ieps: 0.08, // High calorie
    cantidadMayoreo: 5,
    precioMayoreo: 3.50, // kept for legacy compat in handleAddProduct
  },
  {
    id: 'p4',
    barcode: 'MER-EB-001',
    nombre: 'Espresso Beans',
    descripcion: '1 lb bag of house espresso beans',
    tipo_unidad: 'granel',
    precios: { costo: 8.00, venta_normal: 18.00, venta_mayoreo: 16.00 },
    categoria: 'Merchandise',
    imagen: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80',
    stock_actual: 100,
    stock_minimo_alerta: 20,
    tasa_impuesto_iva: 0,
    tasa_impuesto_ieps: 0,
  },
]

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null)
  const [startingCash, setStartingCash] = useState<number | null>(null)
  
  const [activeCategory, setActiveCategory] = useState('All Items')
  const [items, setItems] = useState<ItemTicket[]>([])
  
  const [productos, setProductos] = useState<Producto[]>(initialProductos)
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState('terminal')
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark')
  
  const [selectedProductForQuantity, setSelectedProductForQuantity] = useState<Producto | null>(null)

  // Customer Management State
  const [clientesDb, setClientesDb] = useState<Cliente[]>([
    { id: 'cli_1', telefono: '5551234', nombre: 'Juan Silva', aceptaPrivacidad: true, fechaRegistro: new Date() }
  ])
  const [clienteActual, setClienteActual] = useState<Cliente | null>(null)
  const [isInvitado, setIsInvitado] = useState(false)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [pendingProduct, setPendingProduct] = useState<{producto: Producto, cantidad: number} | null>(null)

  // Keyboard shortcut for customer search (F2)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault()
        if (activeView === 'terminal') {
          setIsCustomerModalOpen(true)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeView])

  const executeAddProduct = (producto: Producto, cantidadAñadida: number) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.productoId === producto.id)
      const nuevaCantidadTotal = existing ? existing.cantidad + cantidadAñadida : cantidadAñadida;
      
      // Determine applicable price
      let precioAplicable = producto.precios.venta_normal;
      if (producto.cantidadMayoreo && producto.precios.venta_mayoreo && nuevaCantidadTotal >= producto.cantidadMayoreo) {
        precioAplicable = producto.precios.venta_mayoreo;
      }

      if (existing) {
        return prevItems.map((item) =>
          item.productoId === producto.id
            ? {
                ...item,
                cantidad: nuevaCantidadTotal,
                precioUnitario: precioAplicable,
                total: nuevaCantidadTotal * precioAplicable,
              }
            : item,
        )
      }

      return [
        ...prevItems,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          cantidad: nuevaCantidadTotal,
          precioUnitario: precioAplicable,
          total: nuevaCantidadTotal * precioAplicable,
        },
      ]
    })
    setSelectedProductForQuantity(null)
  }

  const handleAddProduct = (producto: Producto, cantidadAñadida: number = 1) => {
    // Intercept first item if no customer or guest intent exists
    if (items.length === 0 && !clienteActual && !isInvitado) {
      setPendingProduct({ producto, cantidad: cantidadAñadida })
      setIsCustomerModalOpen(true)
      return
    }
    executeAddProduct(producto, cantidadAñadida)
  }

  const handleSelectCustomer = (cliente: Cliente) => {
    setClienteActual(cliente)
    setIsCustomerModalOpen(false)
    if (pendingProduct) {
      executeAddProduct(pendingProduct.producto, pendingProduct.cantidad)
      setPendingProduct(null)
    }
  }

  const handleSkipCustomer = () => {
    setIsInvitado(true)
    setIsCustomerModalOpen(false)
    if (pendingProduct) {
      executeAddProduct(pendingProduct.producto, pendingProduct.cantidad)
      setPendingProduct(null)
    }
  }

  const handleRegisterCustomer = (nuevoCliente: Cliente) => {
    setClientesDb(prev => [...prev, nuevoCliente])
  }


  const handleClearTicket = () => {
    setItems([])
    setClienteActual(null)
    setIsInvitado(false)
  }

  if (!loggedInUser) {
    return (
      <div className={themeMode === 'dark' ? 'dark' : ''}>
        <Login onLogin={(user) => setLoggedInUser(user)} />
      </div>
    )
  }

  return (
    <>
      <MainLayout
        isSidebarOpen={isSidebarOpen}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onNavigate={setActiveView}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark')}
        onLogout={() => {
          setLoggedInUser(null)
          setStartingCash(null) // Reset cash on logout
          setActiveView('terminal')
        }}
      >
        {activeView === 'terminal' ? (
          <div className="block lg:flex h-full overflow-y-auto lg:overflow-hidden relative">
            {/* Left main content area */}
            <div className="w-full lg:flex-1 flex flex-col p-4 lg:p-6 lg:pr-0 lg:overflow-hidden">
              {/* Categories Tab */}
              <div className="flex gap-2 lg:gap-4 mb-6 overflow-x-auto pb-2 shrink-0 hide-scrollbar">
                <button
                  onClick={() => setActiveCategory('All Items')}
                  className={`rounded-full px-5 lg:px-6 py-2 lg:py-2.5 text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                    activeCategory === 'All Items'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-[#2a2d32] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#3a3d42] border border-slate-200 dark:border-transparent'
                  }`}
                >
                  <span>🍔</span> All Items
                </button>
                
                {[...categorias].sort((a, b) => a.orden - b.orden).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.nombre)}
                    className={`rounded-full px-5 lg:px-6 py-2 lg:py-2.5 text-sm font-bold transition whitespace-nowrap flex items-center gap-2 ${
                      activeCategory === cat.nombre
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-[#2a2d32] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#3a3d42] border border-slate-200 dark:border-transparent'
                    }`}
                  >
                    <span>{cat.icono}</span> {cat.nombre}
                  </button>
                ))}
              </div>

              <div className="w-full lg:pr-6 pb-6 lg:overflow-y-auto">
                <ProductGrid 
                  productos={productos.filter(p => activeCategory === 'All Items' || p.categoria === activeCategory)} 
                  onAddProduct={(producto) => setSelectedProductForQuantity(producto)} 
                />
              </div>
            </div>

            {/* Right Sidebar - Ticket */}
            <div className="w-full lg:w-[380px] bg-slate-50 dark:bg-[#1a1c1e] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
              <TicketSummary 
                items={items} 
                onClear={handleClearTicket} 
                cliente={clienteActual}
                onRemoveCliente={() => { setClienteActual(null); setIsInvitado(true) }}
              />
            </div>
          </div>
        ) : activeView === 'inventory' ? (
          <Inventory 
            productos={productos} setProductos={setProductos} 
            categorias={categorias} setCategorias={setCategorias} 
          />
        ) : activeView === 'analytics' ? (
          <Analytics />
        ) : activeView === 'customers' ? (
          <Customers />
        ) : activeView === 'cashiers' ? (
          <AdminCashiers />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <p>Vista no disponible en el demo.</p>
          </div>
        )}
      </MainLayout>

      {startingCash === null && (
        <StartingCashModal 
          themeMode={themeMode} 
          onSubmit={(amount) => setStartingCash(amount)} 
        />
      )}

      {selectedProductForQuantity && (
        <QuantityModal
          producto={selectedProductForQuantity}
          themeMode={themeMode}
          onClose={() => setSelectedProductForQuantity(null)}
          onAdd={handleAddProduct}
        />
      )}

      {isCustomerModalOpen && (
        <CustomerSearchModal
          onClose={() => {
            setIsCustomerModalOpen(false)
            setPendingProduct(null)
          }}
          onSelectCustomer={handleSelectCustomer}
          onSkip={handleSkipCustomer}
          clientesDb={clientesDb}
          onRegisterCustomer={handleRegisterCustomer}
        />
      )}
    </>
  )
}

export default App
