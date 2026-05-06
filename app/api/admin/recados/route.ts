import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

function checkAuth() {
  // This will be called in the route, we need to handle it properly
  return true
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  if (token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id, aprovado } = await req.json()
  if (!id || typeof aprovado !== 'boolean') {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()
  const { error } = await supabase
    .from('recados')
    .update({ aprovado })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  if (token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('recados')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  return NextResponse.json(data)
}
