'use client'

import { useEffect, useState } from 'react'
import RecadoCard from '@/components/recados/RecadoCard'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Recado } from '@/types'

export default function RecadosClient({ initialRecados }: { initialRecados: Recado[] }) {
  const [recados, setRecados] = useState<Recado[]>(initialRecados)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    const channel = supabase
      .channel('recados-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'recados', filter: 'aprovado=eq.true' },
        (payload) => {
          if (payload.new.aprovado) {
            setRecados(prev => {
              const exists = prev.find(r => r.id === payload.new.id)
              if (exists) return prev
              return [payload.new as Recado, ...prev]
            })
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  if (recados.length === 0) {
    return (
      <div className="text-center py-16 border border-warm-line">
        <p className="font-heading text-2xl text-warm-gray font-light">Nenhum recado ainda</p>
        <p className="font-body text-sm text-warm-muted mt-2">
          Seja o primeiro a deixar uma mensagem carinhosa!
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-5">
      {recados.map(recado => (
        <RecadoCard key={recado.id} recado={recado} />
      ))}
    </div>
  )
}
