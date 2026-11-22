
insert into public.categories
  (name, slug, description, position)
values
  ('Avisos publicitarios', 'avisos-publicitarios',
   'Avisos luminosos, volumétricos y comerciales', 1),

  ('Pendones y banners', 'pendones-banners',
   'Impresión de pendones, banners y publicidad', 2),

  ('Sellos', 'sellos',
   'Sellos personalizados y empresariales', 3),

  ('Recordatorios', 'recordatorios',
   'Recordatorios para eventos y celebraciones', 4),

  ('Acrílicos personalizados', 'acrilicos-personalizados',
   'Productos y trabajos fabricados en acrílico', 5),

  ('Impresión digital', 'impresion-digital',
   'Servicios de impresión y material publicitario', 6),

  ('Otros productos', 'otros-productos',
   'Otros trabajos y servicios personalizados', 7)
on conflict (slug) do nothing;
