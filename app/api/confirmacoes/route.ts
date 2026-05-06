import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

const schema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email().optional().or(z.literal('')),
  telefone: z.string().max(20).optional(),
  confirmado: z.boolean(),
  acompanhantes: z.number().int().min(0).max(10),
  restricao_alimentar: z.string().max(300).optional(),
  mensagem: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const supabase = getSupabaseServiceClient()
    const { error } = await supabase.from('confirmacoes').insert({
      nome: data.nome,
      email: data.email || null,
      telefone: data.telefone || null,
      confirmado: data.confirmado,
      acompanhantes: data.acompanhantes,
      restricao_alimentar: data.restricao_alimentar || null,
      mensagem: data.mensagem || null,
    })

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
