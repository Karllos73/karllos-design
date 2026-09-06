create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  contact text not null,
  brief text
);
alter table public.leads enable row level security;
create policy "public insert" on public.leads for insert to anon with check (true);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort_order int not null default 0,
  title text not null,
  category text not null check (category in ('video','design','marca')),
  subtitle text not null
);
alter table public.projects enable row level security;
create policy "public read" on public.projects for select to anon using (true);

insert into public.projects (sort_order, title, category, subtitle) values
  (1, 'Blefaroplastia', 'video', 'Bastidores · Dra. Sulley · Clipes de procedimento'),
  (2, 'Clipes Cirúrgicos', 'video', 'Dr. Paulo José · Bastidores de procedimento · Corte'),
  (3, 'Bastidores de Centro Cirúrgico', 'video', 'Institucional · Paulo José'),
  (4, 'Oceno', 'video', 'Flow Edit · Edição de fluxo · Transições'),
  (5, 'Reel Cinematográfico', 'video', 'Color & VFX · Edição autoral · Cortes dinâmicos'),
  (6, 'Identidade Visual', 'marca', 'Cafeteria de Bairro · Logotipo · Paleta · Aplicações'),
  (7, 'Social Media', 'design', 'Coleção Cápsula · Kit de 12 artes · Feed + Stories'),
  (8, 'Redesign de Logotipo', 'marca', 'Estúdio de Yoga · Reposicionamento de marca'),
  (9, 'Cardápio & Sinalização', 'design', 'Restaurante · Editorial · Impresso');
