interface CloudsProps {
  className?: string
}

/** Nube decorativa sólida y esponjosa, como las NameCloud. */
export function Clouds({ className }: CloudsProps) {
  return (
    <svg
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`motion-safe:animate-[float-soft_5s_ease-in-out_infinite] ${className ?? ''}`}
      style={{ filter: 'drop-shadow(6px 6px 0 rgba(78,106,125,0.12))' }}
    >
      <g fill="#FBFEFF">
        <rect x="15" y="55" width="170" height="30" rx="15" />
        <circle cx="45" cy="58" r="22" />
        <circle cx="75" cy="45" r="28" />
        <circle cx="110" cy="40" r="32" />
        <circle cx="145" cy="48" r="26" />
        <circle cx="168" cy="60" r="18" />
      </g>
    </svg>
  )
}
