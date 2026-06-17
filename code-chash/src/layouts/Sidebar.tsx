// Sidebar component

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
  activeView: string
  onNavigate: (view: string) => void
  themeMode: 'light' | 'dark'
  onToggleTheme: () => void
  onLogout?: () => void
}

const topNavItems = [
  { id: 'terminal', name: 'Terminal', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
  )},
  { id: 'inventory', name: 'Inventory', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
  )},
  { id: 'analytics', name: 'Analytics', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  )},
  { id: 'customers', name: 'Customers', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  )},
  { id: 'cashiers', name: 'Cajeros', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  )},
]

const bottomNavItems = [
  { id: 'support', name: 'Support', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  ), danger: false },
  { id: 'logout', name: 'Cerrar Sesión', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ), danger: true },
]

export default function Sidebar({ isOpen, onClose, activeView, onNavigate, themeMode, onToggleTheme, onLogout }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col overflow-y-auto bg-white dark:bg-[#1a1c1e] border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-300 md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 pb-2 text-center relative">
        <button 
          onClick={onToggleTheme}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 dark:bg-[#2a2d32] text-slate-500 hover:text-slate-900 dark:hover:text-white transition hidden md:block"
          title="Toggle Theme"
        >
          {themeMode === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>

        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg relative">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-10 h-10">
              <path d="M 60 20 L 40 20 A 10 10 0 0 0 30 30 L 30 80 A 10 10 0 0 0 40 90 L 80 90" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 80 40 L 60 40 A 10 10 0 0 0 50 50 L 50 80" fill="none" stroke="#f97316" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
        </div>
        <h2 className="text-2xl font-black italic tracking-tight text-slate-900 dark:text-white">code <span className="text-blue-600 dark:text-blue-500">chash</span></h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Tu negocio, bajo control</p>
      </div>

      <nav className="flex-1 space-y-2 px-4 mt-6">
        {topNavItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => {
              onNavigate(item.id)
              onClose()
            }}
            className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition ${
              activeView === item.id
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 pb-6 mt-auto">
        <button
          type="button"
          onClick={() => {
            onNavigate('terminal')
            onClose()
          }}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-500 dark:bg-[#00e676] px-4 py-3 text-sm font-bold text-white dark:text-black transition hover:bg-green-600 dark:hover:bg-[#00c853] mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          Quick Checkout
        </button>

        <div className="space-y-2">
          {bottomNavItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => {
                if (item.id === 'logout' && onLogout) {
                  onLogout()
                }
              }}
              className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition hover:bg-slate-100 dark:hover:bg-white/5 ${
                item.danger ? 'text-red-500 dark:text-[#ff6b6b]' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
