
export type Product = {
  id: string
  slug: string
  name: string
  category: string
  description: string
  image: string
  images?: string[]
  featured: boolean
  createdAt: string
  published?: boolean
}
