
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { LoaderCircle, ShieldAlert } from 'lucide-react'
import { supabase } from '../lib/supabase'

type AccessStatus =
  | 'loading'
  | 'authorized'
  | 'unauthorized'
  | 'error'

export default function AdminGuard() {
  const [status, setStatus] = useState<AccessStatus>('loading')

  useEffect(() => {
    let active = true
    let requestId = 0

    async function verifyAccess() {
      const currentRequest = ++requestId

      try {
        const { data, error } = await supabase.auth.getUser()

        if (!active || currentRequest !== requestId) return

        if (error || !data.user) {
          setStatus('unauthorized')
          return
        }

        const { data: admin, error: adminError } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', data.user.id)
          .maybeSingle()

        if (!active || currentRequest !== requestId) return

        if (adminError) {
          setStatus('error')
          return
        }

        setStatus(admin ? 'authorized' : 'unauthorized')
      } catch {
        if (active && currentRequest === requestId) {
          setStatus('error')
        }
      }
    }

    void verifyAccess()

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
          ++requestId
          setStatus('unauthorized')
        }

        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          setStatus('loading')

          // Ejecutar consultas fuera del callback de Auth.
          window.setTimeout(() => {
            if (active) void verifyAccess()
          }, 0)
        }
      })

    return () => {
      active = false
      ++requestId
      subscription.unsubscribe()
    }
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-950">
        <LoaderCircle
          size={36}
          className="animate-spin text-blue-600"
        />
        <p className="text-sm text-zinc-500">
          Verificando permisos...
        </p>
      </div>
    )
  }

  if (status === 'unauthorized') {
    return <Navigate to="/admin/login" replace />
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
        <ShieldAlert size={42} className="text-amber-500" />
        <h1 className="text-xl font-bold">
          No pudimos verificar tus permisos
        </h1>
        <p className="max-w-md text-sm text-zinc-500">
          Comprueba tu conexión o la configuración de Supabase
          y vuelve a intentar acceder.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return <Outlet />
}
