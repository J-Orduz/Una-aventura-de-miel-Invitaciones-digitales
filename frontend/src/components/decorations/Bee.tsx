interface BeeProps {
  className?: string
}

/** Pequeña abeja simpática para acompañar las secciones. */
export function Bee({ className }: BeeProps) {
  return (
    <svg
      viewBox="0 0 80 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Ala trasera */}
      <ellipse cx="50" cy="16" rx="16" ry="11" fill="#dceef5" opacity="0.85" />
      <ellipse cx="24" cy="16" rx="16" ry="11" fill="#dceef5" opacity="0.75" />
      {/* Cuerpo */}
      <ellipse cx="37" cy="38" rx="26" ry="21" fill="#f5c14f" stroke="#d99e28" strokeWidth="2" />
      {/* Franjas */}
      <path
        d="M18 32 Q26 26 32 30 M50 26 Q58 30 56 34 M16 44 Q24 40 30 44 M46 48 Q54 44 56 46"
        stroke="#6b4c2f"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Cabeza */}
      <circle cx="26" cy="22" r="14" fill="#6b4c2f" />
      {/* Ojos */}
      <circle cx="21" cy="18" r="3" fill="#fff8e7" />
      <circle cx="30" cy="17" r="3" fill="#fff8e7" />
      <circle cx="22" cy="17" r="1.6" fill="#2b2620" />
      <circle cx="31" cy="16" r="1.6" fill="#2b2620" />
      {/* Sonrisa */}
      <path d="M22 26 Q26 29 30 26" stroke="#2b2620" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Antenas */}
      <path d="M24 10 Q22 4 26 2 M29 9 Q30 2 34 3" stroke="#2b2620" strokeWidth="1.6" strokeLinecap="round" />
      {/* Trayectoria de vuelo */}
      <path
        d="M66 54 Q62 62 67 66 Q72 70 70 58"
        stroke="#a8c3a0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 6"
        fill="none"
      />
    </svg>
  )
}