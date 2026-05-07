-- ============================================================
-- Casamento Keren & Gabriel — Contribuições parciais
-- ============================================================

create table if not exists contribuicoes (
  id uuid primary key default gen_random_uuid(),
  presente_id uuid not null references presentes(id) on delete cascade,
  contribuidor_nome text not null,
  contribuidor_email text,
  valor decimal(10,2) not null check (valor >= 20),
  mensagem text,
  status text not null default 'pendente' check (status in ('pendente','aprovado','cancelado')),
  mp_preference_id text,
  mp_payment_id text,
  created_at timestamptz default now()
);

create index if not exists idx_contribuicoes_presente on contribuicoes(presente_id);
create index if not exists idx_contribuicoes_status on contribuicoes(status);

alter table contribuicoes enable row level security;

-- Leitura pública apenas das contribuições aprovadas (para mostrar nomes/% nos cards)
create policy "Contribuicoes aprovadas leitura pública"
  on contribuicoes for select using (status = 'aprovado');

-- Service role gerencia tudo
create policy "Contribuicoes service role"
  on contribuicoes for all using (auth.role() = 'service_role');

-- Realtime para atualizar barra de progresso ao vivo
alter publication supabase_realtime add table contribuicoes;
