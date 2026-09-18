import type { Variants } from 'framer-motion'

/** Variantes de entrada mientras se hace scroll. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay: custom },
  }),
}

/** Aparece con un pequeño escalado, ideal para ilustraciones. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay: custom },
  }),
}

/** Entrada desde un costado. */
export const slideInFrom = (from: 'left' | 'right'): Variants => ({
  hidden: { opacity: 0, x: from === 'left' ? -60 : 60 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: custom },
  }),
})

export const viewportOnce = { once: true, margin: '-80px' } as const