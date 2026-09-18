import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PartyPopper, Loader2, CheckCircle2, AlertCircle, CalendarHeart } from 'lucide-react'
import { riseIn, scaleIn, viewportOnce } from '../../animations/variants'
import { HoneyPot } from '../decorations/HoneyPot'
import { Bees } from '../decorations/Bees'
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
    <section className="relative px-6 py-24 sm:px-10 overflow-hidden text-center">
      <Bees className="absolute inset-x-0 top-8" />

      <div className="mx-auto max-w-2xl">
        <motion.div
          variants={riseIn}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <img
            src="/img/abajo.png"
            alt=""
            className="mx-auto w-40 h-32 object-contain drop-shadow-md"
          />
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
              <CheckCircle2 className="mx-auto w-14 h-14 text-sage-dark" strokeWidth={1.5} />
              <h3 className="font-hand text-4xl text-brown-dark mt-6">¡Asistencia confirmada!</h3>
              <p className="mt-4 font-hand text-2xl text-honey-dark">
                Nos vemos en el Bosque de los Cien Acres.
              </p>
              <HoneyPot className="mx-auto mt-8 w-20 h-24 animate-[bob_4s_ease-in-out_infinite]" />
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
                className="mt-5 text-lg sm:text-xl leading-relaxed text-brown"
              >
                Nos encantaría compartir este día tan especial contigo.
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
          className="mt-14 flex items-center justify-center gap-2 text-brown/60"
        >
          <CalendarHeart className="w-5 h-5" />
          <p className="text-sm uppercase tracking-[0.25em]">Guarda la fecha</p>
          <CalendarHeart className="w-5 h-5" />
        </motion.div>
      </div>
    </section>
  )
}