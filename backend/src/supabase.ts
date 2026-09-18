import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Env } from './types'

const options = { auth: { persistSession: false, autoRefreshToken: false } } as const

/** Cliente con permisos totales. Solo existe dentro del Worker. */
export function serviceClient(env: Env): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, options)
}

/** Cliente público, para validar los tokens del panel de administración. */
export function authClient(env: Env): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, options)
}
