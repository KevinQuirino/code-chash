import type { Producto } from '../../types'

type ProductCardProps = {
  producto: Producto
  onAdd: (producto: Producto) => void
}

export default function ProductCard({ producto, onAdd }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={() => onAdd(producto)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-[#1e2023] hover:bg-[#25282d] transition text-left"
    >
      <div className="relative w-full aspect-square bg-[#151618] flex items-center justify-center overflow-hidden p-4">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-full object-cover rounded-xl transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-white">
          {producto.nombre}
        </h3>
        <p className="mt-1 text-sm font-semibold text-blue-400">
          ${producto.precio.toFixed(2)}
        </p>
      </div>
    </button>
  )
}
