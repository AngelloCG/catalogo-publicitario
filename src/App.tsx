
import { useEffect, useState } from 'react'
import { ArrowRight, Search, Sparkles } from 'lucide-react'
import Navbar from './components/Navbar'
import ProductCatalog from './components/ProductCatalog'
import {
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'
import ProductDetail from './pages/ProductDetail'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import ProductManager from './admin/ProductManager'
import { products as initialProducts } from './data/products'
import type { Product } from './types/product'

// Reinicia la galería cuando cambia el producto

function ProductDetailRoute({ products }: { products: Product[] }) {
  const { slug } = useParams<{ slug: string }>()

  return <ProductDetail key={slug} products={products} />
}


function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Esta sección estará disponible en una próxima etapa.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-lg font-semibold">
          Estamos construyendo este módulo
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          Aquí podrás administrar {title.toLowerCase()} sin escribir código.
        </p>
      </div>
    </div>
  )
}


function App() {

  // Estado del tema claro y oscuro
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme) {
      return savedTheme === 'dark'
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Obtener la ruta actual
  const location = useLocation()
  const isAdminRoute =
  location.pathname === '/admin' ||
  location.pathname.startsWith('/admin/')

  // Guardar y aplicar el tema seleccionado
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // Navegar hacia las secciones mediante sus enlaces
  useEffect(() => {
    if (!location.hash) return

    const targetId = location.hash.slice(1)

    const frame = requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: 'smooth',
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])
  

const [products, setProducts] = useState<Product[]>(() => {
  try {
    const saved = localStorage.getItem('catalog-products-v1')

    if (saved !== null) {
      const parsed: unknown = JSON.parse(saved)

      if (Array.isArray(parsed)) {
        return parsed as Product[]
      }
    }
  } catch (error) {
    console.error('No se pudieron cargar los productos:', error)
  }

  return initialProducts
})

useEffect(() => {
  try {
    localStorage.setItem(
      'catalog-products-v1',
      JSON.stringify(products)
    )
  } catch (error) {
    console.error('No se pudieron guardar los productos:', error)
  }
}, [products])

function handleSaveProduct(product: Product) {
  setProducts((current) => {
    const exists = current.some((item) => item.id === product.id)

    if (exists) {
      return current.map((item) =>
        item.id === product.id ? product : item
      )
    }

    return [product, ...current]
  })
}

function handleDeleteProduct(id: string) {
  setProducts((current) =>
    current.filter((product) => product.id !== id)
  )
}


  return (  
    <div className="min-h-screen bg-white text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-white">
    {!isAdminRoute && (
      <Navbar
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
      />
    )}
      
      <Routes>

<Route
  path="/admin"
  element={
    <AdminLayout
      darkMode={darkMode}
      toggleTheme={() => setDarkMode(!darkMode)}
    />
  }
>
  <Route index element={<Dashboard products={products} />} />


<Route
  path="productos"
  element={
    <ProductManager
      products={products}
      onSave={handleSaveProduct}
      onDelete={handleDeleteProduct}
    />
  }
/>


  <Route
    path="categorias"
    element={<AdminPlaceholder title="Categorías" />}
  />

  <Route
    path="apariencia"
    element={<AdminPlaceholder title="Apariencia" />}
  />

  <Route
    path="configuracion"
    element={<AdminPlaceholder title="Configuración" />}
  />
</Route>

      <Route
  path="/productos/:slug"
  element={<ProductDetailRoute products={products} />}
/>
        <Route
          path="/"
          element={
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

          <ProductCatalog products={products} />

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
        }
      />
  <Route path="*" element={
    <main className="mx-auto max-w-7xl px-5 py-24 text-center">
      <h1 className="text-3xl font-bold">Página no encontrada</h1>
      <a href="/" className="mt-5 inline-block text-blue-600">
        Volver al inicio
      </a>
    </main>
  } />
</Routes>
</div>
    
  )
}

export default App
