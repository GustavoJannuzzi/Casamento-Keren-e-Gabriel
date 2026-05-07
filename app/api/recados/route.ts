import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

const schema = z.object({
  nome: z.string().min(2).max(80),
  mensagem: z.string().min(3).max(600),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const supabase = getSupabaseServiceClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })

    const { error } = await supabase.from('recados').insert({
      nome: data.nome,
      mensagem: data.mensagem,
      aprovado: false,
    })

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
