import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { criarPreferenciaPresente } from '@/lib/mercadopago'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

const schema = z.object({
  presenteId: z.string().uuid(),
  nome: z.string().min(2).max(100),
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { presenteId, nome, email } = schema.parse(body)

    // Busca o presente
    const supabase = getSupabaseServiceClient()
    const { data: presente, error } = await supabase
      .from('presentes')
      .select('id, nome, preco, status')
      .eq('id', presenteId)
      .single()

    if (error || !presente) {
      return NextResponse.json({ error: 'Presente não encontrado' }, { status: 404 })
    }

    if (presente.status !== 'disponivel') {
      return NextResponse.json({ error: 'Presente já reservado' }, { status: 409 })
    }

    if (!presente.preco) {
      return NextResponse.json({ error: 'Use o modal PIX para este presente' }, { status: 400 })
    }

    const preference = await criarPreferenciaPresente(
      { id: presente.id, nome: presente.nome, preco: presente.preco },
      { nome, email }
    )

    // Salva o preference_id no presente
    await supabase
      .from('presentes')
      .update({ mp_preference_id: preference.id })
      .eq('id', presenteId)

    return NextResponse.json({
      init_point: preference.init_point,
      preference_id: preference.id,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: err.errors }, { status: 400 })
    }
    console.error('[MP criar-preferencia]', err)
    return NextResponse.json({ error: 'Erro ao criar preferência' }, { status: 500 })
  }
}
