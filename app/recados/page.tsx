import { getSupabaseAnonClient } from '@/lib/supabase/server'
import RecadoForm from '@/components/recados/RecadoForm'
import RecadosClient from './RecadosClient'
import PageHeader from '@/components/ui/PageHeader'
import type { Recado } from '@/types'

export const metadata = { title: 'Recados | Casamento Keren & Gabriel' }
export const revalidate = 0

export default async function RecadosPage() {
  let recados: Recado[] = []
  try {
    const supabase = getSupabaseAnonClient()
    const { data } = await supabase
      .from('recados').select('*').eq('aprovado', true).order('created_at', { ascending: false })
    if (data) recados = data
  } catch {}

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          eyebrow="Palavras de carinho"
          title="Livro de Recados"
          subtitle="Sua mensagem é muito especial para nós. Ela aparece após aprovação."
        />

        <div className="mb-14">
          <RecadoForm />
        </div>

        <div className="border-t border-warm-line pt-10">
          <p className="page-eyebrow text-center mb-8">Mensagens</p>
          <RecadosClient initialRecados={recados} />
        </div>
      </div>
    </div>
  )
}
