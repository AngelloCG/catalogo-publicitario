
import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, LoaderCircle, RefreshCw } from 'lucide-react'
import ProductManager from './ProductManager'
import type { Product } from '../types/product'
import {
  getAdminProducts,
  saveProduct,
  deleteProduct,
} from '../services/productService'
import { getCategories } from '../services/categoryService'

type Category = Awaited<ReturnType<typeof getCategories>>[number]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [productData, categoryData] = await Promise.all([
        getAdminProducts(),
        getCategories(),
      ])

      setProducts(productData)
      setCategories(categoryData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los datos.'
      )
    } finally {
      setLoading(false)
    }
  }, [])


useEffect(() => {
  let active = true

  async function initialize() {
    try {
      const [productData, categoryData] = await Promise.all([
        getAdminProducts(),
        getCategories(),
      ])

      if (!active) return

      setProducts(productData)
      setCategories(categoryData)
      setError('')
    } catch (err) {
      if (!active) return

      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los datos.'
      )
    } finally {
      if (active) {
        setLoading(false)
      }
    }
  }

  void initialize()

  return () => {
    active = false
  }
}, [])


  async function handleSave(product: Product) {
    const category = categories.find(
      (item) => item.name === product.category
    )

    if (!category) {
      throw new Error('Selecciona una categoría válida.')
    }

    const isEditing = products.some(
      (item) => item.id === product.id
    )

    await saveProduct({
      product,
      categoryId: category.id,
      published: product.published ?? true,
      isEditing,
    })

    await loadData()
  }

  async function handleDelete(id: string) {
    await deleteProduct(id)
    await loadData()
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-zinc-500">
        <LoaderCircle className="animate-spin" size={24} />
        Cargando productos de Supabase...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
        <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
          <AlertCircle size={22} />
          <h2 className="font-semibold">
            No se pudieron cargar los productos
          </h2>
        </div>

        <p className="mt-3 text-sm">{error}</p>

        <button
          type="button"
          onClick={() => void loadData()}
          className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
        >
          <RefreshCw size={18} />
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <ProductManager
      products={products}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  )
}
