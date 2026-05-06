# CLAUDE.md — Casamento Keren & Gabriel

## Sobre o Projeto
Site de casamento elegante e romântico para **Keren & Gabriel**, 14 de março de 2027, Curitiba-PR.
Next.js 14 App Router + Supabase + Mercado Pago + Framer Motion + Tailwind CSS.

## Stack
| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 14 (App Router) | Framework principal |
| TypeScript | 5 | Tipagem |
| Tailwind CSS | 3 | Estilização |
| Supabase | 2 | PostgreSQL + Realtime |
| Mercado Pago SDK | 2 | Pagamentos |
| Framer Motion | 11 | Animações |
| React Hook Form | 7 | Formulários |
| Zod | 3 | Validação |

## Comandos
```bash
npm run dev        # Servidor local http://localhost:3000
npm run build      # Build de produção
npm run lint       # ESLint
npx supabase db push  # Aplica migrations no Supabase
```

## Mapa de Páginas
| Rota | Arquivo | Descrição |
|---|---|---|
| `/` | `app/page.tsx` | Home: Hero + Countdown + Corações |
| `/nossa-historia` | `app/nossa-historia/page.tsx` | Timeline do casal |
| `/detalhes` | `app/detalhes/page.tsx` | Cerimônia, recepção, mapa, .ics |
| `/padrinhos` | `app/padrinhos/page.tsx` | Grid de padrinhos/madrinhas |
| `/presentes` | `app/presentes/page.tsx` | Lista com MP integration |
| `/confirmar-presenca` | `app/confirmar-presenca/page.tsx` | RSVP form |
| `/recados` | `app/recados/page.tsx` | Livro de recados + Realtime |
| `/admin` | `app/admin/page.tsx` | Painel admin (senha via env) |

## APIs
| Rota | Método | Descrição |
|---|---|---|
| `/api/mp/criar-preferencia` | POST | Cria preferência MP |
| `/api/mp/webhook` | POST | IPN do Mercado Pago |
| `/api/presentes/[id]/reservar` | PATCH | Reserva manual |
| `/api/confirmacoes` | POST | Novo RSVP |
| `/api/recados` | POST | Novo recado (pendente) |
| `/api/admin/auth` | POST/DELETE | Login/logout admin |
| `/api/admin/recados` | GET/PATCH | Gerenciar recados |
| `/api/admin/confirmacoes` | GET | Listar RSVPs |
| `/api/agenda` | GET | Download .ics |

## Design System
### Paleta de Cores
```
ivory:    #FAF7F2  (fundo principal)
rose:     #C9A9A6  (rosa empoeirado)
sage:     #7A8C6E  (verde sálvia)
gold:     #C4A35A  (ouro — cor de destaque)
```

### Tipografia
```
font-heading → Cormorant Garamond (serif, títulos elegantes)
font-body    → Lato (sans-serif, texto corrido)
```

### Classes Utilitárias Principais
```css
.card-elegant      → Card branco com sombra suave e hover lift
.btn-primary       → Botão dourado arredondado
.btn-outline       → Botão contorno dourado
.section-title     → Título de seção (Cormorant, center)
.section-subtitle  → Subtítulo em caps (tracking-widest)
.gold-divider      → Linha dourada horizontal
.input-elegant     → Campo de formulário estilizado
.glass-card        → Cartão com backdrop-blur
```

## Padrões de Código
- **Classes CSS**: sempre usar `cn()` de `@/lib/utils` para combinar classes
- **Formulários**: react-hook-form + zod em todo cliente
- **Supabase client-side**: `getSupabaseBrowserClient()` de `@/lib/supabase/client`
- **Supabase server-side**: `getSupabaseServiceClient()` em API routes (com service role)
- **Server Components**: usar `getSupabaseAnonClient()` para leitura pública
- **Mercado Pago**: apenas em API routes server-side, nunca expor `ACCESS_TOKEN` ao cliente
- **Animações**: Framer Motion com `useInView` para scroll-triggered, `initial/animate` para mount
- **Imagens**: sempre `next/image` com `fill` ou `width/height` explícitos

## Variáveis de Ambiente
```env
# Público (disponível no browser)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
NEXT_PUBLIC_MP_WEBHOOK_URL
NEXT_PUBLIC_BASE_URL
NEXT_PUBLIC_PIX_KEY  # Chave PIX para lua de mel

# Privado (somente server)
SUPABASE_SERVICE_ROLE_KEY  # ⚠️ nunca expor ao cliente
MERCADOPAGO_ACCESS_TOKEN    # ⚠️ nunca expor ao cliente
ADMIN_PASSWORD              # ⚠️ nunca expor ao cliente
```

## Banco de Dados
Tabelas: `presentes`, `confirmacoes`, `recados`, `padrinhos`
RLS habilitado em todas. Realtime ativo em `presentes` e `recados`.
Migration: `supabase/migrations/001_initial.sql`
Seed: `supabase/seed.sql`

## Dados do Casamento (Placeholders — atualizar antes do lançamento)
- **Igreja**: Igreja Nossa Senhora do Brasil — Curitiba, PR (endereço a confirmar)
- **Espaço**: Espaço Villa Verde — Curitiba, PR (endereço a confirmar)
- **Chave PIX**: configurar em `NEXT_PUBLIC_PIX_KEY`
- **MP links**: configurar `MERCADOPAGO_ACCESS_TOKEN` no sandbox primeiro

## ⚠️ Débitos Técnicos (resolver antes do deploy de produção)

### 1. Configurar Supabase e variáveis de ambiente
**Arquivos afetados**: `lib/supabase/client.ts`, `lib/supabase/server.ts`
**Comportamento atual**: sem `.env.local`, o site usa dados mockados (fallback estático). Nenhuma operação de banco funciona.
**O que fazer**: criar projeto Supabase, rodar `supabase/migrations/001_initial.sql` + `seed.sql`, preencher `.env.local`.

### 2. Configurar Mercado Pago
**Arquivos afetados**: `lib/mercadopago.ts`, `app/api/mp/`
**Comportamento atual**: botão "Presentear" tenta criar preferência e falha silenciosamente sem `MERCADOPAGO_ACCESS_TOKEN`.
**O que fazer**: criar app no [Mercado Pago Developers](https://www.mercadopago.com.br/developers), pegar credenciais sandbox para testes e produção para lançamento. Configurar URL do webhook após deploy no Vercel.

### 3. Validação de assinatura do webhook MP
**Arquivo**: `app/api/mp/webhook/route.ts`
**Comportamento atual**: aceita qualquer POST sem verificar origem.
**O que fazer**: adicionar validação do header `x-signature` do Mercado Pago antes do lançamento.

### 4. Timing-safe comparison na senha admin
**Arquivo**: `app/api/admin/auth/route.ts`
**Comportamento atual**: comparação direta de string (vulnerável a timing attacks).
**O que fazer**: usar `crypto.timingSafeEqual()` na comparação da senha.

### 5. Foto real do casal
**Arquivo**: `public/images/hero-placeholder.svg`, `components/home/HeroSection.tsx`
**O que fazer**: substituir o SVG placeholder pela foto real. Fazer upload para Supabase Storage ou usar URL direta.
