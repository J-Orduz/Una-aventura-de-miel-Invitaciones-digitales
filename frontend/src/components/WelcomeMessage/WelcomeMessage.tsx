import { motion } from 'framer-motion'
import { riseIn, viewportOnce } from '../../animations/variants'
import { Flowers } from '../decorations/Flowers'

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
    <section className="relative px-6 py-14 sm:px-10 texture-paper overflow-hidden">
      <Flowers className="absolute -left-6 top-10 w-32 h-24 opacity-70 rotate-[-10deg]" />
      <Flowers className="absolute -right-4 bottom-12 w-28 h-20 opacity-60 rotate-[150deg]" />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div
          variants={riseIn}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <img
            src="/img/arriba.png"
            alt=""
            className="mx-auto w-30 h-40 sm:w-32 sm:h-36 object-contain drop-shadow-md"
          />
        </motion.div>

        <motion.p
          variants={riseIn}
          custom={0.15}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="font-hand text-lg sm:text-xl text-honey-dark mt-4"
        >
          Una carta para ti
        </motion.p>

        <motion.h2
          variants={riseIn}
          custom={0.25}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="font-hand text-4xl sm:text-5xl text-brown-dark mt-1"
        >
          {nombre}
        </motion.h2>

        <motion.div
          variants={riseIn}
          custom={0.35}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-6 space-y-4 text-base sm:text-lg leading-relaxed font-body text-brown"
        >
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </motion.div>

        <motion.div
          variants={riseIn}
          custom={0.5}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-7 flex items-center gap-3 text-honey-dark"
        >
          <span className="h-px w-16 bg-honey-dark/40" />
          <span className="font-hand text-2xl">✦</span>
          <span className="h-px w-16 bg-honey-dark/40" />
        </motion.div>
      </div>
    </section>
  )
}