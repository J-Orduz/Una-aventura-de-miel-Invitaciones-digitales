import { useRef, useState, type ReactNode } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { CurtainPanel } from './CurtainPanel'
import { Bee } from '../decorations/Bee'

type Stage = 'intro' | 'opening' | 'reveal'

/**
 * Sección de apertura: cortinas cerradas que se abren con el scroll.
 *
 * La animación se divide en fases excluyentes: solo una capa puede existir a
 * la vez (introducción, apertura o contenido revelado). Así es imposible que
 * el mensaje de bienvenida y el mensaje personalizado se superpongan.
 */
export function CurtainOpening({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const [stage, setStage] = useState<Stage>('intro')

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const next: Stage = progress < 0.32 ? 'intro' : progress < 0.40 ? 'opening' : 'reveal'
    setStage((prev) => (prev === next ? prev : next))
  })

  // Las cortinas comienzan a abrirse y el contenido se muestra desde el inicio de la apertura.
  const curtainLeft = useTransform(scrollYProgress, [0, 0.35, 0.72], [0, 0, -106])
  const curtainRight = useTransform(scrollYProgress, [0, 0.35, 0.72], [0, 0, 106])

  const introOpacity = useTransform(scrollYProgress, [0, 0.12, 0.3], [1, 1, 0])
  const introY = useTransform(scrollYProgress, [0, 0.3], ['0%', '-28%'])
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  return (
    <section ref={sectionRef} id="cortina-stage" className="relative" style={{ height: '200vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden texture-paper">
        {/* Contenido revelado (se muestra apenas empiezan a abrirse las cortinas) */}
        {stage !== 'intro' && (
          <div className="absolute inset-0 z-10 flex justify-center items-start px-6">
            <div className="mx-auto w-full">{children}</div>
          </div>
        )}

        {/* Cortinas */}
        <CurtainSide x={curtainLeft} side="left" />
        <CurtainSide x={curtainRight} side="right" />

        {/* Mensaje de bienvenida (solo en la fase inicial) */}
        {stage === 'intro' && (
          <motion.div
            style={{ y: introY, opacity: introOpacity }}
            className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
          >
            <Bee className="w-12 h-12 mb-4 drop-shadow-sm animate-[bob_3s_ease-in-out_infinite]" />

            <h1 className="font-hand text-5xl sm:text-6xl text-warm-white tracking-wide leading-tight [text-shadow:0_2px_14px_rgba(78,106,125,0.7)]">
              Bienvenidos a mi
              <span className="block text-honey-light mt-1">Baby Shower</span>
            </h1>

            <img
              src="/img/cortina.png"
              alt=""
              className="mt-8 h-44 w-auto sm:h-52 drop-shadow-lg animate-[bob_4s_ease-in-out_infinite_0.5s]"
            />

            <motion.p
              style={{ opacity: hintOpacity }}
              className="mt-12 font-body font-semibold text-warm-white text-base tracking-[0.15em] uppercase flex flex-col items-center gap-1 [text-shadow:0_1px_10px_rgba(78,106,125,0.6)]"
            >
              <span className="flex items-center gap-2">
                <span className="inline-block w-8 h-px bg-warm-white/60" />
                Desliza para descubrir la sorpresa
                <span className="inline-block w-8 h-px bg-warm-white/60" />
              </span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </motion.p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function CurtainSide({ x, side }: { x: MotionValue<number>; side: 'left' | 'right' }) {
  const percent = useTransform(x, (value) => `${value}%`)
  return (
    <motion.div
      style={{ x: percent }}
      className={`absolute top-0 bottom-0 z-20 w-[52%] ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
    >
      <CurtainPanel />
    </motion.div>
  )
}