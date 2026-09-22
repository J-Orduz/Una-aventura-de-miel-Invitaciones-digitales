import { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * Ráfaga de celebración al confirmar asistencia.
 * Confeti disparado desde abajo + globos flotando, una sola vez.
 * Sin dependencias nuevas: solo framer-motion y colores de la paleta.
 */
const CONFETTI_COLORS = ['#8ec9ef', '#4d9fd0', '#cde9f9', '#a2cbdf', '#c7e2f4', '#fbfeff', '#7d94a3']
// Globos en tonos amarillos miel que combinan con la paleta baby-blue.
const BALLOON_COLORS = ['#ffe9a8', '#ffd66b', '#f9c74f', '#fceabb', '#f5b942']

interface ConfettiPiece {
  id: number
  x: number
  yPeak: number
  yEnd: number
  rotate: number
  size: number
  color: string
  round: boolean
  duration: number
  delay: number
}

interface Balloon {
  id: number
  x: number
  drift: number
  delay: number
  duration: number
  color: string
  size: number
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function ConfettiBurst() {
  const reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const pieces = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: rand(-260, 260),
        yPeak: rand(-420, -160),
        yEnd: rand(120, 420),
        rotate: rand(-540, 540),
        size: rand(6, 12),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        round: Math.random() < 0.35,
        duration: rand(2.4, 3.4),
        delay: rand(0, 0.35),
      })),
    [],
  )

  const balloons = useMemo<Balloon[]>(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        x: rand(-180, 180),
        drift: rand(-60, 60),
        delay: rand(0, 1.2),
        duration: rand(3.8, 5),
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        size: rand(0.8, 1.25),
      })),
    [],
  )

  if (reduceMotion) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Confeti disparado desde la parte inferior */}
      <div className="absolute left-1/2 top-[72%]">
        {pieces.map((piece) => (
          <motion.span
            key={piece.id}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: piece.x,
              y: [0, piece.yPeak, piece.yEnd],
              opacity: [1, 1, 0],
              rotate: piece.rotate,
            }}
            transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeOut' }}
            className="absolute"
            style={{
              width: piece.size,
              height: piece.round ? piece.size : piece.size * 0.6,
              backgroundColor: piece.color,
              borderRadius: piece.round ? '50%' : 2,
            }}
          />
        ))}
      </div>

      {/* Globos flotando hacia arriba */}
      {balloons.map((balloon) => {
        const width = 44 * balloon.size
        const height = 56 * balloon.size
        return (
          <motion.div
            key={`balloon-${balloon.id}`}
            initial={{ x: balloon.x, y: '10vh', opacity: 0 }}
            animate={{ x: [balloon.x, balloon.x + balloon.drift], y: '-135vh', opacity: [0, 1, 1, 0] }}
            transition={{ duration: balloon.duration, delay: balloon.delay, ease: 'easeOut' }}
            className="absolute left-1/2 top-full"
          >
            <div className="flex flex-col items-center">
              <div
                style={{
                  width,
                  height,
                  backgroundColor: balloon.color,
                  borderRadius: '50%',
                  boxShadow: '0 10px 24px -12px rgba(78, 106, 125, 0.5)',
                }}
              />
              <div
                style={{
                  width: 0,
                  height: 0,
                  marginTop: -2,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: `10px solid ${balloon.color}`,
                }}
              />
              <div style={{ width: 2, height: 70, backgroundColor: 'rgba(78, 106, 125, 0.35)' }} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
