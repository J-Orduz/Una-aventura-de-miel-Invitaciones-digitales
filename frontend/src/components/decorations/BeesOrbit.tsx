import type { ReactNode } from 'react'

interface BeesOrbitProps {
  children: ReactNode
  className?: string
}

/**
 * Envuelve `mid.png` con 2 abejas (`abeja.png`) orbitándolo.
 * La órbita mantiene las abejas verticales (rotación compensada).
 * La segunda abeja va espejada para variar la dirección visual.
 * Sin movimiento si el usuario prefiere movimiento reducido.
 */
export function BeesOrbit({ children, className }: BeesOrbitProps) {
  return (
    <div className={`relative inline-block ${className ?? ''}`}>
      {children}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -ml-5 -mt-5 motion-safe:animate-[bee-orbit-a_12s_linear_infinite]">
          <img
            src="/img/abeja.png"
            alt=""
            className="w-10 object-contain drop-shadow-md sm:w-12"
          />
        </div>
        <div className="absolute left-1/2 top-1/2 -ml-4 -mt-4 motion-safe:animate-[bee-orbit-b_14s_linear_infinite]">
          <img
            src="/img/abeja.png"
            alt=""
            className="w-8 -scale-x-100 object-contain drop-shadow-md sm:w-10"
          />
        </div>
      </div>
    </div>
  )
}
