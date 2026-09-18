import type { Invitation } from '../types/invitation'

export const mockInvitations: Invitation[] = [
  {
    id: 'e1b2a5e0-0001-40a1-8a5e-000000000001',
    slug: 'familia-orduz',
    codigo: 'ORDUZ-2026-H21',
    nombre: 'Familia Orduz',
    mensaje:
      'Querida Familia Orduz:\n\nQueremos compartir con ustedes una ocasión muy especial. Nuestro pequeño tesoro está por llegar y nos encantaría celebrar este momento junto a ustedes.',
    confirmacion: 'pending',
    fechaConfirmacion: null,
    estado: 'enviada',
    fechaCreacion: '2026-09-10T10:00:00.000Z',
    evento: {
      nombre: 'Una Aventura de Miel',
      fecha: 'Sábado 24 de octubre',
      hora: '3:00 p. m.',
      lugar: 'Casa de la Familia Páez',
      direccion: 'Calle de los Sauces #12-34, Bosque de los Cien Acres',
      mensaje:
        'Una fiesta con miel, globos y mucha ternura para darle la bienvenida a nuestro pequeño. ¡No hay nada más dulce que compartir con ustedes!',
    },
    regalos: [
      {
        id: 'gift-000000001',
        nombre: 'Pañales talla M',
        imagen: null,
        descripcion: 'Nos ayudan a mantener a nuestro bebé seco y feliz',
      },
      {
        id: 'gift-000000002',
        nombre: 'Toallitas húmedas',
        imagen: null,
        descripcion: 'Suaves y delicadas para el cuidado diario',
      },
      {
        id: 'gift-000000003',
        nombre: 'Crema para bebé',
        imagen: null,
        descripcion: 'Para consentir su piel después del baño',
      },
    ],
  },
  {
    id: 'e1b2a5e0-0002-40a1-8a5e-000000000002',
    slug: 'familia-rodriguez',
    codigo: 'RODRIGUEZ-2026-H22',
    nombre: 'Familia Rodríguez',
    mensaje:
      'Querida Familia Rodríguez:\n\nSu amistad ha sido un regalo en nuestro camino y ahora queremos compartir con ustedes la llegada de nuestro pequeño tesoro. Su presencia hará de este día un momento inolvidable.',
    confirmacion: 'confirmed',
    fechaConfirmacion: '2026-09-15T18:30:00.000Z',
    estado: 'respondida',
    fechaCreacion: '2026-09-10T10:00:00.000Z',
    evento: {
      nombre: 'Una Aventura de Miel',
      fecha: 'Sábado 24 de octubre',
      hora: '3:00 p. m.',
      lugar: 'Casa de la Familia Páez',
      direccion: 'Calle de los Sauces #12-34, Bosque de los Cien Acres',
      mensaje:
        'Una fiesta con miel, globos y mucha ternura para darle la bienvenida a nuestro pequeño. ¡No hay nada más dulce que compartir con ustedes!',
    },
    regalos: [
      {
        id: 'gift-000000004',
        nombre: 'Toallitas húmedas',
        imagen: null,
        descripcion: 'Suaves y delicadas para el cuidado diario',
      },
      {
        id: 'gift-000000005',
        nombre: 'Set de ropita',
        imagen: null,
        descripcion: 'Conjuntos tiernos para los primeros meses',
      },
    ],
  },
]

export function getMockInvitationBySlug(slug: string): Invitation | undefined {
  return mockInvitations.find((invitation) => invitation.slug === slug)
}

export function getMockInvitationByCodigo(codigo: string): Invitation | undefined {
  return mockInvitations.find((invitation) => invitation.codigo === codigo)
}