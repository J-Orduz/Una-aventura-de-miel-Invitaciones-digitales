/**
 * Panel de cortina individual.
 * Tela con pliegues verticales y valance superior con volantes.
 */

const VALANCE_PATH = 'M0 0 H1200 V20 A32 32 0 0 1 1136 20 A32 32 0 0 1 1072 20 A32 32 0 0 1 1008 20 A32 32 0 0 1 944 20 A32 32 0 0 1 880 20 A32 32 0 0 1 816 20 A32 32 0 0 1 752 20 A32 32 0 0 1 688 20 A32 32 0 0 1 624 20 A32 32 0 0 1 560 20 A32 32 0 0 1 496 20 A32 32 0 0 1 432 20 A32 32 0 0 1 368 20 A32 32 0 0 1 304 20 A32 32 0 0 1 240 20 A32 32 0 0 1 176 20 A32 32 0 0 1 112 20 A32 32 0 0 1 48 20 A32 32 0 0 1 -16 20 Z'

export function CurtainPanel() {
  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      {/* Tela base con sombreado lateral */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, #9e3a22 0%, #c4553f 22%, #e0795c 40%, #b3462f 58%, #c4553f 78%, #93351f 100%)',
        }}
      >
        {/* Pliegues verticales */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(90deg, rgba(110, 30, 16, 0.28) 0 8px, rgba(255, 224, 204, 0.16) 8px 22px, rgba(90, 22, 12, 0.22) 22px 46px)',
          }}
        />
        {/* Resplandor central */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.14) 48%, transparent 62%)',
          }}
        />
      </div>

      {/* Borde inferior deshilachado */}
      <svg
        className="absolute bottom-0 left-0 h-14 w-full"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 60 L14 24 L28 52 L42 18 L56 50 L70 22 L84 54 L98 26 L112 58 L126 16 L140 46 L154 20 L168 56 L182 24 L196 52 L210 18 L224 50 L238 22 L252 54 L266 26 L280 58 L294 16 L308 46 L322 20 L336 56 L350 24 L364 52 L378 18 L392 50 L406 22 L420 54 L434 26 L448 58 L462 16 L476 46 L490 20 L504 56 L518 24 L532 52 L546 18 L560 50 L574 22 L588 54 L602 26 L616 58 L630 16 L644 46 L658 20 L672 56 L686 24 L700 52 L714 18 L728 50 L742 22 L756 54 L770 26 L784 58 L798 16 L812 46 L826 20 L840 56 L854 24 L868 52 L882 18 L896 50 L910 22 L924 54 L938 26 L952 58 L966 16 L980 46 L994 20 L1008 56 L1022 24 L1036 52 L1050 18 L1064 50 L1078 22 L1092 54 L1106 26 L1120 58 L1134 16 L1148 46 L1162 20 L1176 56 L1190 24 L1200 50 L1200 60 Z"
          fill="#b3462f"
        />
      </svg>

      {/* Valance superior con volantes */}
      <svg
        className="absolute top-0 left-0 w-full"
        viewBox="0 0 1200 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={VALANCE_PATH}
          fill="#9e3a22"
        />
        {/* Sombra de los volantes */}
        <path
          d={VALANCE_PATH}
          fill="none"
          stroke="rgba(70,18,8,0.4)"
          strokeWidth="3"
        />
        {/* Dobladillo inferior de la tela */}
        <path
          d="M0 46 H44 M80 46 H124 M160 46 H204 M240 46 H284 M320 46 H364 M400 46 H444 M480 46 H524 M560 46 H604 M640 46 H684 M720 46 H764 M800 46 H844 M880 46 H924 M960 46 H1004 M1040 46 H1084 M1120 46 H1164 M1200 46"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="5"
        />
      </svg>

      {/* Laterales de la tela */}
      <div className="absolute top-0 bottom-0 left-0 w-3 bg-black/25" />
      <div className="absolute top-0 bottom-0 right-0 w-3 bg-black/25" />
    </div>
  )
}