

import { useEffect, useState, type FormEvent } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Package,
  Star,
  CheckCircle2,
} from 'lucide-react'
import type { Product } from '../types/product'


type ProductManagerProps = {
  products: Product[]
  categories: string[]
  onSave: (product: Product) => Promise<void>
  onDelete: (id: string) => Promise<void>
}


type ProductForm = {
  name: string
  category: string
  description: string
  image: string
  featured: boolean
  published: boolean
}


const emptyForm: ProductForm = {
  name: '',
  category: '',
  description: '',
  image: '',
  featured: false,
  published: true,
}


function makeSlug(name: string, id: string) {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `${base || 'producto'}-${id.slice(0, 8)}`
}


export default function ProductManager({
  products,
  categories,
  onSave,
  onDelete,
}: ProductManagerProps) {

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)


// Ocultar la notificación automáticamente
useEffect(() => {
  if (!message) return

  const timeout = window.setTimeout(() => {
    setMessage('')
  }, 3500)

  return () => window.clearTimeout(timeout)
}, [message])

// Controlar el comportamiento de la ventana emergente
useEffect(() => {
  if (!formOpen) return

  const previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  function handleEscape(event: KeyboardEvent) {
if (event.key === 'Escape' && !saving) {
  setFormOpen(false)
}
  }

  window.addEventListener('keydown', handleEscape)

  return () => {
    document.body.style.overflow = previousOverflow
    window.removeEventListener('keydown', handleEscape)
  }
}, [formOpen, saving])


  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category} ${product.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )


  function openCreate() {
    setEditingProduct(null)
    setForm(emptyForm)
    setError('')
    setMessage('')
    setFormOpen(true)
  }

  function openEdit(product: Product) {
    setEditingProduct(product)
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      image: product.image,
      featured: product.featured,
      published: product.published ?? true,
    })
    setError('')
    setMessage('')
    setFormOpen(true)
  }


  function closeForm() {
    if (saving) return

    setFormOpen(false)
    setEditingProduct(null)
    setError('')
  }



async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  if (saving || deletingId !== null) return

  setError('')

  const name = form.name.trim()
  const category = form.category.trim()
  const description = form.description.trim()
  const image = form.image.trim()

  if (!name || !category || !description || !image) {
    setError('Completa todos los campos obligatorios.')
    return
  }

  if (!categories.includes(category)) {
    setError('Selecciona una categoría válida.')
    return
  }

  try {
    const url = new URL(image)

    if (url.protocol !== 'https:') {
      throw new Error('Protocolo no permitido')
    }
  } catch {
    setError('Introduce una URL de imagen HTTPS válida.')
    return
  }

  const id = editingProduct?.id ?? crypto.randomUUID()

  const updatedProduct: Product = {
    id,
    slug: editingProduct?.slug ?? makeSlug(name, id),
    name,
    category,
    description,
    image,
    images: [image],
    featured: form.featured,
    published: form.published,
    createdAt:
      editingProduct?.createdAt ?? new Date().toISOString(),
  }

  setSaving(true)

  try {
    await onSave(updatedProduct)

    const wasEditing = Boolean(editingProduct)

    setFormOpen(false)
    setEditingProduct(null)
    setError('')

    setMessage(
      wasEditing
        ? 'Producto actualizado correctamente.'
        : 'Producto creado correctamente.'
    )
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'No se pudo guardar el producto.'
    )
  } finally {
    setSaving(false)
  }
}



async function handleDelete(product: Product) {
  if (saving || deletingId !== null) return

  const confirmed = window.confirm(
    `¿Estás seguro de que deseas eliminar "${product.name}"?`
  )

  if (!confirmed) return

  setDeletingId(product.id)
  setError('')
  setMessage('')

  try {
    await onDelete(product.id)
    setMessage('Producto eliminado correctamente.')
  } catch (err) {
    window.alert(
      err instanceof Error
        ? `No se pudo eliminar: ${err.message}`
        : 'No se pudo eliminar el producto.'
    )
  } finally {
    setDeletingId(null)
  }
}


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Productos
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Administra los trabajos de tu catálogo digital.
          </p>
        </div>

        <button
          type="button"
          disabled={saving || deletingId !== null}
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={19} />
          Nuevo producto
        </button>
      </div>

      
{/* Notificación flotante */}
{message && (
  <div
    role="status"
    aria-live="polite"
    className="fixed right-4 top-24 z-[110] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-2xl dark:border-emerald-900 dark:bg-zinc-900 sm:right-6 sm:max-w-md"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
      <CheckCircle2
        size={22}
        className="text-emerald-600 dark:text-emerald-400"
      />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-bold text-zinc-900 dark:text-white">
        Operación exitosa
      </p>

      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {message}
      </p>
    </div>

    <button
      type="button"
      onClick={() => setMessage('')}
      aria-label="Cerrar notificación"
      className="rounded-lg p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
    >
      <X size={18} />
    </button>
  </div>
)}


      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Todos los productos</h2>
            <p className="mt-1 text-xs text-zinc-500">
              {products.length} productos registrados
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 dark:border-zinc-700">
            <Search size={18} className="text-zinc-400" />
            <input
              type="search"
              placeholder="Buscar productos..."
              aria-label="Buscar productos administrativos"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent py-3 text-sm outline-none sm:w-56"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <Package size={38} className="mx-auto text-zinc-400" />
              <p className="mt-3 font-medium">
                No se encontraron productos
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800 sm:flex-nowrap"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 shrink-0 rounded-lg bg-zinc-100 object-cover dark:bg-zinc-800"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {product.category}
                  </p>

                  {product.featured && (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                      <Star size={12} />
                      Destacado
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    aria-label={`Editar ${product.name}`}
                    className="rounded-lg border border-zinc-200 p-2.5 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  disabled={saving || deletingId !== null}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    aria-label={`Eliminar ${product.name}`}
                    className="rounded-lg border border-red-200 p-2.5 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                 disabled={saving || deletingId !== null}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      
{formOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">

    {/* Fondo oscuro */}
    <button
      type="button"
      aria-label="Cerrar formulario"
      onClick={closeForm}
      className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
    />

    {/* Ventana del formulario */}
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="relative z-10 max-h-[90dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-7"
    >
    <div className="mb-6 flex items-center justify-between">
            
<h2
  id="product-modal-title"
  className="text-xl font-bold"
>
  {editingProduct ? 'Editar producto' : 'Nuevo producto'}
</h2>


            <button
              type="button"
              onClick={closeForm}
              aria-label="Cerrar formulario"
              className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="product-name" className="mb-2 block text-sm font-medium">
                Nombre del producto
              </label>
              <input
                id="product-name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Ej. Aviso luminoso personalizado"
                className="w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-3 outline-none focus:border-blue-500 dark:border-zinc-700"
              />
            </div>

            <div>
              <label htmlFor="product-category" className="mb-2 block text-sm font-medium">
                Categoría
              </label>

            <select
              id="product-category"
              required
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="">Selecciona una categoría</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            </div>

            <div>
              <label htmlFor="product-description" className="mb-2 block text-sm font-medium">
                Descripción
              </label>
              <textarea
                id="product-description"
                required
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe el trabajo realizado..."
                className="w-full resize-y rounded-xl border border-zinc-200 bg-transparent px-4 py-3 outline-none focus:border-blue-500 dark:border-zinc-700"
              />
            </div>

            <div>
              <label htmlFor="product-image" className="mb-2 block text-sm font-medium">
                URL de la imagen
              </label>
              <input
                id="product-image"
                type="url"
                required
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-3 outline-none focus:border-blue-500 dark:border-zinc-700"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Temporalmente usamos enlaces HTTPS. Después habilitaremos la carga directa de fotografías.
              </p>
            </div>

            {form.image.startsWith('https://') && (
              <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                <img
                  src={form.image}
                  alt="Vista previa del producto"
                  className="h-48 w-full bg-zinc-100 object-contain dark:bg-zinc-800"
                />
              </div>
            )}

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
                className="h-5 w-5 accent-blue-600"
              />
              <span className="text-sm font-medium">
                Marcar como producto destacado
              </span>
            </label>

<label className="flex cursor-pointer items-center gap-3">
  <input
    type="checkbox"
    checked={form.published}
    onChange={(e) =>
      setForm({ ...form, published: e.target.checked })
    }
    className="h-5 w-5 accent-blue-600"
  />

  <span className="text-sm font-medium">
    Publicar producto en el catálogo
  </span>
</label>

<p className="text-xs text-zinc-500">
  Si desactivas esta opción, el producto quedará
  guardado como borrador.
</p>


            {error && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold dark:border-zinc-700"
              >
                Cancelar
              </button>


            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Save size={18} />
              {saving ? 'Guardando...' : 'Guardar producto'}
            </button>

            </div>

          </form>
        </div>
      </div>
      )}
    </div>
  )
}
