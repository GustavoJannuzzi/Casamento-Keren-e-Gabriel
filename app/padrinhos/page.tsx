import { getSupabaseAnonClient } from '@/lib/supabase/server'
import type { Padrinho } from '@/types'
import Image from 'next/image'
import PageHeader from '@/components/ui/PageHeader'

export const metadata = { title: 'Padrinhos | Casamento Keren & Gabriel' }
export const revalidate = 3600

const PADRINHOS_FALLBACK: Padrinho[] = [
  { id: '1', nome: 'Pedro Alves',     titulo: 'Padrinho de Honra', foto_url: null, ordem: 1 },
  { id: '2', nome: 'Lucas Ferreira',  titulo: 'Padrinho',          foto_url: null, ordem: 2 },
  { id: '3', nome: 'Rafael Costa',    titulo: 'Padrinho',          foto_url: null, ordem: 3 },
  { id: '4', nome: 'Ana Paula',       titulo: 'Madrinha de Honra', foto_url: null, ordem: 4 },
  { id: '5', nome: 'Camila Oliveira', titulo: 'Madrinha',          foto_url: null, ordem: 5 },
  { id: '6', nome: 'Juliana Santos',  titulo: 'Madrinha',          foto_url: null, ordem: 6 },
]

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function PadrinhoCard({ p }: { p: Padrinho }) {
  return (
    <div className="group text-center">
      <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-4 overflow-hidden bg-cream-dark border border-warm-line group-hover:border-warm-gray transition-colors duration-300">
        {p.foto_url ? (
          <Image src={p.foto_url} alt={p.nome} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-heading text-2xl text-warm-gray font-light">{initials(p.nome)}</span>
          </div>
        )}
      </div>
      <p className="font-body text-[10px] tracking-editorial uppercase text-terracotta mb-1">{p.titulo}</p>
      <h3 className="font-heading text-xl text-ink font-light">{p.nome}</h3>
    </div>
  )
}

export default async function PadrinhosPage() {
  let padrinhos = PADRINHOS_FALLBACK
  try {
    const supabase = getSupabaseAnonClient()
    const { data } = await supabase.from('padrinhos').select('*').order('ordem')
    if (data && data.length > 0) padrinhos = data
  } catch {}

  const homens   = padrinhos.filter(p => p.titulo.toLowerCase().includes('padrinho'))
  const mulheres = padrinhos.filter(p => p.titulo.toLowerCase().includes('madrinha'))

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          eyebrow="Nossa família de coração"
          title="Padrinhos & Madrinhas"
          subtitle="Pessoas que escolhemos ter ao nosso lado neste momento tão especial."
        />

        <div className="mb-16">
          <p className="font-body text-xs tracking-editorial uppercase text-warm-gray text-center mb-10">
            Padrinhos
          </p>
          <div className="grid grid-cols-3 gap-8 md:gap-12">
            {homens.map(p => <PadrinhoCard key={p.id} p={p} />)}
          </div>
        </div>

        <div className="w-full h-px bg-warm-line mb-16" />

        <div>
          <p className="font-body text-xs tracking-editorial uppercase text-warm-gray text-center mb-10">
            Madrinhas
          </p>
          <div className="grid grid-cols-3 gap-8 md:gap-12">
            {mulheres.map(p => <PadrinhoCard key={p.id} p={p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
