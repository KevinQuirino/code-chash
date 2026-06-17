export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagen: string;
  stock: number;
}

export interface ItemTicket {
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}
