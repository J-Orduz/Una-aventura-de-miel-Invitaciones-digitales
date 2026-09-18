import { useCallback, useMemo, useState } from 'react'
import { invitationService } from '../../services/invitationService'
import type { Invitation, InvitationInput, InvitationPreview } from '../../types/invitation'

export type ConfirmFilter = 'todas' | 'confirmadas' | 'pendientes'

function toPreview(invitation: Invitation): InvitationPreview {
  return {
    id: invitation.id,
    slug: invitation.slug,
    nombre: invitation.nombre,
    estado: invitation.estado,
    confirmacion: invitation.confirmacion,
    fechaConfirmacion: invitation.fechaConfirmacion,
    regalosCount: invitation.regalos.length,
  }
}

export function useAdminInvitations() {
  const [previews, setPreviews] = useState<InvitationPreview[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<ConfirmFilter>('todas')
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setPreviews(await invitationService.getInvitationsPreview())
    } catch {
      setError('No pudimos cargar las invitaciones. Revisa tu sesión e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [])

  const filtered = useMemo(() => {
    let result = previews
    if (filter === 'confirmadas') result = result.filter((i) => i.confirmacion === 'confirmed')
    if (filter === 'pendientes') result = result.filter((i) => i.confirmacion === 'pending')
    const query = search.trim().toLowerCase()
    if (query) result = result.filter((i) => i.nombre.toLowerCase().includes(query))
    return result
  }, [previews, filter, search])

  const getById = useCallback((id: string) => invitationService.getInvitationById(id), [])

  const addInvitation = useCallback(async (input: InvitationInput) => {
    const created = await invitationService.createInvitation(input)
    setPreviews((prev) => [toPreview(created), ...prev])
    return created
  }, [])

  const updateInvitation = useCallback(async (id: string, input: InvitationInput) => {
    const updated = await invitationService.updateInvitation(id, input)
    setPreviews((prev) => prev.map((item) => (item.id === id ? toPreview(updated) : item)))
    return updated
  }, [])

  const removeInvitation = useCallback(async (id: string) => {
    await invitationService.deleteInvitation(id)
    setPreviews((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return {
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
  }
}
