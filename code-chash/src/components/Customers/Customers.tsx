export default function Customers() {
  const customerData = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', ordenes: 12, gasto: 145.50 },
    { id: 2, nombre: 'María López', email: 'maria@email.com', ordenes: 8, gasto: 98.75 },
    { id: 3, nombre: 'Carlos García', email: 'carlos@email.com', ordenes: 5, gasto: 67.25 },
    { id: 4, nombre: 'Ana Martínez', email: 'ana@email.com', ordenes: 15, gasto: 189.40 },
    { id: 5, nombre: 'Diego Rodríguez', email: 'diego@email.com', ordenes: 9, gasto: 112.80 },
  ]

  const totalCustomers = customerData.length
  const totalSpent = customerData.reduce((sum, customer) => sum + customer.gasto, 0)
  const avgSpent = (totalSpent / totalCustomers).toFixed(2)

  return (
    <div className="flex-1 overflow-auto p-6 bg-slate-50 dark:bg-[#111214] transition-colors duration-300">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Clientes</h1>
        <p className="text-slate-500 dark:text-slate-400">Gestión y análisis de clientes</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Clientes Registrados</p>
          <p className="text-4xl font-bold text-slate-900 dark:text-white mt-3">{totalCustomers}</p>
          <p className="text-slate-500 text-xs mt-2">Activos en el sistema</p>
        </div>
        <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gasto Total</p>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-3">${totalSpent.toFixed(2)}</p>
          <p className="text-slate-500 text-xs mt-2">Todas las transacciones</p>
        </div>
        <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gasto Promedio</p>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-3">${avgSpent}</p>
          <p className="text-slate-500 text-xs mt-2">Por cliente</p>
        </div>
      </div>

      {/* Customers table */}
      <div className="bg-white dark:bg-[#1a1c1e] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-[#25282d] border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Nombre</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Email</th>
              <th className="px-6 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Órdenes</th>
              <th className="px-6 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Gasto Total</th>
            </tr>
          </thead>
          <tbody>
            {customerData.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-[#25282d] transition"
              >
                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{customer.nombre}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{customer.email}</td>
                <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-medium">{customer.ordenes}</td>
                <td className="px-6 py-4 text-right text-green-600 dark:text-green-400 font-semibold">
                  ${customer.gasto.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
