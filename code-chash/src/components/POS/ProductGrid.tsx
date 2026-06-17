import type { Producto } from '../../types'
import ProductCard from './ProductCard'

type ProductGridProps = {
  productos: Producto[]
  onAddProduct: (producto: Producto) => void
}

export default function ProductGrid({ productos, onAddProduct }: ProductGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} onAdd={onAddProduct} />
      ))}
    </div>
  )
}
