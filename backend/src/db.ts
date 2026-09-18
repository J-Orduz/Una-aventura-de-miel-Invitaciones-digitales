import type { SupabaseClient } from '@supabase/supabase-js'
import { HttpError } from './http'
import type {
  DbEvento,
  DbGift,
  DbInvitation,
  EventDetails,
  Gift,
  Invitation,
  InvitationPreview,
} from './types'

/** Evento de respaldo si la tabla está vacía. */
export const DEFAULT_EVENTO: EventDetails = {
  nombre: 'Una Aventura de Miel',
  fecha: 'Sábado 10 de octubre',
  hora: '3:00 p. m.',
  lugar: 'Salón Comunal Las Flores 1',
  direccion: 'Calle de los Sauces #12-34, Bosque de los Cien Acres',
  mensaje:
    'Una fiesta con miel, globos y mucha ternura para darle la bienvenida a nuestro pequeño. ¡No hay nada más dulce que compartir con ustedes!',
}

function assertOk(error: unknown): void {
  if (error) throw new HttpError(500, 'DB_ERROR')
}

export async function fetchEvento(db: SupabaseClient): Promise<EventDetails> {
  const { data, error } = await db.from('evento').select('*').eq('id', 1).maybeSingle()
  assertOk(error)
  if (!data) return DEFAULT_EVENTO
  const row = data as DbEvento
  return {
    nombre: row.nombre,
    fecha: row.fecha,
    hora: row.hora,
    lugar: row.lugar,
    direccion: row.direccion,
    mensaje: row.mensaje,
  }
}

export async function fetchRegalos(db: SupabaseClient, invitacionId: string): Promise<DbGift[]> {
  const { data, error } = await db
    .from('regalos')
    .select('*')
    .eq('invitacion_id', invitacionId)
    .order('orden', { ascending: true })
  assertOk(error)
  return (data ?? []) as DbGift[]
}

export function mapGift(row: DbGift): Gift {
  return {
    id: row.id,
    nombre: row.nombre,
    imagen: row.imagen,
    descripcion: row.descripcion,
  }
}

export function mapInvitation(row: DbInvitation, evento: EventDetails, regalos: DbGift[]): Invitation {
  return {
    id: row.id,
    slug: row.slug,
    codigo: row.codigo,
    nombre: row.nombre,
    mensaje: row.mensaje,
    confirmacion: row.confirmacion,
    fechaConfirmacion: row.fecha_confirmacion,
    estado: row.estado,
    fechaCreacion: row.fecha_creacion,
    evento,
    regalos: regalos.map(mapGift),
  }
}

export function mapPreview(row: DbInvitation, regalosCount: number): InvitationPreview {
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    estado: row.estado,
    confirmacion: row.confirmacion,
    fechaConfirmacion: row.fecha_confirmacion,
    regalosCount,
  }
}

/** Genera un código de invitación legible a partir del slug. */
export function buildCodigo(slug: string): string {
  const base = slug
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${base}-${random}`
}
