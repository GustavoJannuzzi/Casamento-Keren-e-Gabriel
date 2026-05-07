import { getSupabaseAnonClient } from '@/lib/supabase/server'
import GiftGrid from '@/components/presentes/GiftGrid'
import PageHeader from '@/components/ui/PageHeader'
import type { Presente, Contribuicao, PresenteComProgresso } from '@/types'

export const metadata = { title: 'Lista de Presentes | Casamento Keren & Gabriel' }
export const revalidate = 0

const PRESENTES_FALLBACK: Presente[] = [
  { id: '11111111-1111-1111-1111-111111111111', nome: 'Jogo de Panelas Tramontina',  descricao: 'Conjunto 7 peças inox',              preco: 480,  imagem_url: null, categoria: 'cozinha',          status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '22222222-2222-2222-2222-222222222222', nome: 'Geladeira Frost Free',         descricao: '450L, 2 portas',                     preco: 2800, imagem_url: null, categoria: 'eletrodomesticos', status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '33333333-3333-3333-3333-333333333333', nome: 'Jogo de Cama King Percal',     descricao: '400 fios — lençol, fronha e capa',   preco: 620,  imagem_url: null, categoria: 'cama-banho',       status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '44444444-4444-4444-4444-444444444444', nome: 'KitchenAid Stand Mixer',       descricao: 'Batedeira planetária 4.7L',          preco: 1200, imagem_url: null, categoria: 'cozinha',          status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '55555555-5555-5555-5555-555555555555', nome: 'Smart TV 55" 4K',              descricao: 'QLED, HDR10+',                       preco: 2100, imagem_url: null, categoria: 'eletronicos',      status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '66666666-6666-6666-6666-666666666666', nome: 'Jogo de Toalhas Buddemeyer',   descricao: '6 peças premium',                    preco: 390,  imagem_url: null, categoria: 'cama-banho',       status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '77777777-7777-7777-7777-777777777777', nome: 'Aparelho de Jantar 30 peças',  descricao: 'Porcelana branca com borda dourada', preco: 540,  imagem_url: null, categoria: 'mesa',             status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '88888888-8888-8888-8888-888888888888', nome: 'Adega Climatizada',            descricao: '12 garrafas, zona dupla',            preco: 1100, imagem_url: null, categoria: 'eletronicos',      status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '99999999-9999-9999-9999-999999999999', nome: 'Lua de Mel',                   descricao: 'Contribua com qualquer valor',       preco: null, imagem_url: null, categoria: 'especial',         status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', nome: 'Robô Aspirador',               descricao: 'Mapeamento laser, Wi-Fi',            preco: 1400, imagem_url: null, categoria: 'eletrodomesticos', status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
]

function enriquecer(presentes: Presente[], contribuicoes: Contribuicao[]): PresenteComProgresso[] {
  const map = new Map<string, Contribuicao[]>()
  for (const c of contribuicoes) {
    const arr = map.get(c.presente_id) || []
    arr.push(c)
    map.set(c.presente_id, arr)
  }
  return presentes.map(p => {
    const cs = map.get(p.id) || []
    const arrecadado = cs.reduce((a, c) => a + Number(c.valor), 0)
    const percentual = p.preco ? Math.min(100, Math.round((arrecadado / Number(p.preco)) * 100)) : 0
    return {
      ...p,
      valor_arrecadado: arrecadado,
      percentual,
      contribuicoes: cs.sort((a, b) => b.created_at.localeCompare(a.created_at)),
    }
  })
}

export default async function PresentesPage() {
  let presentes: Presente[] = PRESENTES_FALLBACK
  let contribuicoes: Contribuicao[] = []

  try {
    const supabase = getSupabaseAnonClient()
    if (supabase) {
      const [{ data: pres }, { data: cont }] = await Promise.all([
        supabase.from('presentes').select('*').order('created_at'),
        supabase.from('contribuicoes').select('*').eq('status', 'aprovado'),
      ])
      if (pres && pres.length > 0) presentes = pres
      if (cont) contribuicoes = cont as Contribuicao[]
    }
  } catch {}

  const enriquecidos = enriquecer(presentes, contribuicoes)

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Com carinho e gratidão"
          title="Lista de Presentes"
          subtitle="Você pode presentear inteiro ou contribuir com o valor que quiser. Cada presente mostra quanto já foi arrecadado."
        />
        <GiftGrid initialPresentes={enriquecidos} />
      </div>
    </div>
  )
}
