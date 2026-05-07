import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { isNoivosAuthorized } from '@/lib/auth'

export async function GET() {
  if (!(await isNoivosAuthorized())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json([])

  const { data, error } = await supabase
    .from('recados')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!(await isNoivosAuthorized())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id, aprovado } = await req.json()
  if (!id || typeof aprovado !== 'boolean') {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })

  const { error } = await supabase.from('recados').update({ aprovado }).eq('id', id)

  if (error) return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
