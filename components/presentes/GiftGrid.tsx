'use client'

import { useEffect, useState } from 'react'
import GiftCard from './GiftCard'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import type { PresenteComProgresso } from '@/types'

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
  { value: 'em-aberto', label: 'Em aberto' },
  { value: 'completo', label: 'Completos' },
]

export default function GiftGrid({ initialPresentes }: { initialPresentes: PresenteComProgresso[] }) {
  const [presentes, setPresentes] = useState<PresenteComProgresso[]>(initialPresentes)
  const [categoria, setCategoria] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('')

  function isCompleto(p: PresenteComProgresso) {
    return p.status === 'comprado' || (!!p.preco && p.valor_arrecadado >= Number(p.preco))
  }

  const filtered = presentes.filter(p => {
    const matchCat = !categoria || p.categoria === categoria
    const completo = isCompleto(p)
    const matchStatus =
      !statusFiltro ||
      (statusFiltro === 'completo' && completo) ||
      (statusFiltro === 'em-aberto' && !completo)
    return matchCat && matchStatus
  })

  // Progresso global por VALOR (não mais por contagem)
  const totalAlvo = presentes.reduce((acc, p) => acc + (p.preco ? Number(p.preco) : 0), 0)
  const totalArrecadado = presentes.reduce((acc, p) => acc + p.valor_arrecadado, 0)
  const progress = totalAlvo > 0 ? Math.min(100, Math.round((totalArrecadado / totalAlvo) * 100)) : 0

  // Realtime: revalida quando há mudança
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    async function reload() {
      try {
        const res = await fetch('/api/presentes', { cache: 'no-store' })
        if (res.ok) {
          const data: PresenteComProgresso[] = await res.json()
          if (Array.isArray(data) && data.length > 0) setPresentes(data)
        }
      } catch {}
    }

    const channel = supabase
      .channel('presentes-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contribuicoes' }, reload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'presentes' }, reload)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <div>
      {/* Progresso geral */}
      <div className="border border-warm-line p-6 mb-10 bg-white">
        <div className="flex justify-between items-baseline mb-3 flex-wrap gap-3">
          <p className="font-body text-sm text-warm-gray">
            <span className="font-heading text-2xl text-ink font-light tabular-nums">{formatCurrency(totalArrecadado)}</span>
            <span className="text-warm-gray"> {' '}arrecadados de{' '}</span>
            <span className="font-heading text-ink tabular-nums">{formatCurrency(totalAlvo)}</span>
          </p>
          <span className="font-heading text-3xl text-ink font-light tabular-nums">{progress}<span className="text-lg text-warm-gray">%</span></span>
        </div>
        <div className="w-full h-px bg-warm-line relative">
          <div
            className="absolute top-0 left-0 h-px bg-terracotta transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-y-4 justify-between mb-10 gap-x-4">
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
            <GiftCard key={p.id} presente={p} />
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
