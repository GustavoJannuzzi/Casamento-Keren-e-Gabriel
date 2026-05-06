'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ReservarModal from './ReservarModal'
import PixModal from './PixModal'
import { formatCurrency } from '@/lib/utils'
import type { Presente } from '@/types'

interface GiftCardProps {
  presente: Presente
  onReserved: (id: string, nome: string, mensagem: string) => void
}

export default function GiftCard({ presente, onReserved }: GiftCardProps) {
  const [showReservar, setShowReservar] = useState(false)
  const [showPix, setShowPix] = useState(false)
  const [loadingMP, setLoadingMP] = useState(false)

  const isEspecial  = presente.categoria === 'especial'
  const isDisponivel = presente.status === 'disponivel'

  async function handlePresentear() {
    if (isEspecial) { setShowPix(true); return }
    setLoadingMP(true)
    try {
      const res = await fetch('/api/mp/criar-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presenteId: presente.id, nome: 'Convidado', email: 'convidado@casamento.com' }),
      })
      const data = await res.json()
      if (data.init_point) {
        window.open(data.init_point, '_blank')
        setTimeout(() => setShowReservar(true), 1500)
      }
    } catch {}
    finally { setLoadingMP(false) }
  }

  return (
    <>
      <div className="group flex flex-col h-full border border-warm-line hover:border-warm-gray transition-colors duration-300 bg-white">
        {/* Ícone / imagem */}
        <div className="h-40 bg-cream-dark flex items-center justify-center border-b border-warm-line relative">
          <span className="text-5xl opacity-30 select-none">{isEspecial ? '✈' : '○'}</span>
          <div className="absolute top-3 right-3">
            <Badge status={presente.status} />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col flex-1 p-6">
          {presente.categoria && (
            <p className="font-body text-[10px] tracking-editorial uppercase text-terracotta mb-2">
              {presente.categoria.replace('-', ' ')}
            </p>
          )}
          <h3 className="font-heading text-xl text-ink font-light leading-tight mb-2">
            {presente.nome}
          </h3>
          {presente.descricao && (
            <p className="font-body text-xs text-warm-gray leading-relaxed mb-4 flex-1">
              {presente.descricao}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-warm-line/60">
            <p className="font-heading text-2xl text-ink font-light mb-4">
              {formatCurrency(presente.preco)}
            </p>

            {isDisponivel ? (
              <Button onClick={handlePresentear} loading={loadingMP} className="w-full" size="sm">
                {isEspecial ? 'Contribuir' : 'Presentear'}
              </Button>
            ) : (
              <div className="space-y-1">
                {presente.comprador_nome && (
                  <p className="font-body text-xs text-warm-gray">
                    Presenteado por <span className="text-ink font-medium">{presente.comprador_nome}</span>
                  </p>
                )}
                {presente.comprador_mensagem && (
                  <p className="font-body text-xs text-warm-muted italic">
                    &ldquo;{presente.comprador_mensagem}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ReservarModal
        isOpen={showReservar}
        onClose={() => setShowReservar(false)}
        presenteId={presente.id}
        presenteNome={presente.nome}
        onSuccess={(nome, mensagem) => { setShowReservar(false); onReserved(presente.id, nome, mensagem) }}
      />
      <PixModal isOpen={showPix} onClose={() => setShowPix(false)} />
    </>
  )
}
