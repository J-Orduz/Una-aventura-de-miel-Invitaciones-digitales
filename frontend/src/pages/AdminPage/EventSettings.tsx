import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, CalendarDays, Clock, Loader2, MapPin, RotateCcw, Save } from 'lucide-react'
import { MapEmbed, buildMapQuery } from '../../components/MapEmbed/MapEmbed'
import type { EventDetails } from '../../types/invitation'

interface EventSettingsProps {
  evento: EventDetails
  onSave: (evento: EventDetails) => Promise<EventDetails>
  onReset: () => Promise<void>
}

/**
 * Datos generales del baby shower editados una sola vez.
 * Se aplican automáticamente a todas las invitaciones.
 */
export function EventSettings({ evento, onSave, onReset }: EventSettingsProps) {
  const [form, setForm] = useState<EventDetails>(evento)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof EventDetails>(key: K, value: EventDetails[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const result = await onSave(form)
      setForm(result)
      setSaved(true)
    } catch {
      setError('No pudimos guardar los datos del evento. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  async function handleReset() {
    if (saving) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await onReset()
    } catch {
      setError('No pudimos restaurar los datos del evento.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-3xl bg-cream p-6 soft-shadow sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-honey-light text-brown-dark">
            <CalendarDays className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-hand text-3xl text-brown-dark">Datos del evento</h2>
            <p className="font-body text-brown">
              Estos datos son iguales para todas las invitaciones. Al cambiarlos aquí, se
              actualizan en todas automáticamente.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Field label="Nombre del evento">
            <input
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              placeholder="Una Aventura de Miel"
              className={inputCls}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fecha" icon={<CalendarDays className="h-4 w-4" />}>
              <input
                value={form.fecha}
                onChange={(e) => set('fecha', e.target.value)}
                placeholder="Sábado 24 de octubre"
                className={inputCls}
              />
            </Field>
            <Field label="Hora" icon={<Clock className="h-4 w-4" />}>
              <input
                value={form.hora}
                onChange={(e) => set('hora', e.target.value)}
                placeholder="3:00 p. m."
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Lugar" icon={<MapPin className="h-4 w-4" />}>
            <input
              value={form.lugar}
              onChange={(e) => set('lugar', e.target.value)}
              placeholder="Casa de la Familia Páez"
              className={inputCls}
            />
          </Field>

          <Field label="Dirección">
            <input
              value={form.direccion}
              onChange={(e) => set('direccion', e.target.value)}
              placeholder="Calle..."
              className={inputCls}
            />
          </Field>

          {buildMapQuery(form.lugar, form.direccion) && (
            <div>
              <p className="mb-1.5 font-hand text-xl text-brown">
                Vista previa del mapa (así lo verán los invitados)
              </p>
              <MapEmbed query={buildMapQuery(form.lugar, form.direccion)} />
            </div>
          )}

          <Field label="Mensaje de los padres">
            <textarea
              value={form.mensaje}
              onChange={(e) => set('mensaje', e.target.value)}
              rows={4}
              placeholder="Una fiesta con miel, globos y mucha ternura..."
              className={inputCls}
            />
          </Field>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full border border-brown/20 px-5 py-2.5 font-body text-brown hover:bg-brown/10 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Restaurar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-honey px-6 py-2.5 font-hand text-xl text-brown-dark shadow-md hover:bg-honey-dark hover:text-warm-white disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-end gap-2 font-body text-sm text-pooh-red"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </motion.p>
          )}

          {saved && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-right font-body text-sm text-sage-dark"
            >
              Datos guardados. Se aplicarán a todas las invitaciones.
            </motion.p>
          )}
        </form>
      </div>
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-brown/20 bg-warm-white px-4 py-2.5 font-body text-brown-dark focus:border-honey focus:outline-none'

function Field({
  label,
  icon,
  children,
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 font-hand text-xl text-brown">
        {icon}
        {label}
      </span>
      {children}
    </label>
  )
}