import { Bee } from './Bee'

interface BeesProps {
  className?: string
}

/** Grupo de abejas volando alrededor. */
export function Bees({ className }: BeesProps) {
  return (
    <div className={`pointer-events-none ${className ?? ''}`} aria-hidden="true">
      <Bee className="absolute left-[12%] w-12 h-10 opacity-70 animate-[bob_3.5s_ease-in-out_infinite]" />
      <Bee className="absolute right-[16%] top-6 w-14 h-12 opacity-60 animate-[bob_4.5s_ease-in-out_infinite_0.6s]" />
      <Bee className="absolute left-[45%] top-2 w-9 h-8 opacity-50 animate-[bob_3s_ease-in-out_infinite_1.2s]" />
    </div>
  )
}