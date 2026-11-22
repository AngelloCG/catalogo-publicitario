
import { useState } from 'react'
import { Database, LoaderCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { getPublishedProducts } from '../services/productService'


export default function SupabaseConnectionTest() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [success, setSuccess] = useState(false)

  async function testConnection() {
    setLoading(true)
    setResult('')
    setSuccess(false)

    try {
      const products = await getPublishedProducts()

      setSuccess(true)
      setResult(
        `Conexión correcta. Productos publicados encontrados: ${products.length}`
      )
    } catch (error) {
      setResult(
        error instanceof Error
          ? error.message
          : 'Error desconocido al consultar Supabase.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto my-8 max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-3">
        <Database className="text-blue-600" size={26} />
        <h2 className="text-xl font-bold">
          Prueba de conexión Supabase
        </h2>
      </div>

      <button
        type="button"
        onClick={testConnection}
        disabled={loading}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading && <LoaderCircle size={18} className="animate-spin" />}
        Comprobar conexión
      </button>

      {result && (
        <div
          role="status"
          className={`mt-4 flex items-start gap-2 rounded-xl p-4 text-sm ${
            success
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
          }`}
        >
          {success
            ? <CheckCircle2 size={20} />
            : <AlertCircle size={20} />}
          <span>{result}</span>
        </div>
      )}
    </section>
  )
}
