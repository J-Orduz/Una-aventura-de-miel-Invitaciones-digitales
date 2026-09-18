import { motion } from 'framer-motion'
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useInvitation } from '../../hooks/useInvitation'
import { CurtainOpening } from '../../components/CurtainOpening/CurtainOpening'
import { WelcomeMessage } from '../../components/WelcomeMessage/WelcomeMessage'
import { EventDetails } from '../../components/EventDetails/EventDetails'
import { GiftSection } from '../../components/GiftSection/GiftSection'
import { ConfirmationSection } from '../../components/ConfirmationSection/ConfirmationSection'
import { InvitationHeader } from '../../components/InvitationHeader/InvitationHeader'
import { Footer } from '../../components/Footer/Footer'
import { BackgroundMusic } from '../../components/AudioPlayer/BackgroundMusic'
import { HoneyPot } from '../../components/decorations/HoneyPot'
import { invitationService } from '../../services/invitationService'

export function InvitationPage() {
  const { slug } = useParams<{ slug: string }>()
  const { invitation, status, error, retry, updateConfirmation, wasConfirmedOnLoad } = useInvitation(slug)

  if (status === 'loading') {
    return <LoadingView />
  }

  if (status === 'error' || !invitation) {
    return <ErrorView message={error} onRetry={retry} />
  }

  if (invitation.confirmacion === 'confirmed' && wasConfirmedOnLoad) {
    return (
      <div className="texture-paper min-h-screen">
        <InvitationHeader nombre={invitation.nombre} />
        <EventDetails evento={invitation.evento} />
        <GiftSection nombre={invitation.nombre} regalos={invitation.regalos} />
        <Footer />
        <BackgroundMusic />
      </div>
    )
  }

  return (
    <div className="texture-paper">
      <CurtainOpening>
        <WelcomeMessage nombre={invitation.nombre} mensaje={invitation.mensaje} />
      </CurtainOpening>

      <EventDetails evento={invitation.evento} />
      <GiftSection nombre={invitation.nombre} regalos={invitation.regalos} />

      <ConfirmationSection
        onConfirm={async () => {
          const result = await invitationService.confirmAssistance(invitation)
          updateConfirmation('confirmed', result.fechaConfirmacion)
        }}
      />
      <Footer />
      <BackgroundMusic />
    </div>
  )
}

function LoadingView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center texture-paper">
      <HoneyPot className="w-24 h-28 animate-[bob_3s_ease-in-out_infinite]" />
      <p className="mt-8 flex items-center gap-2 font-hand text-2xl text-brown">
        <Loader2 className="w-5 h-5 animate-spin" />
        Preparando tu invitación...
      </p>
    </div>
  )
}

function ErrorView({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  const notFound = message === 'INVITATION_NOT_FOUND'
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center texture-paper">
      <AlertCircle className="w-14 h-14 text-pooh-red" strokeWidth={1.5} />
      <h2 className="mt-6 font-hand text-4xl text-brown-dark">
        {notFound ? 'Invitación no encontrada' : '¡Algo salió mal!'}
      </h2>
      <p className="mt-4 max-w-md text-lg text-brown">
        {notFound
          ? 'Verifica el enlace que recibiste, o pídele nuevamente la invitación a los organizadores.'
          : 'No pudimos cargar tu invitación. Intenta nuevamente en un momento.'}
      </p>
      {!notFound && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-honey px-7 py-3 font-hand text-xl text-brown-dark shadow-md"
        >
          <RefreshCw className="w-5 h-5" />
          Reintentar
        </motion.button>
      )}
    </div>
  )
}