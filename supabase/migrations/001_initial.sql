-- ============================================================
-- Casamento Keren & Gabriel — Schema Inicial
-- ============================================================

-- Presentes
create table if not exists presentes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  preco decimal(10,2),
  imagem_url text,
  categoria text,
  status text default 'disponivel' check (status in ('disponivel','reservado','comprado')),
  comprador_nome text,
  comprador_mensagem text,
  mp_preference_id text,
  mp_payment_id text,
  created_at timestamptz default now()
);

alter table presentes enable row level security;
create policy "Presentes leitura pública" on presentes for select using (true);
create policy "Presentes escrita service role" on presentes for all using (auth.role() = 'service_role');

-- RSVP
create table if not exists confirmacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,
  telefone text,
  acompanhantes integer default 0,
  confirmado boolean default true,
  restricao_alimentar text,
  mensagem text,
  created_at timestamptz default now()
);

alter table confirmacoes enable row level security;
create policy "Insert confirmacoes público" on confirmacoes for insert with check (true);
create policy "Confirmacoes leitura service role" on confirmacoes for select using (auth.role() = 'service_role');

-- Livro de Recados
create table if not exists recados (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  mensagem text not null,
  aprovado boolean default false,
  created_at timestamptz default now()
);

alter table recados enable row level security;
create policy "Recados aprovados públicos" on recados for select using (aprovado = true);
create policy "Insert recados público" on recados for insert with check (true);
create policy "Recados admin service role" on recados for all using (auth.role() = 'service_role');

-- Padrinhos
create table if not exists padrinhos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  titulo text not null,
  foto_url text,
  ordem integer,
  created_at timestamptz default now()
);

alter table padrinhos enable row level security;
create policy "Padrinhos leitura pública" on padrinhos for select using (true);
create policy "Padrinhos escrita service role" on padrinhos for all using (auth.role() = 'service_role');

-- Realtime para presentes e recados
alter publication supabase_realtime add table presentes;
alter publication supabase_realtime add table recados;
