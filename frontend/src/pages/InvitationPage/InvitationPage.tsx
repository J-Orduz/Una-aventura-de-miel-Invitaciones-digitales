import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useInvitation } from '../../hooks/useInvitation'
import { CurtainOpening } from '../../components/CurtainOpening/CurtainOpening'
import { WelcomeMessage } from '../../components/WelcomeMessage/WelcomeMessage'
import { EventDetails } from '../../components/EventDetails/EventDetails'
import { GiftSection } from '../../components/GiftSection/GiftSection'
import { ConfirmationSection } from '../../components/ConfirmationSection/ConfirmationSection'
import { ConfirmedInvitationCard } from '../../components/ConfirmedCard/ConfirmedInvitationCard'
import { Footer } from '../../components/Footer/Footer'
import { BackgroundMusic } from '../../components/AudioPlayer/BackgroundMusic'
import { HoneyPot } from '../../components/decorations/HoneyPot'
import { invitationService } from '../../services/invitationService'

export function InvitationPage() {
  const { slug } = useParams<{ slug: string }>()
  const { invitation, status, error, retry, updateConfirmation, wasConfirmedOnLoad } = useInvitation(slug)
  const eventWrapRef = useRef<HTMLDivElement | null>(null)
  const pullRef = useRef(0)

  // El alto de la carta varía con el mensaje: pasado el final de las cortinas
  // se mide el hueco real entre el divisor ✦ y los detalles, y esa sección
  // sube con margen hasta quedar a ~20px. Durante las cortinas no se mide
  // (el contenido fijado daría un hueco falso) ni se mueve nada.
  // Funciona con mensajes cortos y largos; si no hay hueco, no hace nada.
  useEffect(() => {
    let raf = 0
    let settleTimer = 0

    // Punto de scroll donde se sueltan las cortinas (geometría estática).
    const getReleaseAt = () => {
      const stage = document.getElementById('cortina-stage')
      if (!stage) return null
      const r = stage.getBoundingClientRect()
      return r.top + window.scrollY + r.height - window.innerHeight
    }

    const frame = () => {
      const wrap = eventWrapRef.current
      const releaseAt = getReleaseAt()
      if (!wrap || releaseAt === null) return
      if (window.scrollY < releaseAt - 4) {
        if (pullRef.current !== 0) {
          pullRef.current = 0
          wrap.style.marginTop = ''
        }
        return
      }
      const divider = document.getElementById('carta-divisor')
      if (!divider) return
      const y = window.scrollY
      const dividerDoc = divider.getBoundingClientRect().bottom + y
      // Se descuenta el ajuste aplicado para medir la geometría base.
      const eventDoc = wrap.getBoundingClientRect().top + y + pullRef.current
      const full = eventDoc - dividerDoc - 20
      if (full <= 4) {
        if (pullRef.current !== 0) {
          pullRef.current = 0
          wrap.style.marginTop = ''
        }
        return
      }
      const span = Math.min(320, Math.max(140, full))
      const t = Math.min(1, Math.max(0, (y - releaseAt) / span))
      // Suavizado de entrada y llegada.
      const eased = t * t * (3 - 2 * t)
      const pull = full * eased
      if (Math.abs(pullRef.current - pull) > 0.5) {
        pullRef.current = pull
        wrap.style.marginTop = pull > 0.5 ? `${-pull}px` : ''
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(frame)
    }

    const settle = () => {
      frame()
      // Segunda pasada tras animaciones de entrada y carga de fuentes.
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(frame, 1500)
    }

    const t1 = window.setTimeout(settle, 1800)
    const t2 = window.setTimeout(settle, 3500)
    window.addEventListener('load', settle)
    window.addEventListener('resize', settle)
    window.addEventListener('scroll', onScroll, { passive: true })
    if (document.fonts) {
      document.fonts.ready.then(settle).catch(() => undefined)
    }
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(settleTimer)
      cancelAnimationFrame(raf)
      window.removeEventListener('load', settle)
      window.removeEventListener('resize', settle)
      window.removeEventListener('scroll', onScroll)
      pullRef.current = 0
      if (eventWrapRef.current) eventWrapRef.current.style.marginTop = ''
    }
  }, [slug, status])

  if (status === 'loading') {
    return <LoadingView />
  }

  if (status === 'error' || !invitation) {
    return <ErrorView message={error} onRetry={retry} />
  }

  if (invitation.confirmacion === 'confirmed' && wasConfirmedOnLoad) {
    return (
      <div className="texture-paper min-h-screen">
        <ConfirmedInvitationCard
          nombre={invitation.nombre}
          evento={invitation.evento}
          regalos={invitation.regalos}
        />
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

      <div ref={eventWrapRef}>
        <EventDetails evento={invitation.evento} />
        <GiftSection nombre={invitation.nombre} regalos={invitation.regalos} />

        <ConfirmationSection
          onConfirm={async () => {
            const result = await invitationService.confirmAssistance(invitation)
            updateConfirmation('confirmed', result.fechaConfirmacion)
          }}
        />
        <Footer />
      </div>
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