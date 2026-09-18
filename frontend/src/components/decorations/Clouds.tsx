interface CloudsProps {
  className?: string
}

/** Nubes suaves de acuarela. */
export function Clouds({ className }: CloudsProps) {
  return (
    <svg
      viewBox="0 0 200 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g fill="rgba(255,253,248,.9)" stroke="rgba(168,195,160,.35)" strokeWidth="2">
        <ellipse cx="60" cy="52" rx="42" ry="24" />
        <ellipse cx="40" cy="40" rx="24" ry="18" />
        <ellipse cx="82" cy="38" rx="26" ry="20" />
      </g>
      <g fill="rgba(255,253,248,.8)" stroke="rgba(184,216,232,.45)" strokeWidth="2">
        <ellipse cx="150" cy="34" rx="36" ry="20" />
        <ellipse cx="130" cy="24" rx="20" ry="15" />
        <ellipse cx="170" cy="22" rx="22" ry="16" />
      </g>
    </svg>
  )
}