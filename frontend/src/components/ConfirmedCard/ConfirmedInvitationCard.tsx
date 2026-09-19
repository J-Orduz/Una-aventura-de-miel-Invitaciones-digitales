import { motion } from 'framer-motion'
import { CalendarDays, CheckCircle2, Clock, Gift, MapPin } from 'lucide-react'
import { riseIn, scaleIn } from '../../animations/variants'
import { MapEmbed, buildMapQuery } from '../MapEmbed/MapEmbed'
import type { EventDetails as EventDetailsData, Gift as GiftData } from '../../types/invitation'

/**
 * Tarjeta compacta para invitaciones ya confirmadas.
 * Resume toda la información del evento en una sola tarjeta estilo invitación,
 * diferente de la experiencia completa con cortinas.
 */
interface ConfirmedInvitationCardProps {
  nombre: string
  evento: EventDetailsData
  regalos: GiftData[]
}

export function ConfirmedInvitationCard({ nombre, evento, regalos }: ConfirmedInvitationCardProps) {
  const mapQuery = buildMapQuery(evento.lugar, evento.direccion)

  return (
    <section className="px-6 pt-10 pb-6 sm:px-10">
      <motion.article
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        className="honey-frame mx-auto max-w-xl rounded-3xl bg-warm-white px-6 py-7 sm:px-10 text-center soft-shadow"
      >
        <motion.p
          variants={riseIn}
          custom={0.1}
          initial="hidden"
          animate="visible"
          className="font-hand text-xl text-honey-dark"
        >
          Una aventura de Miel
        </motion.p>

        <motion.h1
          variants={riseIn}
          custom={0.2}
          initial="hidden"
          animate="visible"
          className="font-hand text-5xl text-brown-dark mt-1"
        >
          Baby Shower de Liam Matheo
        </motion.h1>

        <motion.h2
          variants={riseIn}
          custom={0.3}
          initial="hidden"
          animate="visible"
          className="font-hand text-3xl text-honey-dark mt-2"
        >
          {nombre}
        </motion.h2>

        <motion.div
          variants={riseIn}
          custom={0.4}
          initial="hidden"
          animate="visible"
          className="mt-4"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-sage-light px-4 py-1.5 text-sm font-semibold text-brown-dark">
            <CheckCircle2 className="h-4 w-4" />
            ¡Asistencia confirmada!
          </span>
        </motion.div>

        <motion.div
          variants={riseIn}
          custom={0.42}
          initial="hidden"
          animate="visible"
          className="mt-3"
        >
          <img
            src="/img/mid.png"
            alt=""
            className="mx-auto w-24 sm:w-28 h-auto object-contain drop-shadow-md"
          />
        </motion.div>

        <motion.div
          variants={riseIn}
          custom={0.45}
          initial="hidden"
          animate="visible"
          className="mt-3 mb-5 flex items-center justify-center gap-3 text-honey-dark"
          aria-hidden="true"
        >
          <span className="h-px w-16 bg-honey-dark/40" />
          <span className="font-hand text-xl">✦</span>
          <span className="h-px w-16 bg-honey-dark/40" />
        </motion.div>

        <motion.ul
          variants={riseIn}
          custom={0.55}
          initial="hidden"
          animate="visible"
          className="space-y-2.5 text-left"
        >
          <InfoRow icon={<CalendarDays />} label="Fecha" value={evento.fecha} />
          <InfoRow icon={<Clock />} label="Hora" value={evento.hora} />
          <InfoRow icon={<MapPin />} label="Lugar" value={evento.lugar} hint={evento.direccion} />
        </motion.ul>

        {regalos.length > 0 && (
          <motion.div
            variants={riseIn}
            custom={0.65}
            initial="hidden"
            animate="visible"
            className="mt-5 text-left"
          >
            <p className="font-hand text-xl text-honey-dark text-center">Un detalle para nuestro pequeño</p>
            <ul className="mt-3 space-y-2.5">
              {regalos.map((regalo) => (
                <li
                  key={regalo.id}
                  className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-honey-light text-brown-dark [&>svg]:h-4 [&>svg]:w-4">
                    <Gift />
                  </span>
                  <div>
                    <p className="font-hand text-lg leading-tight text-brown-dark">{regalo.nombre}</p>
                    {regalo.descripcion && (
                      <p className="text-sm text-brown-dark/70">{regalo.descripcion}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {mapQuery && (
          <motion.div
            variants={riseIn}
            custom={0.7}
            initial="hidden"
            animate="visible"
            className="mt-5"
          >
            <MapEmbed query={mapQuery} />
          </motion.div>
        )}

        <motion.p
          variants={riseIn}
          custom={0.75}
          initial="hidden"
          animate="visible"
          className="mt-6 font-hand text-2xl text-brown-dark"
        >
          ¡Tu compañía hará este día inolvidable!
        </motion.p>
      </motion.article>
    </section>
  )
}

function InfoRow({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value?: string; hint?: string }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-honey-light text-brown-dark [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div>
        <p className="font-hand text-lg leading-tight text-honey-dark">{label}</p>
        <p className="font-medium text-brown-dark">{value}</p>
        {hint && <p className="text-sm text-brown-dark/70">{hint}</p>}
      </div>
    </li>
  )
}
