interface HoneyPotProps {
  className?: string
}

/** Tarro de miel estilo acuarela, el elemento insignia del proyecto. */
export function HoneyPot({ className }: HoneyPotProps) {
  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cuerpo del tarro */}
      <path
        d="M20 55 C20 34 40 26 60 26 C80 26 100 34 100 55 L100 100 C100 118 82 128 60 128 C38 128 20 118 20 100 Z"
        fill="url(#hpGrad)"
        stroke="#8a6240"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Etiqueta */}
      <ellipse cx="60" cy="80" rx="34" ry="22" fill="#fff8e7" stroke="#8a6240" strokeWidth="2" />
      <text
        x="60"
        y="78"
        textAnchor="middle"
        fontFamily="Patrick Hand, cursive"
        fontSize="16"
        fill="#6b4c2f"
      >
        MIEL
      </text>
      <text
        x="60"
        y="92"
        textAnchor="middle"
        fontFamily="Patrick Hand, cursive"
        fontSize="11"
        fill="#d99e28"
      >
        pura de abejas
      </text>
      {/* Tapa */}
      <rect x="22" y="14" width="76" height="12" rx="6" fill="#8a6240" />
      {/* Aro de la tapa */}
      <rect x="24" y="24" width="72" height="6" rx="3" fill="#b08d68" />
      {/* Honey drip */}
      <path
        d="M34 48 C30 58 30 66 36 62 M88 44 C92 54 92 62 86 58"
        stroke="#f5c14f"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="hpGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe9b3" />
          <stop offset="45%" stopColor="#f5c14f" />
          <stop offset="100%" stopColor="#d99e28" />
        </linearGradient>
      </defs>
    </svg>
  )
}