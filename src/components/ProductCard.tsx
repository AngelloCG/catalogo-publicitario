
import { ArrowUpRight } from 'lucide-react'
import type { Product } from '../types/product'
import { Link } from 'react-router-dom'

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
        to={`/productos/${product.slug}`}
        className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            Destacado
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          {product.category}
        </p>

        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            {product.name}
          </h3>
          <ArrowUpRight
            size={20}
            className="shrink-0 text-zinc-400 transition-colors group-hover:text-blue-600"
          />
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>
      </div>
    </Link>
  )
}
