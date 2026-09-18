import { motion } from 'framer-motion'
import { riseIn, viewportOnce } from '../../animations/variants'

/**
 * Encabezado de la invitación: un pequeño título fijo decorativo.
 * Se usa en la vista de información para invitados que ya confirmaron.
 */
export function InvitationHeader({ nombre }: { nombre: string }) {
  return (
    <motion.header
      variants={riseIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="flex items-center justify-center gap-3 px-6 py-6"
    >
      <span className="h-px w-14 bg-honey-dark/40" />
      <p className="font-hand text-lg text-honey-dark">Una aventura de miel · {nombre}</p>
      <span className="h-px w-14 bg-honey-dark/40" />
    </motion.header>
  )
}