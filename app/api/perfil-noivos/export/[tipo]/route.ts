import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { isNoivosAuthorized } from '@/lib/auth'
import { toCsv, csvResponse } from '@/lib/csv'
import type { Confirmacao, Recado, Presente, Contribuicao } from '@/types'

const TIPOS = ['confirmacoes', 'recados', 'presentes', 'contribuicoes'] as const
type Tipo = typeof TIPOS[number]

function fmtBR(d: string | null): string {
  if (!d) return ''
  return new Date(d).toLocaleString('pt-BR')
}

function fmtMoney(v: number | null | string): string {
  if (v === null || v === undefined || v === '') return ''
  const n = typeof v === 'number' ? v : Number(v)
  if (isNaN(n)) return ''
  return n.toFixed(2).replace('.', ',')
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tipo: string }> }
) {
  if (!(await isNoivosAuthorized())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { tipo: tipoParam } = await params
  if (!TIPOS.includes(tipoParam as Tipo)) {
    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  }
  const tipo = tipoParam as Tipo

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })

  if (tipo === 'confirmacoes') {
    const { data } = await supabase.from('confirmacoes').select('*').order('created_at', { ascending: false })
    const rows = (data as Confirmacao[] || []).map(c => ({
      Nome: c.nome,
      Email: c.email || '',
      Telefone: c.telefone || '',
      Confirmado: c.confirmado ? 'Sim' : 'Não',
      Acompanhantes: c.acompanhantes,
      'Restrição alimentar': c.restricao_alimentar || '',
      Mensagem: c.mensagem || '',
      'Data de envio': fmtBR(c.created_at),
    }))
    return csvResponse('confirmacoes.csv', toCsv(rows))
  }

  if (tipo === 'recados') {
    const { data } = await supabase.from('recados').select('*').order('created_at', { ascending: false })
    const rows = (data as Recado[] || []).map(r => ({
      Nome: r.nome,
      Mensagem: r.mensagem,
      Status: r.aprovado ? 'Aprovado' : 'Pendente',
      'Data de envio': fmtBR(r.created_at),
    }))
    return csvResponse('recados.csv', toCsv(rows))
  }

  if (tipo === 'presentes') {
    const [{ data: presentes }, { data: contribs }] = await Promise.all([
      supabase.from('presentes').select('*').order('created_at'),
      supabase.from('contribuicoes').select('presente_id, valor, status'),
    ])

    const sumByPresente = new Map<string, number>()
    for (const c of (contribs as Contribuicao[] || [])) {
      if (c.status !== 'aprovado') continue
      sumByPresente.set(c.presente_id, (sumByPresente.get(c.presente_id) || 0) + Number(c.valor))
    }

    const rows = (presentes as Presente[] || []).map(p => {
      const arrecadado = sumByPresente.get(p.id) || 0
      const restante = p.preco ? Math.max(0, Number(p.preco) - arrecadado) : 0
      const percentual = p.preco ? Math.min(100, Math.round((arrecadado / Number(p.preco)) * 100)) : 0
      return {
        Nome: p.nome,
        Categoria: p.categoria || '',
        Preço: fmtMoney(p.preco),
        Arrecadado: fmtMoney(arrecadado),
        Restante: fmtMoney(restante),
        'Percentual (%)': p.preco ? percentual : '',
        Status: p.status,
      }
    })
    return csvResponse('presentes.csv', toCsv(rows))
  }

  // tipo === 'contribuicoes'
  const [{ data: contribs }, { data: presentes }] = await Promise.all([
    supabase.from('contribuicoes').select('*').order('created_at', { ascending: false }),
    supabase.from('presentes').select('id, nome'),
  ])
  const presentesMap = new Map((presentes as { id: string; nome: string }[] || []).map(p => [p.id, p.nome]))
  const rows = (contribs as Contribuicao[] || []).map(c => ({
    Presente: presentesMap.get(c.presente_id) || c.presente_id,
    Contribuidor: c.contribuidor_nome,
    Email: c.contribuidor_email || '',
    Valor: fmtMoney(c.valor),
    Status: c.status,
    Mensagem: c.mensagem || '',
    Data: fmtBR(c.created_at),
  }))
  return csvResponse('contribuicoes.csv', toCsv(rows))
}
