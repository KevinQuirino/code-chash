export default function Analytics() {
  const salesData = [
    { fecha: '17 Jun', ventas: 245.50, ordenes: 42 },
    { fecha: '16 Jun', ventas: 312.75, ordenes: 58 },
    { fecha: '15 Jun', ventas: 189.25, ordenes: 31 },
    { fecha: '14 Jun', ventas: 428.00, ordenes: 71 },
    { fecha: '13 Jun', ventas: 356.90, ordenes: 53 },
    { fecha: '12 Jun', ventas: 267.40, ordenes: 44 },
  ]

  const topProducts = [
    { nombre: 'Pour Over', ventas: 124, ingresos: 558.00 },
    { nombre: 'Nitro Cold Brew', ventas: 98, ingresos: 539.00 },
    { nombre: 'Almond Croissant', ventas: 87, ingresos: 348.00 },
    { nombre: 'Espresso Beans', ventas: 32, ingresos: 576.00 },
  ]

  const totalSales = salesData.reduce((sum, day) => sum + day.ventas, 0)
  const totalOrders = salesData.reduce((sum, day) => sum + day.ordenes, 0)
  const avgTicket = (totalSales / totalOrders).toFixed(2)

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 h-full overflow-y-auto bg-slate-50 dark:bg-[#111214] transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Análisis de Ventas</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Métricas y reportes de desempeño de la cafetería.</p>
      </div>
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Ventas Totales</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-3">${totalSales.toFixed(2)}</p>
          <p className="text-slate-500 text-xs mt-2">Últimos 6 días</p>
        </div>
        <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Órdenes Totales</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-3">{totalOrders}</p>
          <p className="text-slate-500 text-xs mt-2">Promedio: {(totalOrders / 6).toFixed(0)}/día</p>
        </div>
        <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Ticket Promedio</p>
          <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400 mt-3">${avgTicket}</p>
          <p className="text-slate-500 text-xs mt-2">Valor por transacción</p>
        </div>
      </div>

      {/* Chart simulation */}
      <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-slate-900 dark:text-white font-semibold mb-6">Ventas Últimos 6 Días</h2>
        <div className="flex items-end gap-3 h-48 justify-between">
          {salesData.map((day) => (
            <div key={day.fecha} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-gradient-to-t from-blue-500 to-blue-300 dark:from-blue-600 dark:to-blue-400 rounded-t-lg mb-2" 
                style={{ height: `${(day.ventas / 450) * 100}%` }}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">{day.fecha}</p>
              <p className="text-xs text-slate-900 dark:text-white font-semibold mt-1">${day.ventas.toFixed(0)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-slate-900 dark:text-white font-semibold mb-6">Productos Más Vendidos</h2>
        <div className="space-y-3">
          {topProducts.map((product, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#25282d] rounded-lg border border-slate-100 dark:border-transparent">
              <div className="flex-1">
                <p className="text-slate-900 dark:text-white font-medium">{product.nombre}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">{product.ventas} unidades vendidas</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 dark:text-green-400 font-semibold">${product.ingresos.toFixed(2)}</p>
                <p className="text-slate-500 text-xs">Ingresos</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
