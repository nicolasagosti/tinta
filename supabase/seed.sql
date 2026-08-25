-- Tinta — datos demo
-- Correr una sola vez, después de schema.sql, en Supabase → SQL Editor.
-- Migra los 8 tatuadores de ejemplo que antes vivían en data/tatuadores.ts.
-- Quedan con user_id = null, así que nadie los puede editar desde /panel.

insert into public.profiles
  (slug, nombre, ciudad, estudio, bio, foto_url, estilos, experiencia,
   contacto_instagram, contacto_whatsapp, contacto_email, contacto_web)
values
  ('mora-benitez', 'Mora Benítez', 'Buenos Aires', 'Estudio Tinta Negra',
   'Especialista en realismo en blanco y negro. Trabajo con referencia fotográfica y hago el diseño junto al cliente antes de la sesión. Turnos de lunes a viernes.',
   '/img/perfil/mora-benitez.svg', array['Realismo', 'Blackwork'], 9,
   '@mora.tattoo', '+54 9 11 4455-6677', 'mora@tintanegra.com.ar', null),

  ('tomas-arce', 'Tomás Arce', 'Córdoba', 'Arce Ink',
   'Old school y neotradicional con paleta saturada. Diseños propios del flash disponible o proyectos a medida. Reservas con seña del 30%.',
   '/img/perfil/tomas-arce.svg', array['Old School', 'Neotradicional'], 6,
   '@arce.ink', '+54 9 351 233-8899', 'hola@arceink.com', 'https://arceink.com'),

  ('juli-ferrari', 'Juli Ferrari', 'Rosario', 'Casa Fina',
   'Fineline y microrealismo. Líneas finas, botánica y lettering delicado. Ideal para primeros tatuajes.',
   '/img/perfil/juli-ferrari.svg', array['Fineline', 'Lettering'], 4,
   '@juli.fineline', '+54 9 341 566-1200', 'juli@casafina.ar', null),

  ('kenji-morales', 'Kenji Morales', 'Buenos Aires', 'Sumi Studio',
   'Tatuaje japonés tradicional (irezumi). Proyectos grandes de brazo, espalda y pierna trabajados en varias sesiones.',
   '/img/perfil/kenji-morales.svg', array['Japonés', 'Blackwork'], 12,
   '@sumi.kenji', '+54 9 11 6788-2211', 'kenji@sumistudio.com', 'https://sumistudio.com'),

  ('vera-luna', 'Vera Luna', 'Mendoza', 'Luna Tattoo Club',
   'Geométrico, dotwork y ornamental. Composiciones simétricas hechas a medida para cada parte del cuerpo.',
   '/img/perfil/vera-luna.svg', array['Geométrico', 'Puntillismo'], 7,
   '@veraluna.tattoo', '+54 9 261 400-7788', 'vera@lunatattoo.club', null),

  ('nico-quiroga', 'Nico Quiroga', 'La Plata', 'Sótano Tattoo',
   'Blackwork pesado, tribal moderno y cover ups. Me especializo en tapar trabajos viejos con diseños sólidos.',
   '/img/perfil/nico-quiroga.svg', array['Blackwork', 'Tribal'], 10,
   '@quiroga.blackwork', '+54 9 221 315-4400', 'nico@sotanotattoo.ar', null),

  ('sol-marino', 'Sol Marino', 'Mar del Plata', 'Agua Salada',
   'Acuarela y color suave. Diseños con degradés, flores y fauna marina. Trabajo con tinta vegana.',
   '/img/perfil/sol-marino.svg', array['Acuarela', 'Neotradicional'], 5,
   '@sol.aguasalada', '+54 9 223 690-1133', 'sol@aguasalada.com.ar', null),

  ('leo-paz', 'Leo Paz', 'Neuquén', 'Paz Tattoo',
   'Anime, cartoon y personajes. Fanático de recrear escenas de manga con color plano y contorno definido.',
   '/img/perfil/leo-paz.svg', array['Anime', 'Old School'], 3,
   '@leopaz.tattoo', '+54 9 299 511-2020', 'leo@paztattoo.ar', null)
on conflict (slug) do nothing;

insert into public.precios (profile_id, tamano, desde, hasta)
select p.id, v.tamano, v.desde, v.hasta
from public.profiles p
join (values
  ('mora-benitez', 'pequeno', 45000, 70000), ('mora-benitez', 'mediano', 90000, 150000), ('mora-benitez', 'grande', 180000, 320000), ('mora-benitez', 'sesion', 350000, 350000),
  ('tomas-arce', 'pequeno', 30000, 50000), ('tomas-arce', 'mediano', 65000, 110000), ('tomas-arce', 'grande', 140000, 240000), ('tomas-arce', 'sesion', 260000, 260000),
  ('juli-ferrari', 'pequeno', 22000, 38000), ('juli-ferrari', 'mediano', 48000, 85000), ('juli-ferrari', 'grande', 110000, 180000), ('juli-ferrari', 'sesion', 210000, 210000),
  ('kenji-morales', 'pequeno', 60000, 95000), ('kenji-morales', 'mediano', 130000, 200000), ('kenji-morales', 'grande', 260000, 420000), ('kenji-morales', 'sesion', 480000, 480000),
  ('vera-luna', 'pequeno', 28000, 45000), ('vera-luna', 'mediano', 70000, 120000), ('vera-luna', 'grande', 150000, 270000), ('vera-luna', 'sesion', 300000, 300000),
  ('nico-quiroga', 'pequeno', 35000, 55000), ('nico-quiroga', 'mediano', 80000, 130000), ('nico-quiroga', 'grande', 170000, 290000), ('nico-quiroga', 'sesion', 320000, 320000),
  ('sol-marino', 'pequeno', 26000, 42000), ('sol-marino', 'mediano', 60000, 105000), ('sol-marino', 'grande', 130000, 220000), ('sol-marino', 'sesion', 240000, 240000),
  ('leo-paz', 'pequeno', 20000, 34000), ('leo-paz', 'mediano', 45000, 78000), ('leo-paz', 'grande', 100000, 165000), ('leo-paz', 'sesion', 190000, 190000)
) as v(slug, tamano, desde, hasta) on v.slug = p.slug
on conflict (profile_id, tamano) do nothing;

insert into public.trabajos (profile_id, titulo, estilo, imagen_url, orden)
select p.id, v.titulo, v.estilo, v.imagen, v.orden
from public.profiles p
join (values
  ('mora-benitez', 'Retrato en grises', 'Realismo', '/img/trabajos/mora-benitez-1.svg', 1),
  ('mora-benitez', 'Ojo con sombras', 'Realismo', '/img/trabajos/mora-benitez-2.svg', 2),
  ('mora-benitez', 'Rosa negra', 'Blackwork', '/img/trabajos/mora-benitez-3.svg', 3),
  ('mora-benitez', 'León en el antebrazo', 'Realismo', '/img/trabajos/mora-benitez-4.svg', 4),

  ('tomas-arce', 'Daga tradicional', 'Old School', '/img/trabajos/tomas-arce-1.svg', 1),
  ('tomas-arce', 'Pantera saltando', 'Old School', '/img/trabajos/tomas-arce-2.svg', 2),
  ('tomas-arce', 'Corazón y rosas', 'Neotradicional', '/img/trabajos/tomas-arce-3.svg', 3),

  ('juli-ferrari', 'Rama de olivo', 'Fineline', '/img/trabajos/juli-ferrari-1.svg', 1),
  ('juli-ferrari', 'Frase manuscrita', 'Lettering', '/img/trabajos/juli-ferrari-2.svg', 2),
  ('juli-ferrari', 'Constelación', 'Fineline', '/img/trabajos/juli-ferrari-3.svg', 3),
  ('juli-ferrari', 'Mariposa mínima', 'Fineline', '/img/trabajos/juli-ferrari-4.svg', 4),

  ('kenji-morales', 'Carpa koi', 'Japonés', '/img/trabajos/kenji-morales-1.svg', 1),
  ('kenji-morales', 'Dragón en la espalda', 'Japonés', '/img/trabajos/kenji-morales-2.svg', 2),
  ('kenji-morales', 'Ola y flores', 'Japonés', '/img/trabajos/kenji-morales-3.svg', 3),

  ('vera-luna', 'Mandala de antebrazo', 'Geométrico', '/img/trabajos/vera-luna-1.svg', 1),
  ('vera-luna', 'Luna en puntillismo', 'Puntillismo', '/img/trabajos/vera-luna-2.svg', 2),
  ('vera-luna', 'Ornamental de brazo', 'Geométrico', '/img/trabajos/vera-luna-3.svg', 3),
  ('vera-luna', 'Triángulos y sombra', 'Geométrico', '/img/trabajos/vera-luna-4.svg', 4),

  ('nico-quiroga', 'Manga tribal', 'Tribal', '/img/trabajos/nico-quiroga-1.svg', 1),
  ('nico-quiroga', 'Cover up de hombro', 'Blackwork', '/img/trabajos/nico-quiroga-2.svg', 2),
  ('nico-quiroga', 'Bloque negro', 'Blackwork', '/img/trabajos/nico-quiroga-3.svg', 3),

  ('sol-marino', 'Medusa en acuarela', 'Acuarela', '/img/trabajos/sol-marino-1.svg', 1),
  ('sol-marino', 'Ramo de colores', 'Acuarela', '/img/trabajos/sol-marino-2.svg', 2),
  ('sol-marino', 'Colibrí', 'Neotradicional', '/img/trabajos/sol-marino-3.svg', 3),

  ('leo-paz', 'Personaje shonen', 'Anime', '/img/trabajos/leo-paz-1.svg', 1),
  ('leo-paz', 'Gato cartoon', 'Anime', '/img/trabajos/leo-paz-2.svg', 2),
  ('leo-paz', 'Espada y llamas', 'Old School', '/img/trabajos/leo-paz-3.svg', 3)
) as v(slug, titulo, estilo, imagen, orden) on v.slug = p.slug
where not exists (
  select 1 from public.trabajos t where t.profile_id = p.id and t.titulo = v.titulo
);
