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
| `/` | `app/page.tsx` | Home: Hero + Countdown + foto panorâmica |
| `/nossa-historia` | `app/nossa-historia/page.tsx` | Timeline do casal |
| `/detalhes` | `app/detalhes/page.tsx` | Cerimônia, recepção, mapa, .ics |
| `/padrinhos` | `app/padrinhos/page.tsx` | Grid de padrinhos/madrinhas |
| `/presentes` | `app/presentes/page.tsx` | Lista de presentes com pagamento parcial |
| `/confirmar-presenca` | `app/confirmar-presenca/page.tsx` | RSVP form |
| `/recados` | `app/recados/page.tsx` | Livro de recados + Realtime |
| `/perfil-noivos` | `app/perfil-noivos/page.tsx` | Painel dos noivos (senha via `NOIVOS_PASSWORD`) |

## APIs
| Rota | Método | Descrição |
|---|---|---|
| `/api/presentes` | GET | Lista presentes + valor arrecadado |
| `/api/mp/criar-preferencia` | POST | Cria contribuição (parcial ou total) + preferência MP |
| `/api/mp/webhook` | POST | IPN do MP — valida HMAC, atualiza contribuição |
| `/api/confirmacoes` | POST | Novo RSVP |
| `/api/recados` | POST | Novo recado (pendente) |
| `/api/perfil-noivos/auth` | POST/DELETE | Login/logout dos noivos (timing-safe) |
| `/api/perfil-noivos/recados` | GET/PATCH | Gerenciar recados |
| `/api/perfil-noivos/confirmacoes` | GET | Listar RSVPs |
| `/api/perfil-noivos/presentes` | GET | Listar presentes + contribuições (todos os status) |
| `/api/perfil-noivos/export/[tipo]` | GET | CSV (`tipo`: confirmacoes\|recados\|presentes\|contribuicoes) |
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
MP_WEBHOOK_SECRET           # ⚠️ HMAC do webhook MP (Developers > sua app > Webhooks)
NOIVOS_PASSWORD             # ⚠️ senha do painel dos noivos
```

## Banco de Dados
Tabelas: `presentes`, `contribuicoes`, `confirmacoes`, `recados`, `padrinhos`.
RLS habilitado em todas. Realtime ativo em `presentes`, `contribuicoes` e `recados`.

Migrations:
- `supabase/migrations/001_initial.sql` — tabelas iniciais
- `supabase/migrations/002_contribuicoes.sql` — pagamentos parciais

Seed: `supabase/seed.sql`

### Modelo de pagamento parcial
Cada compra cria um registro em `contribuicoes` (one-to-many com `presentes`):
- `valor` ≥ R$ 20 (constraint do banco)
- `status` ∈ `pendente` → `aprovado` (via webhook MP) → ou `cancelado`
- Webhook MP atualiza `contribuicoes.status='aprovado'` e captura nome real do pagador
- Quando `SUM(aprovadas) >= presentes.preco`, marca `presentes.status='comprado'`
- Botão "Presentear inteiro" no UI envia o valor restante (preco − arrecadado)

## Dados do Casamento (Placeholders — atualizar antes do lançamento)
- **Igreja**: Igreja Nossa Senhora do Brasil — Curitiba, PR (endereço a confirmar)
- **Espaço**: Espaço Villa Verde — Curitiba, PR (endereço a confirmar)
- **Chave PIX**: configurar em `NEXT_PUBLIC_PIX_KEY`
- **MP links**: configurar `MERCADOPAGO_ACCESS_TOKEN` no sandbox primeiro

## ⚠️ Pendências para entrega final

Ver também `docs/QUESTIONARIO-NOIVOS.md` para coleta de conteúdo do casal.

### Configuração de ambiente (no painel do Vercel)
- [ ] **Supabase**: criar projeto, rodar `001_initial.sql` + `002_contribuicoes.sql` + `seed.sql`. Configurar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **Mercado Pago**: criar app em [MP Developers](https://www.mercadopago.com.br/developers); configurar `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`, `NEXT_PUBLIC_MP_WEBHOOK_URL` (apontando para `/api/mp/webhook`) e gerar `MP_WEBHOOK_SECRET` (HMAC validation)
- [ ] **Painel noivos**: definir `NOIVOS_PASSWORD`
- [ ] **PIX**: definir `NEXT_PUBLIC_PIX_KEY` (item lua de mel)
- [ ] **Conteúdo**: substituir placeholders (nomes, datas, locais, presentes) com dados do questionário preenchido

### Débitos técnicos resolvidos nesta entrega
- [x] HMAC do webhook MP — `app/api/mp/webhook/route.ts` valida `x-signature`
- [x] timing-safe na senha do painel — `lib/auth.ts` usa `crypto.timingSafeEqual`
- [x] Pagamentos parciais — tabela `contribuicoes` com fluxo MP completo
- [x] Painel dos noivos com export CSV — `/perfil-noivos` substitui `/admin`
- [x] Polimento UI/UX mobile — 10 fixes aplicados (clamp tipográfico, áreas de toque ≥44px, parallax respeitando `prefers-reduced-motion`, contraste terracotta)
- [x] Foto real do casal — `public/images/noivos-principal.jpeg`, `noivos.jpeg`, `pedido de casamento.jpeg`

### Pendências futuras (fora desta entrega)
- [ ] Notificação por e-mail ao casal a cada novo RSVP (Resend / SendGrid)
- [ ] Domínio próprio `.com.br` (questionário item 10 — depende dos noivos comprarem)
- [ ] Foto real dos padrinhos quando o casal entregar (hoje usa iniciais como fallback)
