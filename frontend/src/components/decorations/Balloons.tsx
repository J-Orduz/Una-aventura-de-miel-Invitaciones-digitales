interface BalloonsProps {
  className?: string
}

/** Globos festivos con triangulo de fiesta. */
export function Balloons({ className }: BalloonsProps) {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Globo miel */}
      <ellipse cx="58" cy="58" rx="36" ry="44" fill="rgba(245,193,79,.75)" stroke="#d99e28" strokeWidth="2.5" />
      <path d="M58 102 Q62 118 60 130 M58 102 Q54 118 56 130" stroke="#8a6240" strokeWidth="2" fill="none" />
      {/* Globo rosado */}
      <ellipse cx="140" cy="50" rx="32" ry="40" fill="rgba(246,201,201,.8)" stroke="#d88f8f" strokeWidth="2.5" />
      <path d="M140 90 Q144 108 141 120 M140 90 Q136 108 139 120" stroke="#8a6240" strokeWidth="2" fill="none" />
      {/* Globo salvia */}
      <ellipse cx="104" cy="130" rx="40" ry="46" fill="rgba(168,195,160,.8)" stroke="#7da37a" strokeWidth="2.5" />
      <path d="M104 176 Q108 188 105 196 M104 176 Q100 188 103 196" stroke="#8a6240" strokeWidth="2" fill="none" />
      {/* Lazos */}
      <path d="M58 100 L50 112 L66 112 Z" fill="#c4553f" />
      <path d="M140 88 L132 100 L148 100 Z" fill="#c4553f" />
      <path d="M104 174 L96 186 L112 186 Z" fill="#c4553f" />
      {/* Estrellitas */}
      <path d="M36 20 l3 6 6 .8-4.6 4 .8 6-5.2-3-5.2 3 .8-6-4.6-4 6-.8 z" fill="rgba(217,158,40,.5)" />
      <path d="M150 14 l2.5 5 5 .7-3.9 3.4.7 5-4.3-2.5-4.3 2.5.7-5-3.9-3.4 5-.7 z" fill="rgba(107,76,47,.35)" />
    </svg>
  )
}