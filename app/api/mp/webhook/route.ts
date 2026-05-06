import { NextRequest, NextResponse } from 'next/server'
import { buscarPagamento } from '@/lib/mercadopago'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // MP envia diferentes tipos de notificação
    const topic = body.topic || body.type
    const resourceId = body.data?.id || body.id

    if (topic !== 'payment' || !resourceId) {
      return NextResponse.json({ ok: true })
    }

    const payment = await buscarPagamento(String(resourceId))

    if (payment.status !== 'approved') {
      return NextResponse.json({ ok: true })
    }

    const presenteId = payment.external_reference
    if (!presenteId) return NextResponse.json({ ok: true })

    const supabase = getSupabaseServiceClient()
    await supabase
      .from('presentes')
      .update({
        status: 'comprado',
        mp_payment_id: String(resourceId),
      })
      .eq('id', presenteId)
      .eq('status', 'disponivel') // só atualiza se ainda disponível

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[MP webhook]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// MP também faz GET para verificar o endpoint
export async function GET() {
  return NextResponse.json({ ok: true })
}
