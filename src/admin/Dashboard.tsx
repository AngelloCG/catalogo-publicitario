
import { Link } from 'react-router-dom'
import {
  Package,
  FolderOpen,
  Star,
  CalendarDays,
  ArrowUpRight,
  Plus,
} from 'lucide-react'
import type { Product } from '../types/product'


type DashboardProps = {
  products: Product[]
}

export default function Dashboard({
  products,
}: DashboardProps) {

  const totalProducts = products.length

  const totalCategories = new Set(
    products.map((product) => product.category)
  ).size

  const featuredProducts = products.filter(
    (product) => product.featured
  ).length

  const recentProducts = [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)

  const statistics = [
    {
      label: 'Total de productos',
      value: totalProducts,
      icon: Package,
      color: 'text-blue-600',
      background: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Categorías',
      value: totalCategories,
      icon: FolderOpen,
      color: 'text-violet-600',
      background: 'bg-violet-50 dark:bg-violet-950',
    },
    {
      label: 'Destacados',
      value: featuredProducts,
      icon: Star,
      color: 'text-amber-600',
      background: 'bg-amber-50 dark:bg-amber-950',
    },
    {
      label: 'Trabajos recientes',
      value: recentProducts.length,
      icon: CalendarDays,
      color: 'text-emerald-600',
      background: 'bg-emerald-50 dark:bg-emerald-950',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Resumen general
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Bienvenido al centro de control de tu catálogo.
          </p>
        </div>

        <Link
          to="/admin/productos"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Gestionar productos
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${stat.background}`}>
                  <Icon size={22} className={stat.color} />
                </div>
              </div>

              <p className="mt-5 text-3xl font-bold">{stat.value}</p>

              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </p>
            </div>
          )
        })}
      </div>

      {/* Productos recientes */}
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-6">
          <div>
            <h2 className="text-lg font-bold">Trabajos recientes</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Últimos productos registrados
            </p>
          </div>

          <Link
            to="/admin/productos"
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
          >
            Ver todos <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {recentProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 p-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50 sm:p-5"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {product.name}
                </p>
                <p className="mt-1 truncate text-xs text-zinc-500">
                  {product.category}
                </p>
              </div>

              {product.featured && (
                <span className="hidden rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300 sm:inline">
                  Destacado
                </span>
              )}

              <Link
                to={`/productos/${product.slug}`}
                aria-label={`Ver ${product.name}`}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800"
              >
                <ArrowUpRight size={20} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-zinc-400">
        Panel de demostración. Los datos todavía provienen de products.ts.
      </p>
    </div>
  )
}
