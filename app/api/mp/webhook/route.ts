import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { buscarPagamento } from '@/lib/mercadopago'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

/**
 * Valida assinatura HMAC do webhook do Mercado Pago.
 * Doc: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks#editor_4
 *
 * O MP envia headers `x-signature` (ts=...,v1=...) e `x-request-id`.
 * O manifesto a assinar é: id:<dataId>;request-id:<reqId>;ts:<ts>;
 */
function isSignatureValid(req: NextRequest, dataId: string | undefined): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) {
    // Sem secret configurado, aceita o webhook (modo dev). Em produção, exigir secret.
    if (process.env.NODE_ENV === 'production') return false
    return true
  }

  const signatureHeader = req.headers.get('x-signature')
  const requestId = req.headers.get('x-request-id')
  if (!signatureHeader || !requestId || !dataId) return false

  const parts = Object.fromEntries(
    signatureHeader.split(',').map(p => p.trim().split('=').map(s => s.trim()))
  )
  const ts = parts.ts
  const v1 = parts.v1
  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const expected = createHmac('sha256', secret).update(manifest).digest('hex')

  const a = Buffer.from(expected)
  const b = Buffer.from(v1)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))

    const topic = body.topic || body.type
    const resourceId = body.data?.id || body.id
    const dataId = resourceId ? String(resourceId) : undefined

    if (!isSignatureValid(req, dataId)) {
      console.warn('[MP webhook] assinatura inválida')
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    if (topic !== 'payment' || !dataId) {
      return NextResponse.json({ ok: true })
    }

    const payment = await buscarPagamento(dataId)
    if (payment.status !== 'approved') {
      return NextResponse.json({ ok: true })
    }

    const contribuicaoId = payment.external_reference
    if (!contribuicaoId) return NextResponse.json({ ok: true })

    const supabase = getSupabaseServiceClient()
    if (!supabase) return NextResponse.json({ ok: true })

    // Captura nome real do pagador (vindo do MP)
    const payerNome = [payment.payer?.first_name, payment.payer?.last_name]
      .filter(Boolean).join(' ').trim() || undefined
    const payerEmail = payment.payer?.email || undefined

    // Atualiza contribuição
    const updateData: Record<string, string> = {
      status: 'aprovado',
      mp_payment_id: dataId,
    }
    if (payerNome) updateData.contribuidor_nome = payerNome
    if (payerEmail) updateData.contribuidor_email = payerEmail

    const { data: contribuicao, error: errUpdate } = await supabase
      .from('contribuicoes')
      .update(updateData)
      .eq('id', contribuicaoId)
      .eq('status', 'pendente')
      .select('presente_id, valor')
      .single()

    if (errUpdate) {
      console.error('[MP webhook] update contribuicao', errUpdate)
      return NextResponse.json({ ok: true })
    }

    // Verifica se o presente foi totalmente arrecadado
    if (contribuicao) {
      const { data: presente } = await supabase
        .from('presentes')
        .select('preco, status')
        .eq('id', contribuicao.presente_id)
        .single()

      if (presente?.preco && presente.status !== 'comprado') {
        const { data: aprovadas } = await supabase
          .from('contribuicoes')
          .select('valor')
          .eq('presente_id', contribuicao.presente_id)
          .eq('status', 'aprovado')

        const total = (aprovadas || []).reduce((acc, c) => acc + Number(c.valor), 0)
        if (total >= Number(presente.preco)) {
          await supabase
            .from('presentes')
            .update({ status: 'comprado' })
            .eq('id', contribuicao.presente_id)
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[MP webhook]', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}
