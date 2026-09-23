import { motion } from 'framer-motion'
import { CalendarDays, Clock, MapPin, Heart } from 'lucide-react'
import { riseIn, viewportOnce } from '../../animations/variants'
import { Balloons } from '../decorations/Balloons'
import { BeesOrbit } from '../decorations/BeesOrbit'
import type { EventDetails as EventDetailsData } from '../../types/invitation'

/**
 * Sección 3: Detalles del baby shower.
 * La información aparece de forma escalonada mientras el usuario baja.
 */
interface EventDetailsProps {
  evento: EventDetailsData
}

export function EventDetails({ evento }: EventDetailsProps) {
  return (
    <section className="relative px-6 pt-3 pb-6 sm:px-10 overflow-hidden">
      <Balloons className="absolute top-8 right-2 w-36 h-32 opacity-50 rotate-6" />

      <div className="mx-auto max-w-3xl">
        <motion.div
          variants={riseIn}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center"
        >
          <p className="font-hand text-xl sm:text-2xl font-semibold text-honey-dark">LIAM SAMUEL llegará pronto a casa, ¡Queremos compartir contigo su bienvenida!</p>
          <BeesOrbit className="mt-0">
            <img
              src="/img/mid.png"
              alt=""
              className="mx-auto w-44 sm:w-52 h-auto object-contain drop-shadow-md"
            />
          </BeesOrbit>
        </motion.div>

        <div className="mt-4 space-y-5">
          {/* Fecha — aparece primero */}
          <DetailRow
            icon={<CalendarDays />}
            delay={0.1}
            label="Fecha"
            value={evento.fecha}
          />

          {/* Hora — aparece después */}
          <DetailRow icon={<Clock />} delay={0.25} label="Hora" value={evento.hora} />

          {/* Lugar — aparece después */}
          <DetailRow icon={<MapPin />} delay={0.4} label="Lugar" value={evento.lugar} />

          <motion.div
            variants={riseIn}
            custom={0.55}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="ml-2 pl-4 border-l-2 border-sage"
          >
            <p className="text-base sm:text-lg font-bold text-brown/80">{evento.direccion}</p>
          </motion.div>

          {/* Mensaje de los padres */}
          <motion.div
            variants={riseIn}
            custom={0.7}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="mt-6 rounded-3xl texture-paper soft-shadow px-7 py-5 text-center relative"
          >
            <Heart className="absolute -top-3 left-6 w-6 h-6 text-pooh-red fill-blush" />
            <p className="font-hand text-2xl text-brown-dark leading-relaxed">
              “{evento.mensaje}”
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function DetailRow({
  icon,
  label,
  value,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value?: string
  delay: number
}) {
  return (
    <motion.div
      variants={riseIn}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="flex items-start gap-4 rounded-2xl bg-warm-white/70 px-5 py-4 soft-shadow"
    >
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-honey-light text-brown-dark [&>svg]:w-5 [&>svg]:h-5">
        {icon}
      </span>
      <div>
        <p className="font-hand text-xl text-honey-dark leading-tight">{label}</p>
        <p className="text-lg sm:text-xl text-brown-dark font-medium">{value}</p>
      </div>
    </motion.div>
  )
}