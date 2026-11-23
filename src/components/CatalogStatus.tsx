
import {
  AlertCircle,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react'

type CatalogStatusProps = {
  loading: boolean
  error: string
  onRetry: () => void
}

export default function CatalogStatus({
  loading,
  error,
  onRetry,
}: CatalogStatusProps) {
  if (loading) {
    return (
      <div
        role="status"
        className="flex min-h-64 flex-col items-center justify-center gap-4 px-5 py-16 text-center"
      >
        <LoaderCircle
          size={34}
          className="animate-spin text-blue-600"
        />
        <p className="text-sm text-zinc-500">
          Cargando productos...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        className="mx-auto my-12 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/30"
      >
        <AlertCircle
          size={36}
          className="mx-auto mb-4 text-red-600"
        />

        <h2 className="text-xl font-bold">
          No pudimos cargar el catálogo
        </h2>

        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Ocurrió un problema de conexión.
          Inténtalo nuevamente en unos momentos.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <RefreshCw size={18} />
          Reintentar
        </button>
      </div>
    )
  }

  return null
}
