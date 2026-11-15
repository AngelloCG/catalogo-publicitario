
import { useEffect, useState } from 'react'
import { ArrowRight, Search, Sparkles } from 'lucide-react'
import Navbar from './components/Navbar'

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme) {
      return savedTheme === 'dark'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="min-h-screen bg-white text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-white">
      <Navbar
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
      />

      <main id="inicio">
        <section className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8 lg:py-32">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
            <Sparkles size={16} />
            Creatividad que se hace realidad
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Hacemos que tus ideas
            <span className="text-blue-600"> destaquen.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg">
            Explora nuestros trabajos en publicidad, impresión,
            señalización y productos personalizados.
            Cada proyecto refleja nuestra pasión por crear.
          </p>

          <div className="mx-auto mt-10 flex max-w-xl items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            <Search className="ml-3 shrink-0 text-zinc-400" size={21} />

            <input
              id="buscador"
              type="search"
              placeholder="Busca avisos, pendones, sellos..."
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-zinc-400"
            />

            <a
              href="#productos"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Explorar <ArrowRight size={16} />
            </a>
          </div>
        </section>

        <section
          id="productos"
          className="border-t border-zinc-200 bg-zinc-50 px-5 py-20 dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              Nuestro portafolio
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trabajos recientes
            </h2>

            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Próximamente mostraremos aquí los proyectos publicados
              desde nuestro panel de administración.
            </p>
          </div>
        </section>

        <section id="categorias" className="mx-auto max-w-7xl px-5 py-20">
          <h2 className="text-3xl font-bold">Explora por categorías</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Aquí organizaremos todos nuestros productos y servicios.
          </p>
        </section>

        <footer
          id="contacto"
          className="border-t border-zinc-200 px-5 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800"
        >
          Catálogo Publicitario · Desarrollado con React y TypeScript
        </footer>
      </main>
    </div>
  )
}

export default App
