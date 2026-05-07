import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { isNoivosAuthorized } from '@/lib/auth'

export async function GET() {
  if (!(await isNoivosAuthorized())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = getSupabaseServiceClient()
  if (!supabase) return NextResponse.json([])

  const { data, error } = await supabase
    .from('confirmacoes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  return NextResponse.json(data)
}
