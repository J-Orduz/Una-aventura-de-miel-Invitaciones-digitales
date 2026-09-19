import { ConfirmedInvitationCard } from '../components/ConfirmedCard/ConfirmedInvitationCard'
import { mockInvitations } from '../data/mockInvitations'
import { loadEventConfig } from '../data/eventConfig'

/**
 * Vista temporal de compatibilidad con la caché del servidor dev.
 * Se elimina definitivamente cuando se reinicie `npm run dev` del frontend.
 */
export function PreviewCardPage() {
  const invitation = mockInvitations.find((i) => i.slug === 'familia-rodriguez') ?? mockInvitations[0]
  return (
    <div className="texture-paper min-h-screen">
      <ConfirmedInvitationCard
        nombre={invitation.nombre}
        evento={loadEventConfig()}
        regalos={invitation.regalos}
      />
    </div>
  )
}
