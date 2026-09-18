export interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  ALLOWED_ORIGIN?: string
}

export type ConfirmationState = 'pending' | 'confirmed'
export type InvitationEstado = 'activa' | 'inactiva' | 'enviada' | 'respondida'

export interface EventDetails {
  nombre: string
  fecha: string
  hora: string
  lugar: string
  direccion: string
  mensaje: string
}

export interface Gift {
  id: string
  nombre: string
  imagen?: string | null
  descripcion?: string | null
}

export interface Invitation {
  id: string
  slug: string
  codigo: string
  nombre: string
  mensaje: string
  confirmacion: ConfirmationState
  fechaConfirmacion: string | null
  estado: InvitationEstado
  fechaCreacion: string
  evento: EventDetails
  regalos: Gift[]
}

export interface InvitationPreview {
  id: string
  slug: string
  nombre: string
  estado: InvitationEstado
  confirmacion: ConfirmationState
  fechaConfirmacion: string | null
  regalosCount: number
}

/** Filas tal como se guardan en Postgres (snake_case). */
export interface DbEvento {
  id: number
  nombre: string
  fecha: string
  hora: string
  lugar: string
  direccion: string
  mensaje: string
  updated_at: string
}

export interface DbInvitation {
  id: string
  slug: string
  codigo: string
  nombre: string
  mensaje: string
  confirmacion: ConfirmationState
  fecha_confirmacion: string | null
  estado: InvitationEstado
  fecha_creacion: string
}

export interface DbGift {
  id: string
  invitacion_id: string
  nombre: string
  imagen: string | null
  descripcion: string | null
  orden: number
}

export interface InvitationInput {
  nombre?: string
  slug?: string
  mensaje?: string
  estado?: InvitationEstado
  regalos?: Array<{
    id?: string
    nombre: string
    imagen?: string | null
    descripcion?: string | null
  }>
}
