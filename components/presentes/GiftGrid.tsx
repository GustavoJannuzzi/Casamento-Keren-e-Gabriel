'use client'

import { useEffect, useState, useCallback } from 'react'
import GiftCard from './GiftCard'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Presente } from '@/types'

const CATEGORIAS = [
  { value: '', label: 'Todos' },
  { value: 'cozinha', label: 'Cozinha' },
  { value: 'eletrodomesticos', label: 'Eletrodomésticos' },
  { value: 'eletronicos', label: 'Eletrônicos' },
  { value: 'cama-banho', label: 'Cama & Banho' },
  { value: 'mesa', label: 'Mesa' },
  { value: 'especial', label: 'Especial' },
]

const STATUS_FILTROS = [
  { value: '', label: 'Todos' },
  { value: 'disponivel', label: 'Disponíveis' },
  { value: 'reservado', label: 'Reservados' },
  { value: 'comprado', label: 'Presenteados' },
]

export default function GiftGrid({ initialPresentes }: { initialPresentes: Presente[] }) {
  const [presentes, setPresentes] = useState<Presente[]>(initialPresentes)
  const [categoria, setCategoria] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('')

  const filtered = presentes.filter(p => {
    const matchCat    = !categoria    || p.categoria === categoria
    const matchStatus = !statusFiltro || p.status    === statusFiltro
    return matchCat && matchStatus
  })

  const total = presentes.length
  const escolhidos = presentes.filter(p => p.status !== 'disponivel').length
  const progress = total > 0 ? Math.round((escolhidos / total) * 100) : 0

  const handleReserved = useCallback((id: string, nome: string, mensagem: string) => {
    setPresentes(prev =>
      prev.map(p => p.id === id ? { ...p, status: 'reservado', comprador_nome: nome, comprador_mensagem: mensagem } : p)
    )
  }, [])

  // Supabase Realtime (só ativa se configurado)
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    const channel = supabase
      .channel('presentes-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'presentes' }, (payload) => {
        setPresentes(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <div>
      {/* Progress bar */}
      <div className="border border-warm-line p-6 mb-10 bg-white">
        <div className="flex justify-between items-baseline mb-3">
          <p className="font-body text-sm text-warm-gray">
            <span className="font-heading text-2xl text-ink font-light">{escolhidos}</span>
            {' '}de{' '}
            <span className="text-ink">{total}</span>
            {' '}presentes escolhidos
          </p>
          <span className="font-heading text-3xl text-ink font-light">{progress}<span className="text-lg text-warm-gray">%</span></span>
        </div>
        <div className="w-full h-px bg-warm-line relative">
          <div
            className="absolute top-0 left-0 h-px bg-terracotta transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-y-4 justify-between mb-10">
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map(cat => (
            <FilterChip key={cat.value} label={cat.label} active={categoria === cat.value} onClick={() => setCategoria(cat.value)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTROS.map(s => (
            <FilterChip key={s.value} label={s.label} active={statusFiltro === s.value} onClick={() => setStatusFiltro(s.value)} />
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-warm-line">
          <p className="font-heading text-2xl text-warm-gray font-light">Nenhum presente encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-warm-line">
          {filtered.map(p => (
            <GiftCard key={p.id} presente={p} onReserved={handleReserved} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`font-body text-[10px] tracking-editorial uppercase px-4 py-2 border transition-colors duration-200 ${
        active
          ? 'bg-ink text-cream border-ink'
          : 'border-warm-line text-warm-gray hover:border-warm-gray hover:text-ink'
      }`}
    >
      {label}
    </button>
  )
}
