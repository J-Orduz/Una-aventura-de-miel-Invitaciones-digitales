create table if not exists evento (
  id integer primary key default 1,
  nombre text not null,
  fecha text not null,
  hora text not null,
  lugar text not null,
  direccion text not null,
  mensaje text not null,
  updated_at timestamptz not null default now(),
  constraint evento_singleton check (id = 1)
);

create table if not exists invitaciones (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  codigo text not null unique,
  nombre text not null,
  mensaje text not null,
  confirmacion text not null default 'pending'
    check (confirmacion in ('pending', 'confirmed')),
  fecha_confirmacion timestamptz,
  estado text not null default 'activa'
    check (estado in ('activa', 'inactiva', 'enviada', 'respondida')),
  fecha_creacion timestamptz not null default now()
);

create table if not exists regalos (
  id uuid primary key default gen_random_uuid(),
  invitacion_id uuid not null references invitaciones(id) on delete cascade,
  nombre text not null,
  imagen text,
  descripcion text,
  orden integer not null default 0
);

create index if not exists regalos_invitacion_id_idx on regalos (invitacion_id);

-- ---------- Seguridad ----------
-- El Worker usa la service_role (que ignora RLS). Al activar RLS sin
-- políticas, la llave "anon" no puede leer ni escribir nada directamente:
-- todo pasa por el Worker.

alter table evento enable row level security;
alter table invitaciones enable row level security;
alter table regalos enable row level security;

-- ---------- Datos del evento (fila única) ----------

insert into evento (id, nombre, fecha, hora, lugar, direccion, mensaje)
values (
  1,
  'Una Aventura de Miel',
  'Sábado 24 de octubre',
  '3:00 p. m.',
  'Casa de la Familia Páez',
  'Calle de los Sauces #12-34, Bosque de los Cien Acres',
  'Una fiesta con miel, globos y mucha ternura para darle la bienvenida a nuestro pequeño. ¡No hay nada más dulce que compartir con ustedes!'
)
on conflict (id) do nothing;

-- ---------- Invitaciones de ejemplo ----------

insert into invitaciones (id, slug, codigo, nombre, mensaje, confirmacion, fecha_confirmacion, estado, fecha_creacion)
values
  (
    'e1b2a5e0-0001-40a1-8a5e-000000000001',
    'familia-orduz',
    'ORDUZ-2026-H21',
    'Familia Orduz',
    E'Querida Familia Orduz:\n\nQueremos compartir con ustedes una ocasión muy especial. Nuestro pequeño tesoro está por llegar y nos encantaría celebrar este momento junto a ustedes.',
    'pending',
    null,
    'enviada',
    '2026-09-10T10:00:00.000Z'
  ),
  (
    'e1b2a5e0-0002-40a1-8a5e-000000000002',
    'familia-rodriguez',
    'RODRIGUEZ-2026-H22',
    'Familia Rodríguez',
    E'Querida Familia Rodríguez:\n\nSu amistad ha sido un regalo en nuestro camino y ahora queremos compartir con ustedes la llegada de nuestro pequeño tesoro. Su presencia hará de este día un momento inolvidable.',
    'confirmed',
    '2026-09-15T18:30:00.000Z',
    'respondida',
    '2026-09-10T10:00:00.000Z'
  )
on conflict (id) do nothing;

insert into regalos (invitacion_id, nombre, imagen, descripcion, orden)
values
  ('e1b2a5e0-0001-40a1-8a5e-000000000001', 'Pañales talla M', null, 'Nos ayudan a mantener a nuestro bebé seco y feliz', 0),
  ('e1b2a5e0-0001-40a1-8a5e-000000000001', 'Toallitas húmedas', null, 'Suaves y delicadas para el cuidado diario', 1),
  ('e1b2a5e0-0001-40a1-8a5e-000000000001', 'Crema para bebé', null, 'Para consentir su piel después del baño', 2),
  ('e1b2a5e0-0002-40a1-8a5e-000000000002', 'Toallitas húmedas', null, 'Suaves y delicadas para el cuidado diario', 0),
  ('e1b2a5e0-0002-40a1-8a5e-000000000002', 'Set de ropita', null, 'Conjuntos tiernos para los primeros meses', 1);
