import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

/** ¿Están configuradas las credenciales de Supabase? */
export function isSupabaseConfigured(): boolean {
  return supabaseUrl.trim() !== '' && supabaseAnonKey.trim() !== ''
}

/** Cliente público de Supabase, usado solo para la sesión del panel. */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
})
