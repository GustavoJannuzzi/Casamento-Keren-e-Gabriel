import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { criarPreferenciaContribuicao } from '@/lib/mercadopago'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

const schema = z.object({
  presenteId: z.string().uuid(),
  nome: z.string().min(2).max(100),
  email: z.string().email(),
  valor: z.number().min(20).max(50000),
  mensagem: z.string().max(300).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { presenteId, nome, email, valor, mensagem } = schema.parse(body)

    const supabase = getSupabaseServiceClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })

    // Busca o presente
    const { data: presente, error: errPres } = await supabase
      .from('presentes')
      .select('id, nome, preco, status')
      .eq('id', presenteId)
      .single()

    if (errPres || !presente) {
      return NextResponse.json({ error: 'Presente não encontrado' }, { status: 404 })
    }

    if (presente.status === 'comprado') {
      return NextResponse.json({ error: 'Este presente já foi totalmente arrecadado' }, { status: 409 })
    }

    // Calcula quanto resta (se tem preço definido)
    if (presente.preco) {
      const { data: aprovadas } = await supabase
        .from('contribuicoes')
        .select('valor')
        .eq('presente_id', presenteId)
        .eq('status', 'aprovado')

      const arrecadado = (aprovadas || []).reduce((acc, c) => acc + Number(c.valor), 0)
      const restante = Number(presente.preco) - arrecadado

      if (valor > restante + 0.01) {
        return NextResponse.json({
          error: `O valor máximo para este presente é R$ ${restante.toFixed(2).replace('.', ',')}`,
        }, { status: 400 })
      }
    }

    // Cria a contribuição (status pendente)
    const { data: contribuicao, error: errContrib } = await supabase
      .from('contribuicoes')
      .insert({
        presente_id: presenteId,
        contribuidor_nome: nome,
        contribuidor_email: email,
        valor,
        mensagem: mensagem || null,
        status: 'pendente',
      })
      .select('id')
      .single()

    if (errContrib || !contribuicao) {
      console.error('[criar-preferencia] insert contribuicao', errContrib)
      return NextResponse.json({ error: 'Erro ao registrar contribuição' }, { status: 500 })
    }

    // Cria preferência no Mercado Pago
    const preference = await criarPreferenciaContribuicao({
      presente: { id: presente.id, nome: presente.nome },
      valor,
      contribuidor: { nome, email },
      contribuicaoId: contribuicao.id,
    })

    // Atualiza com o preference_id
    await supabase
      .from('contribuicoes')
      .update({ mp_preference_id: preference.id })
      .eq('id', contribuicao.id)

    return NextResponse.json({
      init_point: preference.init_point,
      preference_id: preference.id,
      contribuicao_id: contribuicao.id,
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: err.errors }, { status: 400 })
    }
    console.error('[MP criar-preferencia]', err)
    return NextResponse.json({ error: 'Erro ao criar preferência' }, { status: 500 })
  }
}
