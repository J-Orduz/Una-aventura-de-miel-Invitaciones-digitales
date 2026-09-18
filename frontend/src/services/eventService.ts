import { defaultEventConfig, loadEventConfig, saveEventConfig } from '../data/eventConfig'
import type { EventDetails } from '../types/invitation'
import { isBackendConfigured, request } from './http'

/** Datos globales del evento (se comparten entre todas las invitaciones). */
export const eventService = {
  async get(): Promise<EventDetails> {
    if (!isBackendConfigured()) return loadEventConfig()
    return request<EventDetails>('/api/evento', { auth: true })
  },

  async update(evento: EventDetails): Promise<EventDetails> {
    if (!isBackendConfigured()) {
      saveEventConfig(evento)
      return evento
    }
    return request<EventDetails>('/api/evento', { method: 'PUT', body: evento, auth: true })
  },

  defaults(): EventDetails {
    return defaultEventConfig
  },
}
