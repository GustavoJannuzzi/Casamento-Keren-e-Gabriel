import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  if (token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('confirmacoes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  return NextResponse.json(data)
}
