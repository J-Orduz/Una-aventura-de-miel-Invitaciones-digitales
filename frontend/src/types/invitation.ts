export type ConfirmationState = 'pending' | 'confirmed'

export interface Gift {
  id: string
  nombre: string
  imagen?: string | null
  descripcion?: string | null
}

export interface EventDetails {
  nombre: string
  fecha: string
  hora: string
  lugar: string
  direccion: string
  mensaje: string
}

export interface Invitation {
  id: string
  slug: string
  codigo: string
  nombre: string
  mensaje: string
  confirmacion: ConfirmationState
  fechaConfirmacion: string | null
  estado: 'activa' | 'inactiva' | 'enviada' | 'respondida'
  fechaCreacion: string
  evento: EventDetails
  regalos: Gift[]
}

export interface GiftInput {
  nombre: string
  imagen?: string | null
  descripcion?: string | null
}

/** Campos editables de una invitación (lo que se envía al backend). */
export interface InvitationInput {
  nombre: string
  slug: string
  mensaje: string
  estado?: Invitation['estado']
  regalos?: GiftInput[]
}

export interface InvitationPreview {
  id: string
  slug: string
  nombre: string
  estado: Invitation['estado']
  confirmacion: ConfirmationState
  fechaConfirmacion: string | null
  regalosCount: number
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface ConfirmAssistanceResponse {
  ok: boolean
  message?: string
  fechaConfirmacion?: string
}