
import { supabase } from '../lib/supabase'
import type { Product } from '../types/product'

type ProductRow = {
  id: string
  slug: string
  name: string
  description: string
  cover_image: string | null
  featured: boolean
  is_published: boolean
  created_at: string
  categories: {
    id: string
    name: string
    slug: string
  }[]
  product_images: {
    id: string
    image_url: string
    position: number
  }[]
}

const productQuery = `
  id,
  slug,
  name,
  description,
  cover_image,
  featured,
  is_published,
  created_at,
  categories (
    id,
    name,
    slug
  ),
  product_images (
    id,
    image_url,
    position
  )
`

function mapProduct(row: ProductRow): Product {
  const gallery = [...(row.product_images ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((item) => item.image_url)

  const images = [
    row.cover_image,
    ...gallery,
  ].filter((url): url is string => Boolean(url))

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.categories?.[0]?.name ?? 'Sin categoría',
    description: row.description,
    image: images[0] ?? '',
    images: [...new Set(images)],
    featured: row.featured,
    createdAt: row.created_at,
    published: row.is_published,
  }
}

// Productos visibles para los visitantes
export async function getPublishedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(productQuery)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data as ProductRow[]).map(mapProduct)
}

// Todos los productos para el administrador
export async function getAdminProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(productQuery)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data as ProductRow[]).map(mapProduct)
}

export type SaveProductInput = {
  product: Product
  categoryId: string
  published: boolean
  isEditing: boolean
}

// Crear o actualizar un producto
export async function saveProduct({
  product,
  categoryId,
  published,
  isEditing,
}: SaveProductInput): Promise<void> {
  const values = {
    name: product.name,
    slug: product.slug,
    description: product.description,
    category_id: categoryId,
    cover_image: product.image,
    featured: product.featured,
    is_published: published,
  }

  if (isEditing) {
    const { data, error } = await supabase
      .from('products')
      .update(values)
      .eq('id', product.id)
      .select('id')
      .single()

    if (error) throw error

    if (!data) {
      throw new Error('No se pudo actualizar el producto.')
    }

    return
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      id: product.id,
      ...values,
    })
    .select('id')
    .single()

  if (error) throw error

  if (!data) {
    throw new Error('No se pudo crear el producto.')
  }
}

// Eliminar un producto
export async function deleteProduct(
  productId: string
): Promise<void> {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .select('id')
    .single()

  if (error) throw error

  if (!data) {
    throw new Error('No se pudo eliminar el producto.')
  }
}
