import { requireUser } from './auth'
import {
  buildCodigo,
  DEFAULT_EVENTO,
  fetchEvento,
  fetchRegalos,
  mapInvitation,
  mapPreview,
} from './db'
import { corsHeaders, errorResponse, HttpError, json, readJson, type RequestContext } from './http'
import { serviceClient } from './supabase'
import type {
  DbInvitation,
  Env,
  EventDetails,
  InvitationInput,
} from './types'

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function replaceRegalos(
  db: ReturnType<typeof serviceClient>,
  invitacionId: string,
  regalos: InvitationInput['regalos'],
): Promise<void> {
  const { error: deleteError } = await db.from('regalos').delete().eq('invitacion_id', invitacionId)
  if (deleteError) throw new HttpError(500, 'DB_ERROR')
  if (!regalos || regalos.length === 0) return

  const rows = regalos
    .filter((gift) => gift.nombre?.trim())
    .map((gift, index) => ({
      invitacion_id: invitacionId,
      nombre: gift.nombre.trim(),
      imagen: gift.imagen ?? null,
      descripcion: gift.descripcion ?? null,
      orden: index,
    }))
  if (rows.length === 0) return

  const { error } = await db.from('regalos').insert(rows)
  if (error) throw new HttpError(500, 'DB_ERROR')
}

async function getInvitationBySlug(slug: string, ctx: RequestContext): Promise<Response> {
  const db = serviceClient(ctx.env)
  const { data, error } = await db.from('invitaciones').select('*').eq('slug', slug).maybeSingle()
  if (error) throw new HttpError(500, 'DB_ERROR')
  if (!data) throw new HttpError(404, 'INVITATION_NOT_FOUND')

  const invitation = data as DbInvitation
  const [evento, regalos] = await Promise.all([fetchEvento(db), fetchRegalos(db, invitation.id)])
  return json(mapInvitation(invitation, evento, regalos), 200, ctx)
}

async function confirmInvitation(request: Request, ctx: RequestContext): Promise<Response> {
  const body = await readJson<{ codigo?: string; slug?: string }>(request)
  if (!body.codigo || !body.slug) throw new HttpError(400, 'MISSING_FIELDS')

  const db = serviceClient(ctx.env)
  const { data, error } = await db
    .from('invitaciones')
    .select('*')
    .eq('slug', body.slug)
    .eq('codigo', body.codigo)
    .maybeSingle()
  if (error) throw new HttpError(500, 'DB_ERROR')
  if (!data) throw new HttpError(404, 'INVITATION_NOT_FOUND')

  const invitation = data as DbInvitation
  if (invitation.confirmacion === 'confirmed') {
    return json(
      {
        ok: true,
        fechaConfirmacion: invitation.fecha_confirmacion,
        message: 'Tu asistencia ya estaba confirmada.',
      },
      200,
      ctx,
    )
  }

  const fechaConfirmacion = new Date().toISOString()
  const { error: updateError } = await db
    .from('invitaciones')
    .update({ confirmacion: 'confirmed', fecha_confirmacion: fechaConfirmacion, estado: 'respondida' })
    .eq('id', invitation.id)
  if (updateError) throw new HttpError(500, 'DB_ERROR')

  return json(
    { ok: true, fechaConfirmacion, message: '¡Gracias por confirmar tu asistencia!' },
    200,
    ctx,
  )
}

async function listInvitations(ctx: RequestContext): Promise<Response> {
  const db = serviceClient(ctx.env)
  const { data: invitations, error } = await db
    .from('invitaciones')
    .select('*')
    .order('fecha_creacion', { ascending: false })
  if (error) throw new HttpError(500, 'DB_ERROR')

  const { data: gifts, error: giftsError } = await db.from('regalos').select('invitacion_id')
  if (giftsError) throw new HttpError(500, 'DB_ERROR')

  const counts = new Map<string, number>()
  for (const gift of (gifts ?? []) as { invitacion_id: string }[]) {
    counts.set(gift.invitacion_id, (counts.get(gift.invitacion_id) ?? 0) + 1)
  }

  const previews = ((invitations ?? []) as DbInvitation[]).map((row) =>
    mapPreview(row, counts.get(row.id) ?? 0),
  )
  return json(previews, 200, ctx)
}

async function getInvitationById(id: string, ctx: RequestContext): Promise<Response> {
  const db = serviceClient(ctx.env)
  const { data, error } = await db.from('invitaciones').select('*').eq('id', id).maybeSingle()
  if (error) throw new HttpError(500, 'DB_ERROR')
  if (!data) throw new HttpError(404, 'INVITATION_NOT_FOUND')

  const invitation = data as DbInvitation
  const [evento, regalos] = await Promise.all([fetchEvento(db), fetchRegalos(db, invitation.id)])
  return json(mapInvitation(invitation, evento, regalos), 200, ctx)
}

async function createInvitation(request: Request, ctx: RequestContext): Promise<Response> {
  const body = await readJson<InvitationInput>(request)
  if (!body.nombre?.trim()) throw new HttpError(400, 'MISSING_FIELDS')

  const db = serviceClient(ctx.env)
  // El slug es igual al código: un valor no adivinable que protege la URL.
  const codigo = buildCodigo(body.nombre)
  const slug = codigo

  const { data: existing, error: existingError } = await db
    .from('invitaciones')
    .select('id')
    .or(`slug.eq.${slug},codigo.eq.${codigo}`)
    .maybeSingle()
  if (existingError) throw new HttpError(500, 'DB_ERROR')
  if (existing) throw new HttpError(409, 'SLUG_TAKEN')

  const { data, error } = await db
    .from('invitaciones')
    .insert({
      slug,
      codigo,
      nombre: body.nombre.trim(),
      mensaje: body.mensaje ?? '',
      estado: body.estado ?? 'activa',
    })
    .select()
    .single()
  if (error || !data) throw new HttpError(500, 'DB_ERROR')

  const invitation = data as DbInvitation
  await replaceRegalos(db, invitation.id, body.regalos)

  const [evento, regalos] = await Promise.all([fetchEvento(db), fetchRegalos(db, invitation.id)])
  return json(mapInvitation(invitation, evento, regalos), 201, ctx)
}

async function updateInvitation(id: string, request: Request, ctx: RequestContext): Promise<Response> {
  const body = await readJson<InvitationInput>(request)
  const db = serviceClient(ctx.env)

  const { data: current, error: currentError } = await db
    .from('invitaciones')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (currentError) throw new HttpError(500, 'DB_ERROR')
  if (!current) throw new HttpError(404, 'INVITATION_NOT_FOUND')

  const patch: Record<string, unknown> = {}
  if (body.nombre !== undefined) patch.nombre = body.nombre.trim()
  if (body.mensaje !== undefined) patch.mensaje = body.mensaje
  if (body.estado !== undefined) patch.estado = body.estado

  if (body.slug !== undefined) {
    const slug = slugify(body.slug)
    if (slug && slug !== (current as DbInvitation).slug) {
      const { data: duplicate, error: duplicateError } = await db
        .from('invitaciones')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      if (duplicateError) throw new HttpError(500, 'DB_ERROR')
      if (duplicate) throw new HttpError(409, 'SLUG_TAKEN')
      patch.slug = slug
    }
  }

  if (Object.keys(patch).length > 0) {
    const { error } = await db.from('invitaciones').update(patch).eq('id', id)
    if (error) throw new HttpError(500, 'DB_ERROR')
  }

  if (body.regalos !== undefined) {
    await replaceRegalos(db, id, body.regalos)
  }

  const { data, error } = await db.from('invitaciones').select('*').eq('id', id).single()
  if (error || !data) throw new HttpError(500, 'DB_ERROR')

  const invitation = data as DbInvitation
  const [evento, regalos] = await Promise.all([fetchEvento(db), fetchRegalos(db, invitation.id)])
  return json(mapInvitation(invitation, evento, regalos), 200, ctx)
}

async function deleteInvitation(id: string, ctx: RequestContext): Promise<Response> {
  const db = serviceClient(ctx.env)
  const { error } = await db.from('invitaciones').delete().eq('id', id)
  if (error) throw new HttpError(500, 'DB_ERROR')
  return json({ ok: true }, 200, ctx)
}

async function getEvento(ctx: RequestContext): Promise<Response> {
  const db = serviceClient(ctx.env)
  return json(await fetchEvento(db), 200, ctx)
}

async function updateEvento(request: Request, ctx: RequestContext): Promise<Response> {
  const body = await readJson<Partial<EventDetails>>(request)
  const db = serviceClient(ctx.env)

  const { error } = await db.from('evento').upsert({
    id: 1,
    nombre: body.nombre ?? DEFAULT_EVENTO.nombre,
    fecha: body.fecha ?? DEFAULT_EVENTO.fecha,
    hora: body.hora ?? DEFAULT_EVENTO.hora,
    lugar: body.lugar ?? DEFAULT_EVENTO.lugar,
    direccion: body.direccion ?? DEFAULT_EVENTO.direccion,
    mensaje: body.mensaje ?? DEFAULT_EVENTO.mensaje,
    updated_at: new Date().toISOString(),
  })
  if (error) throw new HttpError(500, 'DB_ERROR')

  return json(await fetchEvento(db), 200, ctx)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)
    const method = request.method
    const ctx: RequestContext = { env, origin: request.headers.get('Origin') }

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(ctx) })
    }

    try {
      if (pathname === '/api/health') {
        return json({ ok: true, service: 'una-aventura-de-miel-api' }, 200, ctx)
      }

      // ---- Público ----
      if (pathname === '/api/invitacion/confirmar' && method === 'POST') {
        return await confirmInvitation(request, ctx)
      }
      if (pathname.startsWith('/api/invitacion/') && method === 'GET') {
        const slug = decodeURIComponent(pathname.slice('/api/invitacion/'.length))
        return await getInvitationBySlug(slug, ctx)
      }

      // ---- Panel de administración ----
      if (pathname === '/api/evento' && method === 'GET') {
        await requireUser(request, ctx.env)
        return await getEvento(ctx)
      }
      if (pathname === '/api/evento' && method === 'PUT') {
        await requireUser(request, ctx.env)
        return await updateEvento(request, ctx)
      }
      if (pathname === '/api/invitaciones' && method === 'GET') {
        await requireUser(request, ctx.env)
        return await listInvitations(ctx)
      }
      if (pathname === '/api/invitaciones' && method === 'POST') {
        await requireUser(request, ctx.env)
        return await createInvitation(request, ctx)
      }

      const match = pathname.match(/^\/api\/invitaciones\/([^/]+)$/)
      if (match) {
        await requireUser(request, ctx.env)
        const id = decodeURIComponent(match[1])
        if (method === 'GET') return await getInvitationById(id, ctx)
        if (method === 'PUT') return await updateInvitation(id, request, ctx)
        if (method === 'DELETE') return await deleteInvitation(id, ctx)
      }

      throw new HttpError(404, 'NOT_FOUND')
    } catch (err) {
      if (err instanceof HttpError) return errorResponse(err.message, err.status, ctx)
      console.error('Unhandled error:', err)
      return errorResponse('INTERNAL_ERROR', 500, ctx)
    }
  },
} satisfies ExportedHandler<Env>
