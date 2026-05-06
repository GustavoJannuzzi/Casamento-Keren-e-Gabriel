'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function RecadoForm() {
  const [nome, setNome] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim() || !mensagem.trim()) {
      setError('Por favor, preencha nome e mensagem.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/recados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, mensagem }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      setNome('')
      setMensagem('')
    } catch {
      setError('Erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="border border-warm-line p-10 text-center bg-white">
        <p className="page-eyebrow mb-4">Recado enviado</p>
        <h3 className="font-heading text-3xl text-ink font-light mb-3">Obrigado pela mensagem!</h3>
        <div className="w-8 h-px bg-terracotta mx-auto mb-4" />
        <p className="font-body text-sm text-warm-gray mb-8 max-w-sm mx-auto">
          Seu recado está aguardando aprovação dos noivos e em breve aparecerá aqui.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSent(false)}>
          Enviar outro recado
        </Button>
      </div>
    )
  }

  return (
    <div className="border border-warm-line p-8 bg-white">
      <p className="page-eyebrow mb-3">Deixe sua mensagem</p>
      <h2 className="font-heading text-3xl text-ink font-light mb-1">Livro de Recados</h2>
      <div className="w-8 h-px bg-terracotta mb-8" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-body text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
            Seu nome *
          </label>
          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Como você se chama?"
            className="input-elegant"
            maxLength={80}
          />
        </div>

        <div>
          <label className="font-body text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
            Mensagem *
          </label>
          <textarea
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            placeholder="Escreva uma mensagem carinhosa para os noivos..."
            className="input-elegant resize-none"
            rows={4}
            maxLength={600}
          />
          <p className="font-body text-[10px] text-warm-muted text-right mt-1">
            {mensagem.length}/600
          </p>
        </div>

        {error && <p className="font-body text-xs text-terracotta-dark">{error}</p>}

        <Button type="submit" loading={loading} className="w-full">
          Enviar Recado
        </Button>
      </form>
    </div>
  )
}
