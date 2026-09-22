import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PartyPopper, Loader2, CheckCircle2, AlertCircle, CalendarHeart } from 'lucide-react'
import { riseIn, scaleIn, viewportOnce } from '../../animations/variants'
import { ConfettiBurst } from './ConfettiBurst'
import { NameCloud } from '../decorations/NameCloud'
import type { LoadingState } from '../../types/invitation'

/**
 * Sección 5: Confirmación de asistencia.
 * Fin de la experiencia: alerta de carga, éxito o error.
 */
interface ConfirmationSectionProps {
  onConfirm: () => Promise<void>
}

export function ConfirmationSection({ onConfirm }: ConfirmationSectionProps) {
  const [state, setState] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    if (state === 'loading') return
    setState('loading')
    setError(null)
    try {
      await onConfirm()
      setState('success')
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'No pudimos procesar tu confirmación.')
    }
  }

  return (
    <section className="relative px-6 pt-10 pb-4 sm:px-10 overflow-hidden text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-8">
        <img
          src="/img/abeja.png"
          alt=""
          className="absolute left-[12%] w-12 h-10 object-contain opacity-70 animate-[bob_3.5s_ease-in-out_infinite]"
        />
        <img
          src="/img/abeja.png"
          alt=""
          className="absolute right-[16%] top-6 w-14 h-12 object-contain opacity-60 animate-[bob_4.5s_ease-in-out_infinite_0.6s]"
        />
        <img
          src="/img/abeja.png"
          alt=""
          className="absolute left-[45%] top-2 w-9 h-8 object-contain opacity-50 animate-[bob_3s_ease-in-out_infinite_1.2s]"
        />
      </div>

      {state === 'success' && createPortal(<ConfettiBurst />, document.body)}

      <div className="mx-auto max-w-2xl">
        <motion.div
          variants={riseIn}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <NameCloud className="w-80 sm:w-96" contentClassName="px-10 pb-6 pt-12 sm:px-14 sm:pt-14">
            <img
              src="/img/abajo.png"
              alt=""
              className="mx-auto w-48 sm:w-56 h-auto object-contain drop-shadow-md"
            />
          </NameCloud>
        </motion.div>

        <AnimatePresence mode="wait">
          {state === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10"
            >
              <CheckCircle2 className="mx-auto w-14 h-14 text-leaf-dark" strokeWidth={1.5} />
              <h3 className="font-hand text-4xl text-leaf-dark mt-6">¡Asistencia confirmada!</h3>
              <p className="mt-4 font-hand text-2xl text-honey-dark">
                Nos vemos en el Bosque de los Cien Acres.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-10"
            >
              <motion.h3
                variants={riseIn}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="font-hand text-4xl sm:text-5xl text-brown-dark"
              >
                ¿Nos acompañas en esta aventura?
              </motion.h3>

              <motion.p
                variants={riseIn}
                custom={0.15}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="mt-5 text-lg sm:text-xl leading-relaxed text-brown-dark"
              >
                Nos encantaría compartir este día tan especial contigo.
              </motion.p>

              <motion.p
                variants={riseIn}
                custom={0.22}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="mt-4 text-base sm:text-lg text-brown-dark/80"
              >
                Para confirmar tu asistencia, presiona el botón de Confirmar asistencia.
              </motion.p>

              <motion.button
                variants={scaleIn}
                custom={0.3}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                onClick={handleConfirm}
                disabled={state === 'loading'}
                className="group relative mt-10 inline-flex items-center gap-3 rounded-full bg-honey px-9 py-4 font-hand text-2xl text-brown-dark shadow-[0_14px_30px_-12px_rgba(217,158,40,0.8)] transition-all hover:bg-honey-dark hover:text-warm-white active:scale-95 disabled:opacity-70"
              >
                {state === 'loading' ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Confirmando...
                  </>
                ) : state === 'error' ? (
                  <>
                    <AlertCircle className="w-6 h-6" />
                    Reintentar
                  </>
                ) : (
                  <>
                    <PartyPopper className="w-6 h-6 transition-transform group-hover:rotate-12" />
                    Confirmar asistencia
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {state === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-5 text-pooh-red font-medium"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={riseIn}
          custom={0.45}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-6 flex items-center justify-center gap-2 text-brown-dark/80"
        >
          <CalendarHeart className="w-5 h-5" />
          <p className="text-sm uppercase tracking-[0.25em]">Guarda la fecha</p>
          <CalendarHeart className="w-5 h-5" />
        </motion.div>
      </div>
    </section>
  )
}