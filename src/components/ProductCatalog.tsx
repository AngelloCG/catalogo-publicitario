
import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { Product } from '../types/product'
import ProductCard from './ProductCard'

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}


type ProductCatalogProps = {
  products: Product[]
}

export default function ProductCatalog({
  products,
}: ProductCatalogProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')

const categories = useMemo(
  () => ['Todas', ...new Set(products.map((p) => p.category))],
  [products]
)

  const filteredProducts = useMemo(() => {
    const term = normalizeText(search.trim())

    return products
      .filter((product) => {
        const matchesCategory =
          category === 'Todas' || product.category === category

        const searchableText = normalizeText(
          `${product.name} ${product.description} ${product.category}`
        )

        return matchesCategory && searchableText.includes(term)
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
}, [search, category, products])

  return (
    <section id="productos" className="bg-zinc-50 py-20 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Nuestro catálogo
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explora nuestros trabajos
          </h2>

          <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Descubre nuestros proyectos de publicidad, impresión
            y personalización.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 dark:border-zinc-700 dark:bg-zinc-900">
            <Search size={20} className="shrink-0 text-zinc-400" />

            <input
              id="buscador-catalogo"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              className="w-full bg-transparent py-4 text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 dark:border-zinc-700 dark:bg-zinc-900">
            <SlidersHorizontal size={19} className="text-zinc-400" />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filtrar por categoría"
              className="w-full bg-transparent py-4 text-sm outline-none md:min-w-48"
            >
              {categories.map((item) => (
                <option key={item} value={item} className="text-zinc-900">
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          {filteredProducts.length} productos encontrados
        </p>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-16 text-center dark:border-zinc-700">
            <Search size={32} className="mx-auto mb-4 text-zinc-400" />
            <h3 className="text-lg font-semibold">
              No encontramos resultados
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Prueba con otra palabra o categoría.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setCategory('Todas')
              }}
              className="mt-5 font-semibold text-blue-600 hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
