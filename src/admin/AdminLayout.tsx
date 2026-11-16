
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Palette,
  Settings,
  PanelLeftClose,
  Menu,
  X,
  Moon,
  Sun,
  ArrowLeft,
  LogOut,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

type AdminLayoutProps = {
  darkMode: boolean
  toggleTheme: () => void
}

const navigation = [
  { name: 'Resumen', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Productos', path: '/admin/productos', icon: Package },
  { name: 'Categorías', path: '/admin/categorias', icon: FolderOpen },
  { name: 'Apariencia', path: '/admin/apariencia', icon: Palette },
  { name: 'Configuración', path: '/admin/configuracion', icon: Settings },
]

export default function AdminLayout({
  darkMode,
  toggleTheme,
}: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

const navigate = useNavigate()
const [signingOut, setSigningOut] = useState(false)

async function handleLogout() {
  setSigningOut(true)

  const { error } = await supabase.auth.signOut({
    scope: 'local',
  })

  setSigningOut(false)

  if (error) {
    window.alert('No se pudo cerrar la sesión. Inténtalo de nuevo.')
    return
  }

  navigate('/admin/login', { replace: true })
}


  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú lateral"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-zinc-200 bg-white transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64`}
      >
        <div className="flex h-20 items-center justify-between border-b border-zinc-200 px-5 dark:border-zinc-800">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                C
              </div>
              <div>
                <p className="text-sm font-bold">Catálogo</p>
                <p className="text-xs text-zinc-500">Administración</p>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white lg:flex">
              C
            </div>
          )}

          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 lg:hidden"
          >
            <X size={21} />
          </button>

          <button
            type="button"
            aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:block"
          >
            <PanelLeftClose size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Navegación administrativa">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                title={item.name}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />
                {(!collapsed || mobileOpen) && <span>{item.name}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <ArrowLeft size={20} />
            {(!collapsed || mobileOpen) && 'Ver catálogo'}
          </NavLink>

<button
  type="button"
  onClick={handleLogout}
  disabled={signingOut}
  title="Cerrar sesión"
  className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950"
>
  <LogOut size={20} className="shrink-0" />
  {(!collapsed || mobileOpen) && (
    <span>
      {signingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </span>
  )}
</button>

        </div>
      </aside>

      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zinc-200 bg-white/90 px-5 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/90 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden"
            >
              <Menu size={23} />
            </button>

            <div>
              <p className="text-sm font-bold sm:text-base">
                Panel de administración
              </p>
              <p className="text-xs text-zinc-500">
                Gestiona tu catálogo digital
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="rounded-xl border border-zinc-200 p-2.5 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <div className="mx-auto max-w-7xl p-5 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
