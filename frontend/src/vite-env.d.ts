/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base del backend (Cloudflare Workers). Vacío = modo simulado. */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}