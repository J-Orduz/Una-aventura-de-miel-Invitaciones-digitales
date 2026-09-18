import type { EventDetails } from '../types/invitation'

/**
 * Configuración global del evento.
 *
 * Los datos del baby shower son los mismos para todas las invitaciones, así
 * que se guardan una sola vez y se comparten. En modo simulado se persisten
 * en localStorage; al conectar el backend pasarán a Supabase.
 */
const STORAGE_KEY = 'una-aventura-de-miel:evento'

export const defaultEventConfig: EventDetails = {
  nombre: 'Una Aventura de Miel',
  fecha: 'Sábado 24 de octubre',
  hora: '3:00 p. m.',
  lugar: 'Casa de la Familia Páez',
  direccion: 'Calle de los Sauces #12-34, Bosque de los Cien Acres',
  mensaje:
    'Una fiesta con miel, globos y mucha ternura para darle la bienvenida a nuestro pequeño. ¡No hay nada más dulce que compartir con ustedes!',
}

export function loadEventConfig(): EventDetails {
  if (typeof localStorage === 'undefined') return defaultEventConfig
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultEventConfig
    return { ...defaultEventConfig, ...(JSON.parse(raw) as Partial<EventDetails>) }
  } catch {
    return defaultEventConfig
  }
}

export function saveEventConfig(config: EventDetails): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // almacenamiento no disponible: se mantiene solo en memoria
  }
}