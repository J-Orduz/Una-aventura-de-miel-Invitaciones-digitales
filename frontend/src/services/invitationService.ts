/**
 * Servicio de invitaciones.
 *
 * Habla con el Worker de Cloudflare cuando VITE_API_BASE_URL está configurada.
 * Si no lo está, cae en modo simulado con datos de prueba para no romper la
 * vista de diseño.
 */
import { getMockInvitationBySlug, mockInvitations } from '../data/mockInvitations'
import { loadEventConfig } from '../data/eventConfig'
import type {
  ConfirmAssistanceResponse,
  Invitation,
  InvitationInput,
  InvitationPreview,
} from '../types/invitation'
import { ApiError, isBackendConfigured, request } from './http'

/** Tiempo simulado de red para mostrar estados de carga realistas. */
const SIMULATED_DELAY_MS = 900

async function simulateNetworkDelay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS))
}

function notConfigured(): never {
  throw new Error('BACKEND_NOT_CONFIGURED')
}

/** Convierte una invitación completa en el payload que espera el backend. */
export function toInvitationInput(invitation: Invitation): InvitationInput {
  return {
    nombre: invitation.nombre,
    slug: invitation.slug,
    mensaje: invitation.mensaje,
    estado: invitation.estado,
    regalos: invitation.regalos.map((gift) => ({
      nombre: gift.nombre,
      imagen: gift.imagen ?? null,
      descripcion: gift.descripcion ?? null,
    })),
  }
}

export const invitationService = {
  /** Obtiene una invitación pública por su slug. */
  async getInvitationBySlug(slug: string): Promise<Invitation> {
    if (!isBackendConfigured()) {
      await simulateNetworkDelay()
      const invitation = getMockInvitationBySlug(slug)
      if (!invitation) throw new Error('INVITATION_NOT_FOUND')
      return { ...invitation, evento: loadEventConfig() }
    }

    try {
      return await request<Invitation>(`/api/invitacion/${encodeURIComponent(slug)}`)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        throw new Error('INVITATION_NOT_FOUND')
      }
      const status = err instanceof ApiError ? err.status : 0
      throw new Error(`INVITATION_FETCH_FAILED:${status}`)
    }
  },

  /** Confirma la asistencia de un invitado. */
  async confirmAssistance(invitation: Invitation): Promise<ConfirmAssistanceResponse> {
    if (!isBackendConfigured()) {
      await simulateNetworkDelay()
      invitation.confirmacion = 'confirmed'
      invitation.fechaConfirmacion = new Date().toISOString()
      invitation.estado = 'respondida'
      return {
        ok: true,
        fechaConfirmacion: invitation.fechaConfirmacion,
        message: '¡Gracias por confirmar tu asistencia!',
      }
    }

    return request<ConfirmAssistanceResponse>('/api/invitacion/confirmar', {
      method: 'POST',
      body: { codigo: invitation.codigo, slug: invitation.slug },
    })
  },

  /** Lista de invitaciones para el panel administrativo. */
  async getInvitationsPreview(): Promise<InvitationPreview[]> {
    if (!isBackendConfigured()) {
      await simulateNetworkDelay()
      return mockInvitations.map((invitation) => ({
        id: invitation.id,
        slug: invitation.slug,
        nombre: invitation.nombre,
        estado: invitation.estado,
        confirmacion: invitation.confirmacion,
        fechaConfirmacion: invitation.fechaConfirmacion,
        regalosCount: invitation.regalos.length,
      }))
    }

    return request<InvitationPreview[]>('/api/invitaciones', { auth: true })
  },

  /** Obtiene una invitación completa por su id (para editar). */
  async getInvitationById(id: string): Promise<Invitation> {
    if (!isBackendConfigured()) {
      await simulateNetworkDelay()
      const invitation = mockInvitations.find((item) => item.id === id)
      if (!invitation) throw new Error('INVITATION_NOT_FOUND')
      return { ...invitation, evento: loadEventConfig() }
    }

    return request<Invitation>(`/api/invitaciones/${encodeURIComponent(id)}`, { auth: true })
  },

  /** Crea una invitación nueva. */
  async createInvitation(input: InvitationInput): Promise<Invitation> {
    if (!isBackendConfigured()) notConfigured()
    return request<Invitation>('/api/invitaciones', { method: 'POST', body: input, auth: true })
  },

  /** Actualiza una invitación existente. */
  async updateInvitation(id: string, input: InvitationInput): Promise<Invitation> {
    if (!isBackendConfigured()) notConfigured()
    return request<Invitation>(`/api/invitaciones/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: input,
      auth: true,
    })
  },

  /** Elimina una invitación. */
  async deleteInvitation(id: string): Promise<void> {
    if (!isBackendConfigured()) notConfigured()
    await request<{ ok: boolean }>(`/api/invitaciones/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      auth: true,
    })
  },
}
