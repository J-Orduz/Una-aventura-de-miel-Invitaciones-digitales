import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CalendarDays, Loader2, Lock, LogOut, Mail, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { InvitationsTable } from './InvitationsTable'
import { EventSettings } from './EventSettings'
import { useEventConfig } from '../../hooks/useEventConfig'
import { authService } from '../../services/authService'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import { HoneyPot } from '../../components/decorations/HoneyPot'

type Tab = 'invitaciones' | 'evento'
type AuthStatus = 'checking' | 'authed' | 'guest'

export function AdminPage() {
  const [status, setStatus] = useState<AuthStatus>(() =>
    isSupabaseConfigured() ? 'checking' : 'guest',
  )

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? 'authed' : 'guest')
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'authed' : 'guest')
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center texture-paper">
        <Loader2 className="h-8 w-8 animate-spin text-honey-dark" />
      </div>
    )
  }

  if (status === 'guest') {
    return <Login />
  }

  return <AdminDashboard onLogout={() => void authService.signOut()} />
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('invitaciones')
  const [eventVersion, setEventVersion] = useState(0)
  const {
    config: evento,
    update: updateEvento,
    reset: resetEvento,
    loading: eventoLoading,
    error: eventoError,
  } = useEventConfig()

  async function handleResetEvento() {
    await resetEvento()
    setEventVersion((v) => v + 1)
  }

  return (
    <div className="min-h-screen texture-paper">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0">
        <img
          src="/img/abeja.png"
          alt=""
          className="absolute left-[12%] w-12 h-10 object-contain opacity-70 animate-[bob_3.5s_ease-in-out_infinite]"
        />
        <img
          src="/img/abeja.png"
          alt=""
          className="absolute right-[16%] top-6 w-14 h-12 object-contain opacity-60 animate-[bob_4.5s_ease-in-out_infinite_0.6s]"
        />
        <img
          src="/img/abeja.png"
          alt=""
          className="absolute left-[45%] top-2 w-9 h-8 object-contain opacity-50 animate-[bob_3s_ease-in-out_infinite_1.2s]"
        />
      </div>
      <header className="border-b border-brown/10 bg-cream/70 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HoneyPot className="w-10 h-12 animate-[bob_3s_ease-in-out_infinite]" />
            <div>
              <p className="font-hand text-2xl text-brown-dark leading-none">Panel de invitaciones</p>
              <p className="text-sm text-brown/70">organizadores · Una Aventura de Miel</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-brown/20 px-4 py-2 text-sm text-brown hover:bg-brown/10"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </header>

      <nav className="sticky top-0 z-20 border-b border-brown/10 bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl gap-1 px-4 py-2">
          <TabButton active={tab === 'invitaciones'} onClick={() => setTab('invitaciones')}>
            <Users className="h-4 w-4" />
            Invitaciones
          </TabButton>
          <TabButton active={tab === 'evento'} onClick={() => setTab('evento')}>
            <CalendarDays className="h-4 w-4" />
            Datos del evento
          </TabButton>
        </div>
      </nav>

      <main>
        {tab === 'invitaciones' ? (
          <InvitationsTable />
        ) : eventoLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-honey-dark" />
          </div>
        ) : eventoError ? (
          <p className="mx-auto mt-8 flex max-w-3xl items-center gap-2 rounded-2xl bg-pooh-red/10 px-4 py-3 font-body text-sm text-pooh-red">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {eventoError}
          </p>
        ) : (
          <EventSettings key={eventVersion} evento={evento} onSave={updateEvento} onReset={handleResetEvento} />
        )}
      </main>

      <footer className="border-t border-brown/10 px-6 py-6 text-center">
        <Link to="/invitacion/familia-orduz" className="text-sm text-brown/60 underline-offset-4 hover:underline">
          Ver ejemplo de invitación (Familia Orduz)
        </Link>
      </footer>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm transition-colors ${
        active ? 'bg-honey text-brown-dark shadow-sm' : 'text-brown hover:bg-brown/10'
      }`}
    >
      {children}
    </button>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      await authService.signIn(email.trim(), password)
    } catch (err) {
      const notConfigured = err instanceof Error && err.message === 'AUTH_NOT_CONFIGURED'
      setError(
        notConfigured
          ? 'Falta configurar Supabase en el archivo .env.local.'
          : 'Credenciales incorrectas. Verifica tu correo y contraseña.',
      )
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 texture-paper">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl bg-cream soft-shadow p-8"
      >
        <div className="text-center">
          <HoneyPot className="mx-auto w-20 h-24 animate-[bob_4s_ease-in-out_infinite]" />
          <h1 className="mt-4 font-hand text-4xl text-brown-dark">Inicio de sesión</h1>
          <p className="mt-1 text-brown">Panel de organizadores · Una Aventura de Miel</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-1.5 block font-body text-sm font-medium text-brown">Correo</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brown/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                placeholder="tu-correo@ejemplo.com"
                autoComplete="email"
                className="w-full rounded-xl border border-brown/20 bg-warm-white py-3 pl-10 pr-4 font-body text-brown-dark focus:border-honey focus:outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block font-body text-sm font-medium text-brown">Contraseña</span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brown/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-brown/20 bg-warm-white py-3 pl-10 pr-4 font-body text-brown-dark focus:border-honey focus:outline-none"
              />
            </div>
          </label>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-pooh-red"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-honey py-3 font-hand text-2xl text-brown-dark shadow-md hover:bg-honey-dark hover:text-warm-white transition-colors disabled:opacity-60"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 rounded-xl bg-warm-white/70 px-4 py-3 text-center font-body text-xs text-brown/60">
          Usa las credenciales proporcionadas por el ingeniero Juan Orduz para el acceso.
        </p>
      </motion.div>
    </div>
  )
}
