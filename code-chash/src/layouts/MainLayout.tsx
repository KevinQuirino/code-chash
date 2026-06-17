import type { ReactNode } from 'react'
import Sidebar from './Sidebar'

type MainLayoutProps = {
  children: ReactNode
  isSidebarOpen: boolean
  onOpenSidebar: () => void
  onCloseSidebar: () => void
  activeView: string
  onNavigate: (view: string) => void
  themeMode: 'light' | 'dark'
  onToggleTheme: () => void
  onLogout?: () => void
}

export default function MainLayout({
  children,
  isSidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
  activeView,
  onNavigate,
  themeMode,
  onToggleTheme,
  onLogout
}: MainLayoutProps) {
  return (
    <div className={`flex min-h-screen font-sans ${themeMode === 'dark' ? 'dark' : ''}`}>
      <div className="flex w-full h-screen bg-slate-50 dark:bg-[#111214] text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={onCloseSidebar} 
          activeView={activeView} 
          onNavigate={onNavigate} 
          themeMode={themeMode}
          onToggleTheme={onToggleTheme}
          onLogout={onLogout}
        />

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black/50 md:hidden backdrop-blur-sm"
            onClick={onCloseSidebar}
          />
        )}

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="flex items-center justify-between p-4 md:hidden bg-white dark:bg-[#1a1c1e] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onOpenSidebar}
                className="p-2 rounded-lg bg-slate-100 dark:bg-[#2a2d32] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                aria-label="Open menu"
              >
                <svg xmlns="http://www.w3.org/0000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              </button>
              <h1 className="text-xl font-black italic text-slate-900 dark:text-white">code <span className="text-blue-600 dark:text-blue-500">chash</span></h1>
            </div>
            
            <button 
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-[#2a2d32] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              {themeMode === 'dark' ? (
                <svg xmlns="http://www.w3.org/0000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/0000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          </header>
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  )
}
