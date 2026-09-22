import { motion } from 'framer-motion'
import { Gift } from 'lucide-react'
import { riseIn, scaleIn, viewportOnce } from '../../animations/variants'
import { HoneyPot } from '../decorations/HoneyPot'
import { NameCloud } from '../decorations/NameCloud'
import type { Gift as GiftData } from '../../types/invitation'

/**
 * Sección 4: El regalo asignado a la familia.
 * Muestra uno o varios regalos en marcos ilustrados, sin lógica de datos.
 */
interface GiftSectionProps {
  nombre: string
  regalos: GiftData[]
}

export function GiftSection({ nombre, regalos }: GiftSectionProps) {
  return (
    <section className="relative px-6 pt-6 pb-14 sm:px-10 texture-paper overflow-hidden">
      <img
        src="/img/abeja.png"
        alt=""
        className="absolute bottom-10 left-4 w-16 h-14 object-contain opacity-60"
      />

      <div className="mx-auto max-w-3xl">
        <motion.div
          variants={riseIn}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center"
        >
          <p className="font-hand text-lg sm:text-3xl text-honey-dark">Para la comodidad de nuestro bebé, </p>
          <p className="font-hand text-lg sm:text-3xl text-honey-dark">Nos encantaría que nos apoyaras con estos detalles</p>
          <motion.div
            variants={riseIn}
            custom={0.1}
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
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {regalos.map((regalo, index) => (
            <motion.div
              key={regalo.id}
              variants={scaleIn}
              custom={index * 0.15}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="honey-frame rounded-3xl bg-warm-white p-6 text-center"
            >
              <GiftVisual regalo={regalo} />
              <h3 className="font-hand text-2xl text-brown-dark mt-5">{regalo.nombre}</h3>
              {regalo.descripcion && (
                <p className="mt-2 text-base text-brown">{regalo.descripcion}</p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={riseIn}
          custom={0.6}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-10 text-center font-body text-xl font-bold text-brown-dark italic"
        >
          "Tú creaste mis entrañas; me formaste en el vientre de mi madre” - Salmo 139
        </motion.p>
      </div>
    </section>
  )
}

function GiftVisual({ regalo }: { regalo: GiftData }) {
  if (regalo.imagen) {
    return (
      <div className="relative mx-auto max-w-[180px]">
        <div className="rounded-2xl bg-cream p-2 soft-shadow">
          <img
            src={regalo.imagen}
            alt={regalo.nombre}
            loading="lazy"
            className="h-36 w-full rounded-xl object-cover"
          />
        </div>
        <HoneyPot className="absolute -bottom-4 -right-5 w-14 h-16 drop-shadow rotate-6" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-40 w-40 flex-col items-center justify-center rounded-full bg-cream soft-shadow">
      <Gift className="w-10 h-10 text-honey-dark" strokeWidth={1.5} />
      <p className="font-hand text-sm text-brown mt-2">pronto su sorpresa</p>
    </div>
  )
}