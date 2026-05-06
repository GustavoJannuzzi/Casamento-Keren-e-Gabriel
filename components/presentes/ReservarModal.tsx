'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface ReservarModalProps {
  isOpen: boolean
  onClose: () => void
  presenteId: string
  presenteNome: string
  onSuccess: (nome: string, mensagem: string) => void
}

export default function ReservarModal({
  isOpen, onClose, presenteId, presenteNome, onSuccess
}: ReservarModalProps) {
  const [nome, setNome] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) { setError('Por favor, informe seu nome.'); return }

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/presentes/${presenteId}/reservar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compradorNome: nome, compradorMensagem: mensagem }),
      })
      if (!res.ok) throw new Error()
      onSuccess(nome, mensagem)
      setNome('')
      setMensagem('')
    } catch {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Presente" size="md">
      <div className="space-y-5">
        <div className="border-l-2 border-terracotta pl-4 py-1">
          <p className="font-body text-xs text-warm-gray">
            Você está confirmando o presente:
          </p>
          <p className="font-heading text-lg text-ink font-light">{presenteNome}</p>
          <p className="font-body text-xs text-warm-muted mt-1">
            Já realizou o pagamento? Confirme aqui para registrar o presente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
              Seu nome *
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Como você quer ser identificado"
              className="input-elegant"
              maxLength={80}
            />
          </div>

          <div>
            <label className="font-body text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
              Mensagem para os noivos (opcional)
            </label>
            <textarea
              value={mensagem}
              onChange={e => setMensagem(e.target.value)}
              placeholder="Deixe um recado carinhoso..."
              className="input-elegant resize-none"
              rows={3}
              maxLength={300}
            />
          </div>

          {error && (
            <p className="font-body text-xs text-terracotta-dark">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              Confirmar
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
