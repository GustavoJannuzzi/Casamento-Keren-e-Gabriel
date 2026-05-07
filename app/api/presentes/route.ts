import { NextResponse } from 'next/server'
import { getSupabaseAnonClient } from '@/lib/supabase/server'
import type { Presente, Contribuicao, PresenteComProgresso } from '@/types'

export async function GET() {
  const supabase = getSupabaseAnonClient()
  if (!supabase) return NextResponse.json([])

  try {
    const [{ data: presentes }, { data: contribuicoes }] = await Promise.all([
      supabase.from('presentes').select('*').order('created_at'),
      supabase.from('contribuicoes').select('*').eq('status', 'aprovado'),
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
      const arrecadado = cs.reduce((a, c) => a + Number(c.valor), 0)
      const percentual = p.preco ? Math.min(100, Math.round((arrecadado / Number(p.preco)) * 100)) : 0
      return {
        ...p,
        valor_arrecadado: arrecadado,
        percentual,
        contribuicoes: cs.sort((a, b) => b.created_at.localeCompare(a.created_at)),
      }
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/presentes]', err)
    return NextResponse.json([])
  }
}
