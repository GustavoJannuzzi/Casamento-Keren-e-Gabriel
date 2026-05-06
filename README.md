# 💍 Casamento Keren & Gabriel — Site Oficial

Site de casamento elegante e romântico. Next.js 14 + Supabase + Mercado Pago + Vercel.

---

## Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com)
- Conta no [Mercado Pago](https://www.mercadopago.com.br/developers)
- Conta no [Vercel](https://vercel.com)

---

## Setup Local

### 1. Clonar e instalar
```bash
cd "Casamento Keren e Gabriel"
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
```
Edite `.env.local` com suas credenciais (ver seção abaixo).

### 3. Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) → New Project
2. Guarde: **Project URL**, **anon key**, **service_role key**
3. No painel SQL Editor, execute:
```sql
-- Cole o conteúdo de supabase/migrations/001_initial.sql
-- Depois cole o conteúdo de supabase/seed.sql
```

### 4. Rodar localmente
```bash
npm run dev
# Acesse http://localhost:3000
```

---

## Variáveis de Ambiente

| Variável | Onde pegar | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase > Settings > API | URL do projeto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase > Settings > API | Chave pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase > Settings > API | ⚠️ Manter secreta |
| `MERCADOPAGO_ACCESS_TOKEN` | MP Developers > Credenciais | ⚠️ Manter secreta |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | MP Developers > Credenciais | Chave pública MP |
| `NEXT_PUBLIC_MP_WEBHOOK_URL` | URL do seu site no Vercel | Base para webhooks |
| `ADMIN_PASSWORD` | Você define | Senha do painel /admin |
| `NEXT_PUBLIC_BASE_URL` | URL do site no Vercel | Ex: https://seusite.vercel.app |
| `NEXT_PUBLIC_PIX_KEY` | Você define | Chave PIX para lua de mel |

> **Sandbox MP**: para testes locais, use as credenciais de teste do Mercado Pago.

---

## Deploy no Vercel

### 1. Push para GitHub
```bash
git init
git add .
git commit -m "feat: site de casamento Keren & Gabriel"
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main
```

### 2. Importar no Vercel
1. [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Em **Environment Variables**, adicione todas as variáveis do `.env.local`
3. Clique **Deploy**

### 3. Configurar webhook do Mercado Pago
1. Após o deploy, copie a URL do Vercel (ex: `https://casamento-kg.vercel.app`)
2. No painel MP Developers > IPN/Webhooks: `https://casamento-kg.vercel.app/api/mp/webhook`
3. Atualize `NEXT_PUBLIC_MP_WEBHOOK_URL` e `NEXT_PUBLIC_BASE_URL` no Vercel

---

## Como Atualizar o Conteúdo

### Presentes
No painel Admin (`/admin`) ou diretamente no Supabase:
```sql
-- Adicionar presente
INSERT INTO presentes (nome, descricao, preco, categoria) VALUES ('Nome', 'Descrição', 500.00, 'cozinha');

-- Atualizar status
UPDATE presentes SET status = 'reservado', comprador_nome = 'João' WHERE id = '...';
```

### Padrinhos
```sql
INSERT INTO padrinhos (nome, titulo, ordem) VALUES ('Nome Completo', 'Padrinho', 7);
```

### Locais e Datas
Edite `app/detalhes/page.tsx` (constantes `ceremony` e `reception`).

### Foto do Casal
Substitua `/public/images/hero-placeholder.svg` por uma foto real e atualize `components/home/HeroSection.tsx`.

### Chave PIX
Atualize `NEXT_PUBLIC_PIX_KEY` nas variáveis de ambiente do Vercel.

### Recados
O painel em `/admin` permite aprovar, exibir ou remover recados do livro de recados.

---

## Estrutura de Pastas (resumo)
```
app/              → Páginas e API routes (Next.js App Router)
components/       → Componentes React reutilizáveis
lib/              → Helpers (Supabase, Mercado Pago, utils)
types/            → Tipos TypeScript
styles/           → CSS global
supabase/         → Migrations e seed SQL
public/           → Assets estáticos
CLAUDE.md         → Contexto para IA assistente
.claude/          → Configurações e skills do Claude Code
```

---

## Suporte
Para dúvidas técnicas, consulte o `CLAUDE.md` para contexto completo do projeto.
