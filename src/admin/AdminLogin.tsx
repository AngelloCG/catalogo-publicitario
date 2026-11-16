
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (loginError || !data.user) {
        throw new Error('Correo o contraseña incorrectos.')
      }

      // Verificar que el usuario tiene autorización.
      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (adminError || !admin) {
        await supabase.auth.signOut()
        throw new Error('Esta cuenta no tiene acceso administrativo.')
      }

      navigate('/admin', { replace: true })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible iniciar sesión.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-md">

        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-blue-600 dark:text-zinc-400"
        >
          <ArrowLeft size={17} />
          Volver al catálogo
        </Link>

        <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:p-9">

          <div className="mb-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <ShieldCheck size={28} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Bienvenido de nuevo
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Inicia sesión para administrar los productos y
              contenidos de tu catálogo digital.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-semibold"
              >
                Correo electrónico
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 focus-within:border-blue-500 dark:border-zinc-700">
                <Mail size={19} className="text-zinc-400" />

                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@empresa.com"
                  className="w-full bg-transparent py-3.5 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-sm font-semibold"
              >
                Contraseña
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-zinc-200 px-4 focus-within:border-blue-500 dark:border-zinc-700">
                <LockKeyhole size={19} className="text-zinc-400" />

                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce tu contraseña"
                  className="min-w-0 w-full bg-transparent py-3.5 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? 'Ocultar contraseña'
                      : 'Mostrar contraseña'
                  }
                  className="text-zinc-400 hover:text-blue-600"
                >
                  {showPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Verificando acceso...
                </>
              ) : (
                <>
                  <LockKeyhole size={19} />
                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-xs text-zinc-400">
            Acceso exclusivo para personal autorizado
          </p>
        </div>
      </div>
    </main>
  )
}
