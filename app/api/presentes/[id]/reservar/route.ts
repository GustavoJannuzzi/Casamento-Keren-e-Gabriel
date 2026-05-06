import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

const schema = z.object({
  compradorNome: z.string().min(2).max(80),
  compradorMensagem: z.string().max(300).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { compradorNome, compradorMensagem } = schema.parse(body)

    const supabase = getSupabaseServiceClient()

    const { data: presente } = await supabase
      .from('presentes')
      .select('status')
      .eq('id', id)
      .single()

    if (!presente || presente.status === 'comprado') {
      return NextResponse.json({ error: 'Presente já reservado ou não encontrado' }, { status: 409 })
    }

    const { error } = await supabase
      .from('presentes')
      .update({
        status: 'reservado',
        comprador_nome: compradorNome,
        comprador_mensagem: compradorMensagem || null,
      })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
