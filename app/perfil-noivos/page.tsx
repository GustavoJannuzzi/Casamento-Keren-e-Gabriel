'use client'

import { useEffect, useState, useCallback } from 'react'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import type { Recado, Confirmacao, PresenteComProgresso } from '@/types'

type Tab = 'resumo' | 'recados' | 'confirmacoes' | 'presentes' | 'exportar'

// ─── Login ───────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/perfil-noivos/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) throw new Error()
      onLogin()
    } catch {
      setError('Senha incorreta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-cream">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="page-eyebrow mb-3">Acesso restrito</p>
          <h1 className="font-heading text-3xl text-ink font-light">Painel dos Noivos</h1>
          <div className="w-12 h-px bg-terracotta mx-auto mt-4" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 border border-warm-line bg-white p-8">
          <div>
            <label className="font-body text-[11px] sm:text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite a senha de acesso"
              className="input-elegant"
              autoFocus
            />
          </div>
          {error && <p className="font-body text-xs text-terracotta-dark">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">Entrar</Button>
        </form>
      </div>
    </div>
  )
}

// ─── Recados ───────────────────────────────────────────────
function RecadosTab() {
  const [recados, setRecados] = useState<Recado[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecados = useCallback(async () => {
    const res = await fetch('/api/perfil-noivos/recados')
    if (res.ok) setRecados(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchRecados() }, [fetchRecados])

  async function toggleAprovado(id: string, aprovado: boolean) {
    await fetch('/api/perfil-noivos/recados', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, aprovado }),
    })
    setRecados(prev => prev.map(r => r.id === id ? { ...r, aprovado } : r))
  }

  if (loading) return <p className="text-center py-10 font-body text-sm text-warm-gray">Carregando...</p>

  const pendentes = recados.filter(r => !r.aprovado)
  const aprovados = recados.filter(r => r.aprovado)

  return (
    <div className="space-y-12">
      <section>
        <p className="page-eyebrow mb-4">Pendentes — {pendentes.length}</p>
        {pendentes.length === 0 ? (
          <p className="font-body text-sm text-warm-gray italic">Nenhum recado aguardando aprovação.</p>
        ) : (
          <div className="space-y-3">
            {pendentes.map(r => (
              <div key={r.id} className="border border-warm-line bg-white p-5 border-l-2 border-l-terracotta">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-lg text-ink font-light">{r.nome}</p>
                    <p className="font-body text-sm text-warm-gray mt-1.5 italic">&ldquo;{r.mensagem}&rdquo;</p>
                    <p className="font-body text-[11px] tracking-editorial uppercase text-warm-muted mt-3">
                      {new Date(r.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" onClick={() => toggleAprovado(r.id, true)}>Aprovar</Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleAprovado(r.id, false)}>Ignorar</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <p className="page-eyebrow mb-4">Aprovados — {aprovados.length}</p>
        {aprovados.length === 0 ? (
          <p className="font-body text-sm text-warm-gray italic">Nenhum recado aprovado ainda.</p>
        ) : (
          <div className="space-y-2">
            {aprovados.map(r => (
              <div key={r.id} className="border border-warm-line bg-white px-5 py-4 flex justify-between items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <span className="font-body text-sm text-ink font-medium">{r.nome}</span>
                  <span className="font-body text-xs text-warm-gray ml-3 italic">&ldquo;{r.mensagem.slice(0, 80)}{r.mensagem.length > 80 ? '…' : ''}&rdquo;</span>
                </div>
                <button
                  onClick={() => toggleAprovado(r.id, false)}
                  className="font-body text-[11px] tracking-editorial uppercase text-terracotta-dark hover:text-ink flex-shrink-0"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// ─── Confirmações ─────────────────────────────────────────
function ConfirmacoesTab() {
  const [confirmacoes, setConfirmacoes] = useState<Confirmacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/perfil-noivos/confirmacoes')
      .then(r => r.json())
      .then(data => { setConfirmacoes(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  if (loading) return <p className="text-center py-10 font-body text-sm text-warm-gray">Carregando...</p>

  const confirmados = confirmacoes.filter(c => c.confirmado)
  const naoConfirmados = confirmacoes.filter(c => !c.confirmado)
  const totalPessoas = confirmados.reduce((acc, c) => acc + 1 + c.acompanhantes, 0)

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-12">
        {[
          { label: 'Confirmados', value: confirmados.length },
          { label: 'Total pessoas', value: totalPessoas },
          { label: 'Não vão', value: naoConfirmados.length },
        ].map(stat => (
          <div key={stat.label} className="border border-warm-line bg-white p-5 sm:p-6 text-center">
            <p className="font-heading text-3xl sm:text-4xl text-ink font-light tabular-nums">{stat.value}</p>
            <p className="font-body text-[10px] sm:text-[11px] tracking-editorial uppercase text-warm-gray mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="border border-warm-line bg-white overflow-x-auto">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="border-b border-warm-line text-left bg-cream-dark/40">
              {['Nome', 'Email', 'Telefone', 'Acomp.', 'Restrição', 'Data'].map(h => (
                <th key={h} className="px-4 py-3 text-[10px] tracking-editorial uppercase text-warm-gray font-normal whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {confirmacoes.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center font-body text-xs text-warm-gray italic">Nenhuma confirmação ainda.</td></tr>
            )}
            {confirmacoes.map((c) => (
              <tr key={c.id} className={`border-t border-warm-line/60 ${!c.confirmado ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 text-ink whitespace-nowrap">{c.nome}</td>
                <td className="px-4 py-3 text-warm-gray text-xs">{c.email || '—'}</td>
                <td className="px-4 py-3 text-warm-gray text-xs whitespace-nowrap">{c.telefone || '—'}</td>
                <td className="px-4 py-3 text-ink tabular-nums">+{c.acompanhantes}</td>
                <td className="px-4 py-3 text-warm-gray text-xs">{c.restricao_alimentar || '—'}</td>
                <td className="px-4 py-3 text-warm-muted text-xs whitespace-nowrap">
                  {new Date(c.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Presentes ─────────────────────────────────────────
function PresentesTab() {
  const [presentes, setPresentes] = useState<PresenteComProgresso[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/perfil-noivos/presentes')
      .then(r => r.json())
      .then(data => { setPresentes(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  if (loading) return <p className="text-center py-10 font-body text-sm text-warm-gray">Carregando...</p>

  const totalAlvo = presentes.reduce((a, p) => a + (p.preco ? Number(p.preco) : 0), 0)
  const totalArrecadado = presentes.reduce((a, p) => a + p.valor_arrecadado, 0)
  const completos = presentes.filter(p => p.status === 'comprado' || (p.preco && p.valor_arrecadado >= Number(p.preco))).length

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mb-10">
        <div className="border border-warm-line bg-white p-5 sm:p-6">
          <p className="font-heading text-2xl sm:text-3xl text-ink font-light tabular-nums">{formatCurrency(totalArrecadado)}</p>
          <p className="font-body text-[10px] tracking-editorial uppercase text-warm-gray mt-2">Arrecadado</p>
        </div>
        <div className="border border-warm-line bg-white p-5 sm:p-6">
          <p className="font-heading text-2xl sm:text-3xl text-ink font-light tabular-nums">{formatCurrency(totalAlvo)}</p>
          <p className="font-body text-[10px] tracking-editorial uppercase text-warm-gray mt-2">Total da lista</p>
        </div>
        <div className="border border-warm-line bg-white p-5 sm:p-6 col-span-2 sm:col-span-1">
          <p className="font-heading text-2xl sm:text-3xl text-ink font-light tabular-nums">{completos} <span className="text-warm-gray text-base">/ {presentes.length}</span></p>
          <p className="font-body text-[10px] tracking-editorial uppercase text-warm-gray mt-2">Presentes completos</p>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {presentes.map(p => {
          const isOpen = expanded === p.id
          const aprovadas = p.contribuicoes.filter(c => c.status === 'aprovado')
          const pendentes = p.contribuicoes.filter(c => c.status === 'pendente')
          return (
            <div key={p.id} className="border border-warm-line bg-white">
              <button
                onClick={() => setExpanded(isOpen ? null : p.id)}
                className="w-full flex items-center gap-4 px-4 sm:px-5 py-4 text-left hover:bg-cream-dark/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-base sm:text-lg text-ink font-light truncate">{p.nome}</p>
                  <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
                    <span className="font-body text-xs text-warm-gray tabular-nums">
                      {formatCurrency(p.valor_arrecadado)} {p.preco && <span className="text-warm-muted">/ {formatCurrency(p.preco)}</span>}
                    </span>
                    {p.preco && (
                      <span className="font-body text-[10px] tracking-editorial uppercase text-terracotta-dark tabular-nums">{p.percentual}%</span>
                    )}
                    {aprovadas.length > 0 && (
                      <span className="font-body text-[10px] tracking-editorial uppercase text-warm-muted">{aprovadas.length} contrib.</span>
                    )}
                  </div>
                  {p.preco && (
                    <div className="relative h-px bg-warm-line mt-3 overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-terracotta transition-all duration-500" style={{ width: `${p.percentual}%` }} />
                    </div>
                  )}
                </div>
                <span className="font-heading text-warm-gray text-xl flex-shrink-0">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="border-t border-warm-line px-4 sm:px-5 py-4 bg-cream-dark/30">
                  {p.contribuicoes.length === 0 ? (
                    <p className="font-body text-xs text-warm-gray italic">Sem contribuições ainda.</p>
                  ) : (
                    <div className="space-y-3">
                      {aprovadas.length > 0 && (
                        <div>
                          <p className="page-eyebrow mb-2">Aprovadas</p>
                          <ul className="space-y-2">
                            {aprovadas.map(c => (
                              <li key={c.id} className="flex justify-between items-start gap-3 text-sm">
                                <div className="min-w-0 flex-1">
                                  <p className="text-ink truncate">{c.contribuidor_nome}</p>
                                  {c.mensagem && <p className="font-body text-xs text-warm-gray italic mt-0.5">&ldquo;{c.mensagem}&rdquo;</p>}
                                  <p className="font-body text-[10px] tracking-editorial uppercase text-warm-muted mt-1">
                                    {new Date(c.created_at).toLocaleDateString('pt-BR')}
                                    {c.contribuidor_email && ` · ${c.contribuidor_email}`}
                                  </p>
                                </div>
                                <span className="font-body text-sm text-ink tabular-nums whitespace-nowrap">{formatCurrency(c.valor)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {pendentes.length > 0 && (
                        <div>
                          <p className="page-eyebrow mb-2">Pendentes ({pendentes.length})</p>
                          <ul className="space-y-1">
                            {pendentes.map(c => (
                              <li key={c.id} className="font-body text-xs text-warm-gray flex justify-between gap-3">
                                <span>{c.contribuidor_nome}</span>
                                <span className="tabular-nums">{formatCurrency(c.valor)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Exportar ─────────────────────────────────────────
function ExportarTab() {
  const items = [
    { tipo: 'confirmacoes', label: 'Confirmações de presença', desc: 'Lista completa de RSVPs (sim/não), acompanhantes e mensagens.' },
    { tipo: 'recados', label: 'Recados', desc: 'Todos os recados (pendentes e aprovados).' },
    { tipo: 'presentes', label: 'Presentes', desc: 'Lista da loja com valor arrecadado, restante e percentual de cada item.' },
    { tipo: 'contribuicoes', label: 'Contribuições', desc: 'Lista de quem contribuiu, valor, presente e status do pagamento.' },
  ]

  return (
    <div className="space-y-3">
      <p className="font-body text-sm text-warm-gray mb-6 max-w-xl">
        Os arquivos abrem direto no Excel ou Google Sheets, com acentuação correta. Separador é ponto-e-vírgula (padrão Excel BR).
      </p>
      {items.map(item => (
        <div key={item.tipo} className="border border-warm-line bg-white p-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="font-heading text-lg text-ink font-light">{item.label}</p>
            <p className="font-body text-xs text-warm-gray mt-1">{item.desc}</p>
          </div>
          <a
            href={`/api/perfil-noivos/export/${item.tipo}`}
            download
            className="btn-outline text-[10px] py-2.5 px-5 min-h-[44px]"
          >
            Baixar CSV
          </a>
        </div>
      ))}
    </div>
  )
}

// ─── Resumo ─────────────────────────────────────────
function ResumoTab() {
  const [stats, setStats] = useState({ confirmados: 0, naoVao: 0, totalPessoas: 0, recadosPendentes: 0, recadosAprovados: 0, totalArrecadado: 0, totalAlvo: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/perfil-noivos/confirmacoes').then(r => r.ok ? r.json() : []),
      fetch('/api/perfil-noivos/recados').then(r => r.ok ? r.json() : []),
      fetch('/api/perfil-noivos/presentes').then(r => r.ok ? r.json() : []),
    ]).then(([confs, recs, pres]) => {
      const cs: Confirmacao[] = Array.isArray(confs) ? confs : []
      const rs: Recado[] = Array.isArray(recs) ? recs : []
      const ps: PresenteComProgresso[] = Array.isArray(pres) ? pres : []
      const confirmados = cs.filter(c => c.confirmado)
      setStats({
        confirmados: confirmados.length,
        naoVao: cs.filter(c => !c.confirmado).length,
        totalPessoas: confirmados.reduce((a, c) => a + 1 + c.acompanhantes, 0),
        recadosPendentes: rs.filter(r => !r.aprovado).length,
        recadosAprovados: rs.filter(r => r.aprovado).length,
        totalArrecadado: ps.reduce((a, p) => a + p.valor_arrecadado, 0),
        totalAlvo: ps.reduce((a, p) => a + (p.preco ? Number(p.preco) : 0), 0),
      })
      setLoading(false)
    })
  }, [])

  if (loading) return <p className="text-center py-10 font-body text-sm text-warm-gray">Carregando...</p>

  const items = [
    { label: 'Convidados confirmados', value: stats.confirmados },
    { label: 'Total de pessoas', value: stats.totalPessoas },
    { label: 'Não vão comparecer', value: stats.naoVao },
    { label: 'Recados pendentes', value: stats.recadosPendentes },
    { label: 'Recados aprovados', value: stats.recadosAprovados },
    { label: 'Arrecadado em presentes', value: formatCurrency(stats.totalArrecadado) },
  ]

  const presentesProgresso = stats.totalAlvo > 0 ? Math.round((stats.totalArrecadado / stats.totalAlvo) * 100) : 0

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {items.map(item => (
          <div key={item.label} className="border border-warm-line bg-white p-6">
            <p className="font-heading text-3xl sm:text-4xl text-ink font-light tabular-nums leading-none">{item.value}</p>
            <p className="font-body text-[10px] tracking-editorial uppercase text-warm-gray mt-3">{item.label}</p>
          </div>
        ))}
      </div>

      {stats.totalAlvo > 0 && (
        <div className="border border-warm-line bg-white p-6">
          <div className="flex justify-between items-baseline mb-3 flex-wrap gap-3">
            <p className="font-body text-sm text-warm-gray">Lista de presentes</p>
            <span className="font-heading text-2xl text-ink font-light tabular-nums">{presentesProgresso}<span className="text-base text-warm-gray">%</span></span>
          </div>
          <div className="relative h-1 bg-warm-line overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-terracotta transition-all duration-700" style={{ width: `${presentesProgresso}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Página ──────────────────────────────────────────
export default function NoivosPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [tab, setTab] = useState<Tab>('resumo')

  async function handleLogout() {
    await fetch('/api/perfil-noivos/auth', { method: 'DELETE' })
    setAuthenticated(false)
  }

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'resumo', label: 'Resumo' },
    { id: 'confirmacoes', label: 'Confirmações' },
    { id: 'presentes', label: 'Presentes' },
    { id: 'recados', label: 'Recados' },
    { id: 'exportar', label: 'Exportar' },
  ]

  return (
    <div className="min-h-screen pt-12 pb-20 px-5 sm:px-8 bg-cream">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12 gap-4 flex-wrap">
          <div>
            <p className="page-eyebrow mb-2">Casamento Keren & Gabriel</p>
            <h1 className="font-heading text-3xl sm:text-4xl text-ink font-light">Painel dos Noivos</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} size="sm">Sair</Button>
        </header>

        <div className="flex gap-1 mb-10 border-b border-warm-line overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`font-body text-[11px] tracking-editorial uppercase px-4 sm:px-6 py-3 -mb-px border-b-2 whitespace-nowrap transition-colors ${
                tab === t.id ? 'border-terracotta text-ink' : 'border-transparent text-warm-gray hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'resumo' && <ResumoTab />}
        {tab === 'confirmacoes' && <ConfirmacoesTab />}
        {tab === 'presentes' && <PresentesTab />}
        {tab === 'recados' && <RecadosTab />}
        {tab === 'exportar' && <ExportarTab />}
      </div>
    </div>
  )
}
