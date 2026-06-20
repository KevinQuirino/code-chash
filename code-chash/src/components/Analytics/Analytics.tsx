import { useState } from 'react'
import CorteCajaModal from './CorteCajaModal'

export default function Analytics() {
  const [isCorteOpen, setIsCorteOpen] = useState(false)
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

  const peakHours = [
    { hora: '8 AM', ventas: 85 },
    { hora: '10 AM', ventas: 120 },
    { hora: '12 PM', ventas: 150 },
    { hora: '2 PM', ventas: 90 },
    { hora: '4 PM', ventas: 60 },
    { hora: '6 PM', ventas: 110 },
  ]

  const totalSales = salesData.reduce((sum, day) => sum + day.ventas, 0)
  const totalOrders = salesData.reduce((sum, day) => sum + day.ordenes, 0)
  const avgTicket = (totalSales / totalOrders).toFixed(2)

  // Mock data for Corte de Caja
  const datosTurno = {
    fondoInicial: 200.00,
    ventasEfectivo: 350.50,
    salidasEfectivo: 20.00, // eg. bought water
    efectivoEsperado: 200.00 + 350.50 - 20.00
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 h-full overflow-y-auto bg-slate-50 dark:bg-[#111214] transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Análisis de Ventas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Métricas financieras y desempeño del negocio.</p>
        </div>
        <button 
          onClick={() => setIsCorteOpen(true)}
          className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          Realizar Corte de Caja
        </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart simulation */}
        <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-slate-900 dark:text-white font-semibold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            Ventas Últimos 6 Días
          </h2>
          <div className="flex items-end gap-3 h-48 justify-between">
            {salesData.map((day) => (
              <div key={day.fecha} className="flex flex-col items-center justify-end flex-1 h-full">
                <div 
                  className="w-full max-w-[40px] bg-gradient-to-t from-blue-500 to-blue-300 dark:from-blue-600 dark:to-blue-400 rounded-t-lg mb-2 transition-all hover:opacity-80" 
                  style={{ height: `${(day.ventas / 450) * 100}%` }}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center whitespace-nowrap">{day.fecha}</p>
                <p className="text-xs text-slate-900 dark:text-white font-semibold mt-1">${day.ventas.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours Chart */}
        <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-slate-900 dark:text-white font-semibold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Horas Pico (Tráfico)
          </h2>
          <div className="flex items-end gap-3 h-48 justify-between">
            {peakHours.map((ph) => (
              <div key={ph.hora} className="flex flex-col items-center justify-end flex-1 h-full">
                <div 
                  className="w-full max-w-[40px] bg-gradient-to-t from-orange-500 to-orange-300 dark:from-orange-600 dark:to-orange-400 rounded-t-lg mb-2 transition-all hover:opacity-80" 
                  style={{ height: `${(ph.ventas / 150) * 100}%` }}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center whitespace-nowrap">{ph.hora}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Top Customer / Intelligence */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 shadow-sm text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
          <h2 className="font-semibold mb-6 flex items-center gap-2 relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Cliente Top del Mes
          </h2>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm border border-white/30">
              JS
            </div>
            <div>
              <p className="text-2xl font-bold">Juan Silva</p>
              <p className="text-blue-100 mt-1">12 Visitas este mes</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20 relative z-10 flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm">Gasto Promedio</p>
              <p className="font-bold text-xl">$45.00</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Producto Favorito</p>
              <p className="font-bold">Nitro Cold Brew</p>
            </div>
          </div>
        </div>
      </div>

      {isCorteOpen && (
        <CorteCajaModal 
          onClose={() => setIsCorteOpen(false)} 
          onComplete={() => setIsCorteOpen(false)}
          datosTurno={datosTurno}
        />
      )}
    </div>
  )
}
