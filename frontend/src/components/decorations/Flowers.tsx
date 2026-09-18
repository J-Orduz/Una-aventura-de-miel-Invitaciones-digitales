interface FlowersProps {
  className?: string
}

/** Ramita con flores del Bosque de los Cien Acres. */
export function Flowers({ className }: FlowersProps) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Tallo */}
      <path
        d="M20 112 Q45 90 60 60 Q80 30 100 20 M60 60 Q48 48 40 30 M70 44 Q80 32 86 44 M98 18 Q112 8 120 16"
        stroke="#7da37a"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Hojas */}
      <path d="M40 30 Q30 28 28 36 Q34 40 40 30 Z" fill="#a8c3a0" />
      <path d="M86 44 Q96 40 96 30 Q90 26 86 44 Z" fill="#a8c3a0" />
      <path d="M62 40 Q56 30 48 32 Q52 40 62 40 Z" fill="#a8c3a0" />
      {/* Flor central */}
      <g>
        <circle cx="100" cy="20" r="9" fill="#fde3e0" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx={100 + 9 * Math.cos((deg * Math.PI) / 180)}
            cy={20 + 9 * Math.sin((deg * Math.PI) / 180)}
            rx="6"
            ry="7"
            fill="#f6c9c9"
          />
        ))}
        <circle cx="100" cy="20" r="4.5" fill="#f5c14f" />
      </g>
      {/* Flor lateral */}
      <g>
        {[0, 90, 180, 270].map((deg) => (
          <ellipse
            key={deg}
            cx={120 + 7 * Math.cos((deg * Math.PI) / 180)}
            cy={16 + 7 * Math.sin((deg * Math.PI) / 180)}
            rx="5"
            ry="6"
            fill="#fde3e0"
          />
        ))}
        <circle cx="120" cy="16" r="3.6" fill="#f5c14f" />
      </g>
      {/* Botoncitos */}
      <circle cx="40" cy="30" r="3.4" fill="#dce8d8" stroke="#7da37a" strokeWidth="1" />
      <circle cx="72" cy="48" r="2.8" fill="#f6c9c9" stroke="#c4553f" strokeWidth="1" />
    </svg>
  )
}