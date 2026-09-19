import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { riseIn, viewportOnce } from '../../animations/variants'
import { HoneyPot } from '../decorations/HoneyPot'
import { Clouds } from '../decorations/Clouds'

/** Sección final de agradecimiento. */
export function Footer() {
  return (
    <footer className="relative overflow-hidden px-6 pt-4 pb-10 text-center">
      <Clouds className="absolute left-0 top-6 w-40 h-20 opacity-60" />
      <Clouds className="absolute right-0 top-14 w-32 h-16 opacity-40" />

      <div className="mx-auto max-w-2xl">
        <motion.div
          variants={riseIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <HoneyPot className="mx-auto w-20 h-24 drop-shadow-md animate-[bob_4s_ease-in-out_infinite]" />
        </motion.div>

        <motion.h3
          variants={riseIn}
          custom={0.15}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="font-hand text-3xl sm:text-4xl text-brown-dark mt-8"
        >
          ¡Gracias por ser parte de esta aventura!
        </motion.h3>

        <motion.p
          variants={riseIn}
          custom={0.3}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-4 text-lg text-brown-dark"
        >
          Cada abrazo, cada risa y cada tarro de miel compartido hacen este camino más dulce.
        </motion.p>

        <motion.div
          variants={riseIn}
          custom={0.45}
          initial="hidden"
          animate="visible"
          className="mt-8 flex items-center justify-center gap-3 text-brown-dark/80"
        >
          <span className="h-px w-12 sm:w-20 bg-brown/30" />
          <span className="flex items-center gap-2 text-sm sm:text-base font-medium whitespace-nowrap">
            <span className="flex flex-col items-center leading-snug">
              <span>Hecho</span>
              <span>con</span>
            </span>
            <Heart className="w-5 h-5 fill-blush text-pooh-red" />
            <span className="flex flex-col items-center leading-snug">
              <span>y mucha</span>
              <span>miel</span>
            </span>
          </span>
          <span className="h-px w-12 sm:w-20 bg-brown/30" />
        </motion.div>
      </div>
    </footer>
  )
}