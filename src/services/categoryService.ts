
import { supabase } from '../lib/supabase'

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  position: number
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, position')
    .eq('is_visible', true)
    .order('position', { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}
