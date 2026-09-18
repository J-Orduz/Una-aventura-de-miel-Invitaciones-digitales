import { authClient } from './supabase'
import { HttpError } from './http'
import type { Env } from './types'

/** Verifica el token de Supabase Auth del panel y devuelve el usuario. */
export async function requireUser(request: Request, env: Env) {
  const header = request.headers.get('Authorization') ?? ''
  if (!header.toLowerCase().startsWith('bearer ')) {
    throw new HttpError(401, 'NO_TOKEN')
  }

  const token = header.slice(7).trim()
  const { data, error } = await authClient(env).auth.getUser(token)
  if (error || !data.user) {
    throw new HttpError(401, 'INVALID_TOKEN')
  }

  return data.user
}
