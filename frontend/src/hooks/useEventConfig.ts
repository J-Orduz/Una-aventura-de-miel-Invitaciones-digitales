import { useCallback, useEffect, useState } from 'react'
import { defaultEventConfig } from '../data/eventConfig'
import { eventService } from '../services/eventService'
import { isBackendConfigured } from '../services/http'
import type { EventDetails } from '../types/invitation'

/** Configuración global del evento compartida por todas las invitaciones. */
export function useEventConfig() {
  const [config, setConfig] = useState<EventDetails>(defaultEventConfig)
  const [loading, setLoading] = useState(() => isBackendConfigured())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isBackendConfigured()) return
    eventService
      .get()
      .then(setConfig)
      .catch(() => setError('No pudimos cargar los datos del evento.'))
      .finally(() => setLoading(false))
  }, [])

  const update = useCallback(async (next: EventDetails) => {
    const saved = await eventService.update(next)
    setConfig(saved)
    return saved
  }, [])

  const reset = useCallback(async () => {
    const saved = await eventService.update(defaultEventConfig)
    setConfig(saved)
    return saved
  }, [])

  return { config, update, reset, loading, error }
}
