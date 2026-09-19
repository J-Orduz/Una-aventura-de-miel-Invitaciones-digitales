import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'

/**
 * Mapa de Google embebido sin necesidad de API key.
 *
 * Para garantizar el marcador de posición, primero se geocodifica la
 * dirección con Nominatim (OpenStreetMap, gratuito y sin clave) y se centra
 * el mapa en esas coordenadas: así siempre aparece el pin rojo. Si la
 * dirección no se reconoce, se usa la búsqueda de Google como respaldo.
 * El iframe permite mover el mapa, acercar/alejar y abrirlo en Google Maps.
 */
export function buildMapQuery(lugar?: string | null, direccion?: string | null): string {
  return [lugar?.trim(), direccion?.trim()].filter(Boolean).join(', ')
}

interface Coords {
  lat: string
  lon: string
}

/** Caché en memoria para no repetir la misma búsqueda. */
const geocodeCache = new Map<string, Coords | null>()

async function geocodeAddress(query: string, signal: AbortSignal): Promise<Coords | null> {
  const key = query.trim().toLowerCase()
  if (geocodeCache.has(key)) return geocodeCache.get(key) ?? null
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error('GEOCODE_FAILED')
  const data: unknown = await response.json()
  const first = Array.isArray(data) ? (data[0] as { lat?: string; lon?: string }) : null
  const coords = first?.lat && first?.lon ? { lat: first.lat, lon: first.lon } : null
  geocodeCache.set(key, coords)
  return coords
}

function fallbackSrc(q: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`
}

interface MapEmbedProps {
  query: string
  title?: string
}

export function MapEmbed({ query, title = 'Mapa de ubicación del evento' }: MapEmbedProps) {
  const q = query.trim()
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!q) {
      setSrc(null)
      return
    }
    // Direcciones muy cortas (mientras escriben): respaldo directo.
    if (q.length < 6) {
      setSrc(fallbackSrc(q))
      return
    }
    let cancelled = false
    const controller = new AbortController()
    // Espera a que terminen de escribir antes de geocodificar (1 req/s).
    const timer = window.setTimeout(async () => {
      try {
        const coords = await geocodeAddress(q, controller.signal)
        if (cancelled) return
        setSrc(
          coords
            ? `https://maps.google.com/maps?q=${coords.lat},${coords.lon}&z=16&output=embed`
            : fallbackSrc(q),
        )
      } catch {
        if (!cancelled) setSrc(fallbackSrc(q))
      }
    }, 600)
    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [q])

  if (!q) return null

  return (
    <div>
      <div className="overflow-hidden rounded-2xl soft-shadow">
        {src ? (
          <iframe
            title={title}
            src={src}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-64 w-full border-0 sm:h-72"
          />
        ) : (
          <div className="flex h-64 w-full flex-col items-center justify-center gap-2 bg-cream sm:h-72 animate-pulse">
            <MapPin className="w-8 h-8 text-honey-dark" />
            <p className="font-hand text-xl text-brown">Buscando la ubicación…</p>
          </div>
        )}
      </div>
      <p className="mt-1.5 text-right text-[11px] text-brown/50">Ubicación © contribuidores de OpenStreetMap</p>
    </div>
  )
}
