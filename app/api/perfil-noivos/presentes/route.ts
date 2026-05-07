import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { isNoivosAuthorized } from '@/lib/auth'
import type { Presente, Contribuicao, PresenteComProgresso } from '@/types'

export async function GET() {
  if (!(await isNoivosAuthorized())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json([])

  try {
    const [{ data: presentes }, { data: contribuicoes }] = await Promise.all([
      supabase.from('presentes').select('*').order('created_at'),
      // service role: vê TODAS as contribuições (incluindo pendentes/canceladas)
      supabase.from('contribuicoes').select('*').order('created_at', { ascending: false }),
    ])

    if (!presentes) return NextResponse.json([])

    const map = new Map<string, Contribuicao[]>()
    for (const c of (contribuicoes || []) as Contribuicao[]) {
      const arr = map.get(c.presente_id) || []
      arr.push(c)
      map.set(c.presente_id, arr)
    }

    const result: PresenteComProgresso[] = (presentes as Presente[]).map(p => {
      const cs = map.get(p.id) || []
      const aprovadas = cs.filter(c => c.status === 'aprovado')
      const arrecadado = aprovadas.reduce((a, c) => a + Number(c.valor), 0)
      const percentual = p.preco ? Math.min(100, Math.round((arrecadado / Number(p.preco)) * 100)) : 0
      return {
        ...p,
        valor_arrecadado: arrecadado,
        percentual,
        contribuicoes: cs,
      }
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/perfil-noivos/presentes]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
