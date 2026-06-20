export type TipoUnidad = 'pieza' | 'granel' | 'kit';

export interface PrecioProducto {
  costo: number;
  venta_normal: number;
  venta_mayoreo: number;
}

export interface ComponenteKit {
  producto_id: string;
  cantidad: number;
}

export interface Categoria {
  id: string;
  nombre: string;
  orden: number;
  icono: string;
}

export interface Cliente {
  id: string;
  telefono: string;
  nombre: string;
  correo?: string;
  aceptaPrivacidad: boolean;
  fechaRegistro: Date;
}

export interface Producto {
  id: string;
  barcode: string;
  nombre: string;
  descripcion: string;
  
  tipo_unidad: TipoUnidad;
  precios: PrecioProducto;
  
  categoria: string;
  departamento_id?: string;
  proveedor_id?: string;
  
  stock_actual: number;
  stock_minimo_alerta: number;
  fecha_caducidad?: Date;
  
  tasa_impuesto_iva: number;
  tasa_impuesto_ieps: number;
  
  componentes_kit?: ComponenteKit[];
  
  // Legacy properties for UI compatibility
  imagen: string;
  cantidadMayoreo?: number;
  precioMayoreo?: number;
}

export interface ItemTicket {
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export type ConceptoMovimiento = 
  | 'VENTA' 
  | 'COMPRA_PROVEEDOR' 
  | 'MERMA' 
  | 'AJUSTE_INVENTARIO' 
  | 'DEVOLUCION';

export interface MovimientoInventario {
  id: string;
  producto_id: string;
  fecha: Date;
  tipo: 'ENTRADA' | 'SALIDA';
  concepto: ConceptoMovimiento;
  cantidad: number;
  stock_resultante: number;
  usuario_id: string;
  referencia?: string;
}

export type TipoMovimientoCaja = 'VENTA_EFECTIVO' | 'ENTRADA_FONDO' | 'SALIDA_GASTO';

export interface MovimientoCaja {
  id: string;
  tipo: TipoMovimientoCaja;
  monto: number;
  fecha: Date;
  descripcion: string;
}

export interface CorteDeCaja {
  id: string;
  fechaInicio: Date;
  fechaFin: Date;
  fondoInicial: number;
  ventasEfectivo: number;
  salidasEfectivo: number;
  efectivoEsperado: number;
  efectivoContadoFisico: number;
  diferencia: number;
  cajeroId: string;
  firmaPin: string;
}
