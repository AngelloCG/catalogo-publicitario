
import type { Product } from '../types/product'

export const products: Product[] = [
  {
    id: '1',
    name: 'Aviso luminoso LED',
    category: 'Avisos publicitarios',
    description: 'Aviso con letras volumétricas e iluminación LED.',
    image: 'https://placehold.co/900x700/1d4ed8/ffffff?text=Aviso+Luminoso',
    featured: true,
    createdAt: '2026-11-14',
  },
  {
    id: '2',
    name: 'Pendón publicitario',
    category: 'Impresión digital',
    description: 'Pendón personalizado de alta calidad para eventos.',
    image: 'https://placehold.co/900x700/7c3aed/ffffff?text=Pendon+Publicitario',
    featured: true,
    createdAt: '2026-11-13',
  },
  {
    id: '3',
    name: 'Trofeo en acrílico',
    category: 'Recordatorios',
    description: 'Trofeo personalizado elaborado en acrílico.',
    image: 'https://placehold.co/900x700/ca8a04/ffffff?text=Trofeo+Acrilico',
    featured: false,
    createdAt: '2026-11-12',
  },
  {
    id: '4',
    name: 'Sello automático',
    category: 'Sellos',
    description: 'Sello personalizado para empresas y oficinas.',
    image: 'https://placehold.co/900x700/0f766e/ffffff?text=Sello+Automatico',
    featured: false,
    createdAt: '2026-11-11',
  },
  {
    id: '5',
    name: 'Letras volumétricas',
    category: 'Avisos publicitarios',
    description: 'Letras tridimensionales para fachadas comerciales.',
    image: 'https://placehold.co/900x700/be123c/ffffff?text=Letras+Volumetricas',
    featured: true,
    createdAt: '2026-11-10',
  },
  {
    id: '6',
    name: 'Banner personalizado',
    category: 'Impresión digital',
    description: 'Impresión de banner para publicidad y eventos.',
    image: 'https://placehold.co/900x700/334155/ffffff?text=Banner',
    featured: false,
    createdAt: '2026-11-09',
  },
]
