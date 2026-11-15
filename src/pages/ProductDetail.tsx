
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  MessageCircle,
} from 'lucide-react'

import { products } from '../data/products'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()

  const product = products.find((item) => item.slug === slug)

  const [activeImage, setActiveImage] = useState(0)

useEffect(() => {
  window.scrollTo(0, 0)
}, [])

  if (!product) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-5 text-center">
        <ImageOff size={48} className="mb-5 text-zinc-400" />

        <h1 className="text-3xl font-bold">
          Producto no encontrado
        </h1>

        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          El producto que buscas no existe o ya no está disponible.
        </p>

        <Link
          to="/#productos"
          className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Volver al catálogo
        </Link>
      </main>
    )
  }

  const gallery =
    product.images && product.images.length > 0
      ? product.images
      : [product.image]

  const nextImage = () => {
    setActiveImage((current) => (current + 1) % gallery.length)
  }

  const previousImage = () => {
    setActiveImage(
      (current) => (current - 1 + gallery.length) % gallery.length
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 lg:px-8 lg:py-12">

      <Link
        to="/#productos"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-blue-600 dark:text-zinc-400"
      >
        <ArrowLeft size={18} />
        Volver al catálogo
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

        {/* Galería de imágenes */}
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900">
            <img
              src={gallery[activeImage]}
              alt={`${product.name} - Imagen ${activeImage + 1}`}
              className="h-full w-full object-cover"
            />

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  aria-label="Imagen anterior"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-zinc-900 shadow-lg transition hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Imagen siguiente"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-zinc-900 shadow-lg transition hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                  aria-pressed={activeImage === index}
                  className={`aspect-square overflow-hidden rounded-xl border-2 transition ${
                    activeImage === index
                      ? 'border-blue-600'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} miniatura ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="flex flex-col justify-center">

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {product.category}
            </span>

            {product.featured && (
              <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                Trabajo destacado
              </span>
            )}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {product.name}
          </h1>

          <p className="mt-7 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>

          <div className="my-8 border-t border-zinc-200 dark:border-zinc-800" />

          <h2 className="text-lg font-bold">
            ¿Te interesa un trabajo similar?
          </h2>

          <p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
            Podemos ayudarte a desarrollar una propuesta personalizada.
            Consulta con nuestro equipo para conocer más detalles.
          </p>

          <div className="mt-8">
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white opacity-60"
              title="Disponible cuando configuremos el WhatsApp de la empresa"
            >
              <MessageCircle size={20} />
              Consultar por WhatsApp
            </button>

            <p className="mt-3 text-xs text-zinc-400">
              Próximamente configuraremos el número de contacto.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
