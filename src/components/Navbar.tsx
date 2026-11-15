
import { useState } from 'react'
import { Menu, Moon, Sun, X, Search, ArrowRight } from 'lucide-react'

type NavbarProps = {
  darkMode: boolean
  toggleTheme: () => void
}

export default function Navbar({
  darkMode,
  toggleTheme,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Productos', href: '#productos' },
    { label: 'Categorías', href: '#categorias' },
    { label: 'Contacto', href: '#contacto' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        <a href="#inicio" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white">
            C
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Catálogo<span className="text-blue-600">.</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-zinc-600 transition hover:text-blue-600 dark:text-zinc-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Buscar productos"
            onClick={() => document.getElementById('buscador')?.focus()}
            className="hidden rounded-xl p-2.5 text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:block"
          >
            <Search size={20} />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="rounded-xl border border-zinc-200 p-2.5 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <a
            href="#productos"
            className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 lg:flex"
          >
            Explorar <ArrowRight size={16} />
          </a>

          <button
            type="button"
            className="rounded-xl p-2 text-zinc-800 dark:text-white md:hidden"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
