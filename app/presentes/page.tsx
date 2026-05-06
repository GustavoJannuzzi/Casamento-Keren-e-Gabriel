import { getSupabaseAnonClient } from '@/lib/supabase/server'
import GiftGrid from '@/components/presentes/GiftGrid'
import PageHeader from '@/components/ui/PageHeader'
import type { Presente } from '@/types'

export const metadata = { title: 'Lista de Presentes | Casamento Keren & Gabriel' }
export const revalidate = 0

const PRESENTES_FALLBACK: Presente[] = [
  { id: '1',  nome: 'Jogo de Panelas Tramontina',      descricao: 'Conjunto 7 peças inox',              preco: 480,  imagem_url: null, categoria: 'cozinha',          status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '2',  nome: 'Geladeira Frost Free',             descricao: '450L, 2 portas',                     preco: 2800, imagem_url: null, categoria: 'eletrodomesticos', status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '3',  nome: 'Jogo de Cama King Percal 400 fios',descricao: 'Inclui lençol, fronha e capa',       preco: 620,  imagem_url: null, categoria: 'cama-banho',       status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '4',  nome: 'KitchenAid Stand Mixer',           descricao: 'Batedeira planetária 4.7L',          preco: 1200, imagem_url: null, categoria: 'cozinha',          status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '5',  nome: 'Smart TV 55" 4K',                  descricao: 'QLED, HDR10+',                       preco: 2100, imagem_url: null, categoria: 'eletronicos',      status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '6',  nome: 'Jogo de Toalhas Buddemeyer',       descricao: '6 peças premium',                    preco: 390,  imagem_url: null, categoria: 'cama-banho',       status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '7',  nome: 'Aparelho de Jantar 30 peças',      descricao: 'Porcelana branca com borda dourada', preco: 540,  imagem_url: null, categoria: 'mesa',             status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '8',  nome: 'Adega Climatizada',                descricao: '12 garrafas, zona dupla',            preco: 1100, imagem_url: null, categoria: 'eletronicos',      status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '9',  nome: 'Lua de Mel ✈️',                   descricao: 'Contribua com qualquer valor',       preco: null, imagem_url: null, categoria: 'especial',         status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
  { id: '10', nome: 'Robô Aspirador',                   descricao: 'Mapeamento laser, Wi-Fi',            preco: 1400, imagem_url: null, categoria: 'eletrodomesticos', status: 'disponivel', comprador_nome: null, comprador_mensagem: null, mp_preference_id: null, mp_payment_id: null, created_at: '' },
]

export default async function PresentesPage() {
  let presentes: Presente[] = PRESENTES_FALLBACK
  try {
    const supabase = getSupabaseAnonClient()
    const { data } = await supabase.from('presentes').select('*').order('created_at')
    if (data && data.length > 0) presentes = data
  } catch {}

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Com carinho e gratidão"
          title="Lista de Presentes"
          subtitle="Cada presente representa um pedacinho do nosso novo lar. Obrigados de coração!"
        />
        <GiftGrid initialPresentes={presentes} />
      </div>
    </div>
  )
}
