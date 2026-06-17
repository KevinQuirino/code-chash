import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import ProductGrid from './components/POS/ProductGrid'
import TicketSummary from './components/POS/TicketSummary'
import type { ItemTicket, Producto } from './types'

const initialProductos: Producto[] = [
  {
    id: 'p1',
    nombre: 'Pour Over',
    descripcion: '',
    categoria: 'Coffee',
    precio: 4.50,
    imagen: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80',
    stock: 100,
  },
  {
    id: 'p2',
    nombre: 'Nitro Cold Brew',
    descripcion: '',
    categoria: 'Coffee',
    precio: 5.50,
    imagen: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    stock: 100,
  },
  {
    id: 'p3',
    nombre: 'Almond Croissant',
    descripcion: '',
    categoria: 'Pastries',
    precio: 4.00,
    imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    stock: 100,
  },
  {
    id: 'p4',
    nombre: 'Espresso Beans',
    descripcion: '',
    categoria: 'Merchandise',
    precio: 18.00,
    imagen: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80',
    stock: 100,
  },
]

const categories = ['All Items', 'Coffee', 'Pastries', 'Merchandise']

function App() {
  const [activeCategory, setActiveCategory] = useState('All Items')
  const [items, setItems] = useState<ItemTicket[]>([])

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleAddProduct = (producto: Producto) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.productoId === producto.id)

      if (existing) {
        return prevItems.map((item) =>
          item.productoId === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
                total: (item.cantidad + 1) * item.precioUnitario,
              }
            : item,
        )
      }

      return [
        ...prevItems,
        {
          productoId: producto.id,
          nombre: producto.nombre,
          cantidad: 1,
          precioUnitario: producto.precio,
          total: producto.precio,
        },
      ]
    })
  }

  const handleClearTicket = () => {
    setItems([])
  }

  return (
    <MainLayout
      isSidebarOpen={isSidebarOpen}
      onOpenSidebar={() => setIsSidebarOpen(true)}
      onCloseSidebar={() => setIsSidebarOpen(false)}
    >
      <div className="block lg:flex h-full overflow-y-auto lg:overflow-hidden">
        {/* Left main content area */}
        <div className="w-full lg:flex-1 flex flex-col p-4 lg:p-6 lg:pr-0 lg:overflow-hidden">
          {/* Categories Tab */}
          <div className="flex gap-2 lg:gap-4 mb-6 overflow-x-auto pb-2 shrink-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 lg:px-6 py-2 lg:py-2.5 text-sm font-bold transition whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#3b82f6] text-white'
                    : 'bg-[#2a2d32] text-slate-300 hover:bg-[#3a3d42]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full lg:pr-6 pb-6 lg:overflow-y-auto">
            <ProductGrid productos={initialProductos} onAddProduct={handleAddProduct} />
          </div>
        </div>

        {/* Right Sidebar - Ticket */}
        <div className="w-full lg:w-[380px] bg-[#1a1c1e] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0">
          <TicketSummary items={items} onClear={handleClearTicket} />
        </div>
      </div>
    </MainLayout>
  )
}

export default App
