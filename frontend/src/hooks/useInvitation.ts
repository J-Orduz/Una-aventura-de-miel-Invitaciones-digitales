import { useCallback, useEffect, useState } from 'react'
import { invitationService } from '../services/invitationService'
import type { ConfirmationState, Invitation, LoadingState } from '../types/invitation'

interface LoadResult {
  data?: Invitation
  error?: string
}

async function fetchInvitation(slug?: string): Promise<LoadResult> {
  if (!slug) return { error: 'INVITATION_NOT_FOUND' }
  try {
    const data = await invitationService.getInvitationBySlug(slug)
    return { data }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'UNKNOWN_ERROR' }
  }
}

export function useInvitation(slug: string | undefined) {
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [status, setStatus] = useState<LoadingState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [wasConfirmedOnLoad, setWasConfirmedOnLoad] = useState(false)

  const applyResult = useCallback((result: LoadResult) => {
    if (result.error) {
      setInvitation(null)
      setStatus('error')
      setError(result.error)
      return
    }
    setInvitation(result.data ?? null)
    setWasConfirmedOnLoad(result.data?.confirmacion === 'confirmed')
    setStatus('success')
    setError(null)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchInvitation(slug).then((result) => {
      if (!cancelled) applyResult(result)
    })
    return () => {
      cancelled = true
    }
  }, [slug, applyResult])

  const retry = useCallback(() => {
    setStatus('loading')
    setError(null)
    fetchInvitation(slug).then(applyResult)
  }, [slug, applyResult])

  const updateConfirmation = useCallback(
    (state: ConfirmationState, fecha?: string) => {
      setInvitation((prev) =>
        prev
          ? {
              ...prev,
              confirmacion: state,
              fechaConfirmacion: estadoFecha(state, fecha),
              estado: state === 'confirmed' ? 'respondida' : prev.estado,
            }
          : prev,
      )
    },
    [],
  )

  return { invitation, status, error, retry, updateConfirmation, wasConfirmedOnLoad }
}

function estadoFecha(state: ConfirmationState, fecha?: string): string | null {
  if (state !== 'confirmed') return null
  return fecha ?? new Date().toISOString()
}