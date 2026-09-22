import type { ReactNode } from 'react'

interface NameCloudProps {
  children: ReactNode
  className?: string
  contentClassName?: string
}

/**
 * Nube con fondo SVG elástico: conserva los copos en nombres cortos,
 * largos y en la imagen fija. El SVG se estira con preserveAspectRatio="none"
 * así las protuberancias mantienen su distribución proporcional.
 * Flotación `float-soft`.
 */
export function NameCloud({ children, className, contentClassName }: NameCloudProps) {
  return (
    <div
      className={`relative inline-block max-w-full min-w-[230px] motion-safe:animate-[float-soft_4s_ease-in-out_infinite] ${
        className ?? ''
      }`}
    >
      <svg
        viewBox="0 0 400 150"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        style={{ filter: 'drop-shadow(8px 8px 0 rgba(78,106,125,0.15))' }}
      >
        <g fill="#FBFEFF">
          <rect x="20" y="65" width="360" height="65" rx="32" />
          <circle cx="70" cy="70" r="32" />
          <circle cx="125" cy="55" r="38" />
          <circle cx="190" cy="50" r="42" />
          <circle cx="255" cy="54" r="39" />
          <circle cx="315" cy="63" r="33" />
          <circle cx="340" cy="80" r="25" />
        </g>
      </svg>
      <div className={`relative px-8 pb-4 pt-10 text-center sm:px-12 sm:pt-11 ${contentClassName ?? ''}`}>{children}</div>
    </div>
  )
}
