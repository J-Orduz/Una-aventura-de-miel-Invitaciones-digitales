import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, CheckCircle2, Clock3, Copy, Loader2, Pencil, Plus, Search, Trash2, UserX } from 'lucide-react'
import { InvitationEditor } from './InvitationEditor'
import { useAdminInvitations } from './useAdminInvitations'
import type { Invitation } from '../../types/invitation'

export function InvitationsTable() {
  const {
    previews,
    filtered,
    loading,
    error,
    filter,
    setFilter,
    search,
    setSearch,
    load,
    getById,
    addInvitation,
    updateInvitation,
    removeInvitation,
  } = useAdminInvitations()

  const [editing, setEditing] = useState<Invitation | null>(null)
  const [creating, setCreating] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function copyLink(id: string, slug: string) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/invitacion/${slug}`)
      setCopiedId(id)
      window.setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000)
    } catch {
      setActionError('No pudimos copiar el enlace.')
    }
  }

  useEffect(() => {
    void load()
  }, [load])

  async function openEditor(id: string) {
    setActionError(null)
    try {
      setEditing(await getById(id))
    } catch {
      setActionError('No pudimos abrir la invitación. Intenta de nuevo.')
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setActionError(null)
    try {
      await removeInvitation(id)
    } catch {
      setActionError('No pudimos eliminar la invitación.')
    } finally {
      setDeletingId(null)
      setConfirmingDelete(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-hand text-4xl text-brown-dark">Invitaciones</h1>
          <p className="text-brown">{previews.length} invitaciones · organiza tus invitados</p>
        </div>
        <button
          onClick={() => {
            setActionError(null)
            setCreating(true)
          }}
          className="inline-flex items-center gap-2 rounded-full bg-honey px-6 py-3 font-hand text-xl text-brown-dark shadow-md hover:bg-honey-dark hover:text-warm-white"
        >
          <Plus className="h-5 w-5" />
          Crear invitación
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brown/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full rounded-full border border-brown/20 bg-warm-white py-2.5 pl-10 pr-4 font-body text-brown-dark focus:border-honey focus:outline-none"
          />
        </div>
        <div className="flex overflow-hidden rounded-full border border-brown/20 bg-warm-white">
          {(['todas', 'confirmadas', 'pendientes'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2 font-body text-sm capitalize transition-colors ${
                filter === option ? 'bg-honey text-brown-dark' : 'text-brown hover:bg-cream'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {(error || actionError) && (
        <p className="mt-4 flex items-center gap-2 rounded-2xl bg-pooh-red/10 px-4 py-3 font-body text-sm text-pooh-red">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {actionError ?? error}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-honey-dark" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-brown">
            <UserX className="h-10 w-10 opacity-40" />
            <p className="mt-4 font-body">No hay invitaciones para mostrar.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-warm-white px-5 py-4 soft-shadow"
            >
              <div className="min-w-0">
                <p className="truncate font-hand text-2xl text-brown-dark">{item.nombre}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-brown/70">
                  {item.confirmacion === 'confirmed' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-sage-dark" />
                      Confirmó el {formatDate(item.fechaConfirmacion)}
                    </>
                  ) : (
                    <>
                      <Clock3 className="h-4 w-4 text-honey-dark" />
                      Pendiente de confirmar
                    </>
                  )}
                  <span className="mx-1 text-brown/30">·</span>
                  {item.regalosCount} regalo{item.regalosCount !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyLink(item.id, item.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-body text-sm text-brown hover:bg-honey-light"
                  title="Copiar enlace de invitación"
                >
                  {copiedId === item.id ? (
                    <Check className="h-4 w-4 text-sage-dark" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedId === item.id ? '¡Copiado!' : 'Copiar link'}
                </button>

                <button
                  onClick={() => openEditor(item.id)}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-body text-sm text-brown hover:bg-sage-light"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </button>

                {confirmingDelete === item.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-pooh-red">¿Eliminar?</span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-pooh-red px-3 py-1.5 text-sm text-warm-white hover:opacity-90 disabled:opacity-60"
                    >
                      {deletingId === item.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Sí
                    </button>
                    <button
                      onClick={() => setConfirmingDelete(null)}
                      className="rounded-full border border-brown/20 px-3 py-1.5 text-sm text-brown"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingDelete(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-body text-sm text-pooh-red hover:bg-blush-light"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {(creating || editing) && (
          <InvitationEditor
            initial={editing}
            onClose={() => {
              setCreating(false)
              setEditing(null)
            }}
            onSave={async (input) => {
              if (editing) await updateInvitation(editing.id, input)
              else await addInvitation(input)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
