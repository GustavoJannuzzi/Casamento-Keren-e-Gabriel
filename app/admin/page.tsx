'use client'

import { useEffect, useState, useCallback } from 'react'
import Button from '@/components/ui/Button'
import type { Recado, Confirmacao } from '@/types'

type Tab = 'recados' | 'confirmacoes'

// ─── Auth Screen ───────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-hero-gradient">
      <div className="card-elegant p-10 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h1 className="font-heading text-3xl text-gray-700 mb-1">Área Admin</h1>
        <div className="gold-divider mb-6" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Senha de acesso"
            className="input-elegant"
          />
          {error && <p className="font-body text-xs text-red-400">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}

// ─── Recados Tab ───────────────────────────────────────────────
function RecadosTab() {
  const [recados, setRecados] = useState<Recado[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRecados = useCallback(async () => {
    const res = await fetch('/api/admin/recados')
    if (res.ok) setRecados(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchRecados() }, [fetchRecados])

  async function toggleAprovado(id: string, aprovado: boolean) {
    await fetch('/api/admin/recados', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, aprovado }),
    })
    setRecados(prev => prev.map(r => r.id === id ? { ...r, aprovado } : r))
  }

  if (loading) return <p className="text-center py-10 font-body text-gray-400">Carregando...</p>

  const pendentes = recados.filter(r => !r.aprovado)
  const aprovados = recados.filter(r => r.aprovado)

  return (
    <div className="space-y-8">
      {/* Pendentes */}
      <div>
        <h3 className="font-heading text-xl text-gray-600 mb-4">
          Pendentes ({pendentes.length})
        </h3>
        {pendentes.length === 0 ? (
          <p className="font-body text-sm text-gray-400">Nenhum recado pendente 🎉</p>
        ) : (
          <div className="space-y-3">
            {pendentes.map(r => (
              <div key={r.id} className="card-elegant p-5 border-l-4 border-gold/40">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-heading text-lg text-gray-700">{r.nome}</p>
                    <p className="font-body text-sm text-gray-500 mt-1 italic">&ldquo;{r.mensagem}&rdquo;</p>
                    <p className="font-body text-xs text-gray-400 mt-2">
                      {new Date(r.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" onClick={() => toggleAprovado(r.id, true)}>
                      ✓ Aprovar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleAprovado(r.id, false)}>
                      ✗
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Aprovados */}
      <div>
        <h3 className="font-heading text-xl text-gray-600 mb-4">
          Aprovados ({aprovados.length})
        </h3>
        <div className="space-y-2">
          {aprovados.map(r => (
            <div key={r.id} className="card-elegant p-4 border-l-4 border-sage/40 flex justify-between items-center gap-4">
              <div>
                <span className="font-body text-sm font-medium text-gray-700">{r.nome}</span>
                <span className="font-body text-xs text-gray-400 ml-2">&ldquo;{r.mensagem.slice(0, 60)}…&rdquo;</span>
              </div>
              <button
                onClick={() => toggleAprovado(r.id, false)}
                className="font-body text-xs text-rose-dark hover:text-rose-dark/70 flex-shrink-0"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Confirmações Tab ─────────────────────────────────────────
function ConfirmacoesTab() {
  const [confirmacoes, setConfirmacoes] = useState<Confirmacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/confirmacoes')
      .then(r => r.json())
      .then(data => { setConfirmacoes(data); setLoading(false) })
  }, [])

  if (loading) return <p className="text-center py-10 font-body text-gray-400">Carregando...</p>

  const confirmados = confirmacoes.filter(c => c.confirmado)
  const naoConfirmados = confirmacoes.filter(c => !c.confirmado)
  const totalPessoas = confirmados.reduce((acc, c) => acc + 1 + c.acompanhantes, 0)

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Confirmados', value: confirmados.length, color: 'text-sage' },
          { label: 'Total de pessoas', value: totalPessoas, color: 'text-gold' },
          { label: 'Não vão', value: naoConfirmados.length, color: 'text-rose-dark' },
        ].map(stat => (
          <div key={stat.label} className="card-elegant p-5 text-center">
            <p className={`font-heading text-4xl font-light ${stat.color}`}>{stat.value}</p>
            <p className="font-body text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card-elegant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="bg-ivory-dark text-left">
                {['Nome', 'Email', 'Tel', '+', 'Restrição', 'Data'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs tracking-widest uppercase text-gray-500 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {confirmacoes.map((c, i) => (
                <tr key={c.id} className={`border-t border-rose-light/20 ${!c.confirmado ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3 text-gray-700">{c.nome}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.telefone || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">+{c.acompanhantes}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{c.restricao_alimentar || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(c.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [tab, setTab] = useState<Tab>('recados')

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setAuthenticated(false)
  }

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 bg-ivory">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-3xl text-gray-700">Painel Admin</h1>
            <p className="font-body text-xs text-gray-400">Casamento Keren & Gabriel</p>
          </div>
          <Button variant="ghost" onClick={handleLogout} size="sm">
            Sair
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-rose-light/30">
          {(['recados', 'confirmacoes'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-body text-sm px-5 py-3 border-b-2 transition-all -mb-px ${
                tab === t
                  ? 'border-gold text-gold font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'recados' ? '💌 Recados' : '✓ Confirmações'}
            </button>
          ))}
        </div>

        {tab === 'recados' && <RecadosTab />}
        {tab === 'confirmacoes' && <ConfirmacoesTab />}
      </div>
    </div>
  )
}
