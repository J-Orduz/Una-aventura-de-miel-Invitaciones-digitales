import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Music, VolumeX } from 'lucide-react'

const AUDIO_SRC = '/audio/cancion.mp3'
const VOLUME = 0.55

/**
 * Música de fondo de la invitación.
 *
 * Los navegadores no permiten iniciar audio con sonido sin una interacción
 * del usuario, así que se intenta arrancar en el primer toque/clic/tecla y,
 * además, se ofrece un botón para pausar o reanudar.
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !audio.paused) return
    try {
      audio.volume = VOLUME
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      void play()
    } else {
      audio.pause()
      setPlaying(false)
    }
  }, [play])

  // Arranca en la primera interacción del usuario.
  useEffect(() => {
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'touchstart', 'keydown', 'click']
    let removed = false
    const remove = () => {
      if (removed) return
      removed = true
      events.forEach((event) => window.removeEventListener(event, handler))
    }
    const handler = () => {
      const audio = audioRef.current
      if (!audio || !audio.paused) {
        remove()
        return
      }
      audio.volume = VOLUME
      audio
        .play()
        .then(() => {
          setPlaying(true)
          remove()
        })
        .catch(() => {
          // sin activación suficiente: se reintenta en la próxima interacción
        })
    }
    events.forEach((event) => window.addEventListener(event, handler))
    return remove
  }, [])

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="none" />

      <motion.button
        type="button"
        onClick={toggle}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        whileTap={{ scale: 0.92 }}
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
        title={playing ? 'Pausar música' : 'Reproducir música'}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-honey text-brown-dark shadow-[0_12px_28px_-10px_rgba(107,76,47,0.7)] hover:bg-honey-dark hover:text-warm-white"
      >
        {playing ? (
          <>
            <Music className="h-5 w-5" />
            <span className="absolute inset-0 animate-ping rounded-full bg-honey/50" />
          </>
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </motion.button>
    </>
  )
}