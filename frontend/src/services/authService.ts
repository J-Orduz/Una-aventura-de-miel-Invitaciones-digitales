import { isSupabaseConfigured, supabase } from '../lib/supabase'

/** Autenticación del panel con Supabase Auth. */
export const authService = {
  async signIn(email: string, password: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('AUTH_NOT_CONFIGURED')
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('INVALID_CREDENTIALS')
  },

  async signOut(): Promise<void> {
    if (!isSupabaseConfigured()) return
    await supabase.auth.signOut()
  },

  async getAccessToken(): Promise<string | null> {
    if (!isSupabaseConfigured()) return null
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  },

  async hasSession(): Promise<boolean> {
    if (!isSupabaseConfigured()) return false
    const { data } = await supabase.auth.getSession()
    return Boolean(data.session)
  },
}
