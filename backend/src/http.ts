import type { Env } from './types'

/** Error con código HTTP para devolver respuestas limpias al frontend. */
export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** Datos de la petición que necesitan los handlers y las respuestas. */
export interface RequestContext {
  env: Env
  origin: string | null
}

/**
 * Determina el origen permitido.
 * ALLOWED_ORIGIN admite varios separados por coma (o `*`).
 */
function resolveAllowedOrigin(ctx: RequestContext): string {
  const configured = (ctx.env.ALLOWED_ORIGIN ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (configured.length === 0 || configured.includes('*')) return '*'
  if (ctx.origin && configured.includes(ctx.origin)) return ctx.origin
  return configured[0]
}

export function corsHeaders(ctx: RequestContext): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': resolveAllowedOrigin(ctx),
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

export function json(data: unknown, status: number, ctx: RequestContext): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(ctx),
    },
  })
}

export function errorResponse(message: string, status: number, ctx: RequestContext): Response {
  return json({ error: message }, status, ctx)
}

/** Lee el cuerpo JSON de la petición o lanza 400 si es inválido. */
export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T
  } catch {
    throw new HttpError(400, 'INVALID_BODY')
  }
}
