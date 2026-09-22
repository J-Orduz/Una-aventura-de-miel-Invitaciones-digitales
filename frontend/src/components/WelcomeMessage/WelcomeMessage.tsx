import { motion } from 'framer-motion'
import { riseIn, viewportOnce } from '../../animations/variants'
import { Flowers } from '../decorations/Flowers'
import { NameCloud } from '../decorations/NameCloud'

/**
 * Sección 2: Mensaje personalizado de la invitación.
 * El nombre y mensaje provienen de los datos, nunca escritos aquí.
 */
interface WelcomeMessageProps {
  nombre: string
  mensaje: string
}

export function WelcomeMessage({ nombre, mensaje }: WelcomeMessageProps) {
  const paragraphs = mensaje.split('\n')

  return (
    <section className="relative px-6 pt-6 pb-2 sm:px-10 texture-paper overflow-hidden">
      <Flowers className="absolute -left-6 top-10 w-32 h-24 opacity-70 rotate-[-10deg]" />
      <Flowers className="absolute -right-4 bottom-12 w-28 h-20 opacity-60 rotate-[150deg]" />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.h1
          variants={riseIn}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="font-hand text-4xl sm:text-5xl text-brown-dark tracking-wide"
        >
          Una aventura de Miel
        </motion.h1>

        <motion.div
          variants={riseIn}
          custom={0.1}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-4"
        >
          <div className="relative mx-auto w-fit">
            <img
              src="/img/arriba.png"
              alt=""
              className="mx-auto h-36 w-auto sm:h-40 object-contain drop-shadow-md"
            />
            <img
              src="/img/abeja.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-1/2 w-10 -translate-x-23 -translate-y-1/2 -scale-x-100 object-contain drop-shadow-sm motion-safe:animate-[bob_3.5s_ease-in-out_infinite] sm:-translate-x-30 sm:w-12"
            />
            <img
              src="/img/abeja.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-1/2 w-10 -translate-y-1/2 translate-x-20 object-contain drop-shadow-sm motion-safe:animate-[bob_4s_ease-in-out_infinite_0.7s] sm:w-12 sm:translate-x-30"
            />
          </div>
        </motion.div>

        <motion.p
          variants={riseIn}
          custom={0.2}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="font-hand text-2xl sm:text-3xl text-honey-dark mt-4"
        >
          La dulce espera está por terminar
        </motion.p>

        <motion.p
          variants={riseIn}
          custom={0.3}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="font-hand text-lg sm:text-xl text-honey-dark mt-1"
        >
          Una carta para ti
        </motion.p>

        <motion.div
          variants={riseIn}
          custom={0.4}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10"
        >
          <NameCloud>
            <h2 className="font-hand text-4xl sm:text-5xl text-brown-dark leading-tight break-words">
              {nombre}
            </h2>
          </NameCloud>
        </motion.div>

        <motion.div
          variants={riseIn}
          custom={0.5}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-5 space-y-4 text-base sm:text-lg leading-relaxed font-body text-brown-dark"
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </motion.div>

        <motion.div
          variants={riseIn}
          custom={0.65}
          initial="hidden"
          animate="visible"
          id="carta-divisor"
          className="mt-3 flex items-center gap-3 text-honey-dark"
        >
          <span className="h-px w-16 bg-honey-dark/40" />
          <span className="font-hand text-2xl">✦</span>
          <span className="h-px w-16 bg-honey-dark/40" />
        </motion.div>
      </div>
    </section>
  )
}