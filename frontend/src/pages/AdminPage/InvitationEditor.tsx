import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Gift, Loader2, Plus, Save, Trash2, X } from 'lucide-react'
import type { Gift as GiftData, Invitation, InvitationInput } from '../../types/invitation'

interface InvitationEditorProps {
  initial?: Invitation | null
  onSave: (input: InvitationInput) => Promise<void>
  onClose: () => void
}

interface GiftForm {
  id: string
  nombre: string
  descripcion: string
  imagen: string
}

const emptyGift = (): GiftForm => ({ id: crypto.randomUUID(), nombre: '', descripcion: '', imagen: '' })

export function InvitationEditor({ initial, onSave, onClose }: InvitationEditorProps) {
  const [nombre, setNombre] = useState(initial?.nombre ?? '')
  const [mensaje, setMensaje] = useState(initial?.mensaje ?? '')
  const [regalos, setRegalos] = useState<GiftForm[]>(
    initial?.regalos.map((g) => ({
      id: g.id,
      nombre: g.nombre,
      descripcion: g.descripcion ?? '',
      imagen: g.imagen ?? '',
    })) ?? [emptyGift()],
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!nombre.trim() || saving) return

    const input: InvitationInput = {
      nombre: nombre.trim(),
      mensaje: mensaje.trim() || 'Queremos compartir con ustedes un momento muy especial.',
      estado: initial?.estado ?? 'enviada',
      regalos: regalos
        .filter((g) => g.nombre.trim() !== '')
        .map<GiftData>((g) => ({
          id: g.id,
          nombre: g.nombre.trim(),
          descripcion: g.descripcion.trim() || null,
          imagen: g.imagen.trim() || null,
        })),
    }

    setSaving(true)
    setError(null)
    try {
      await onSave(input)
      onClose()
    } catch {
      setError('No pudimos guardar los cambios. Intenta de nuevo.')
      setSaving(false)
    }
  }

  function updateGift(id: string, patch: Partial<GiftForm>) {
    setRegalos((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brown-dark/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-cream soft-shadow"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brown/10 px-6 py-4 bg-cream/95 backdrop-blur">
          <h2 className="font-hand text-3xl text-brown-dark">
            {initial ? 'Editar invitación' : 'Nueva invitación'}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-brown/60 hover:bg-brown/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <Field label="Nombre del invitado o familia">
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Familia Orduz"
              className={inputCls}
            />
          </Field>

          <Field label="Mensaje personalizado">
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={4}
              placeholder="Querida Familia Orduz:..."
              className={inputCls}
            />
          </Field>

          <div className="rounded-2xl border border-honey/40 bg-honey-light/30 px-4 py-3">
            <p className="font-body text-sm text-brown">
              <strong className="font-hand text-base text-brown-dark">Datos del evento:</strong> fecha,
              hora, lugar y dirección se configuran una sola vez en la pestaña{' '}
              <strong>Datos del evento</strong> y se aplican a todas las invitaciones.
            </p>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 font-hand text-xl text-brown-dark">
              <Gift className="h-5 w-5 text-honey-dark" />
              Regalos asignados
            </p>
            <div className="space-y-3">
              {regalos.map((regalo) => (
                <div key={regalo.id} className="rounded-2xl border border-brown/15 bg-warm-white p-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={regalo.nombre}
                      onChange={(e) => updateGift(regalo.id, { nombre: e.target.value })}
                      placeholder="Nombre del regalo (ej. Pañales talla M)"
                      className={inputCls}
                    />
                    <button
                      onClick={() => setRegalos((prev) => prev.filter((g) => g.id !== regalo.id))}
                      className="rounded-full p-2 text-pooh-red/70 hover:bg-pooh-red/10"
                      aria-label="Eliminar regalo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <input
                      value={regalo.imagen}
                      onChange={(e) => updateGift(regalo.id, { imagen: e.target.value })}
                      placeholder="URL de la imagen (opcional)"
                      className={inputCls}
                    />
                    <input
                      value={regalo.descripcion}
                      onChange={(e) => updateGift(regalo.id, { descripcion: e.target.value })}
                      placeholder="Descripción (opcional)"
                      className={inputCls}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => setRegalos((prev) => [...prev, emptyGift()])}
                className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-honey-dark/50 px-4 py-2 text-brown-dark hover:bg-honey-light/40"
              >
                <Plus className="h-4 w-4" />
                Agregar otro regalo
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-brown/10 bg-cream/95 px-6 py-4 backdrop-blur">
          {error && (
            <p className="mb-3 flex items-center gap-2 font-body text-sm text-pooh-red">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} className="rounded-full px-5 py-2 font-body text-lg text-brown hover:bg-brown/10">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!nombre.trim() || saving}
              className="inline-flex items-center gap-2 rounded-full bg-honey px-6 py-2.5 font-hand text-xl text-brown-dark shadow-md hover:bg-honey-dark hover:text-warm-white disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const inputCls = 'w-full rounded-xl border border-brown/20 bg-warm-white px-4 py-2.5 font-body text-brown-dark focus:border-honey focus:outline-none'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-hand text-xl text-brown">{label}</span>
      {children}
    </label>
  )
}