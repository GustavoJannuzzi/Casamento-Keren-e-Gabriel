'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import GiftDetailModal from './GiftDetailModal'
import PixModal from './PixModal'
import type { PresenteComProgresso } from '@/types'

interface GiftCardProps {
  presente: PresenteComProgresso
}

export default function GiftCard({ presente }: GiftCardProps) {
  const [showDetail, setShowDetail] = useState(false)
  const [showPix, setShowPix] = useState(false)

  const isEspecial = presente.categoria === 'especial'
  const isCompleto = presente.status === 'comprado' || (presente.preco && presente.valor_arrecadado >= Number(presente.preco))
  const restante = presente.preco ? Math.max(0, Number(presente.preco) - presente.valor_arrecadado) : 0

  function handleClick() {
    if (isEspecial && !presente.preco) { setShowPix(true); return }
    setShowDetail(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isCompleto || false}
        className="group flex flex-col h-full text-left border border-warm-line hover:border-warm-gray transition-colors duration-300 bg-white disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {/* Imagem */}
        <div className="h-40 bg-cream-dark flex items-center justify-center border-b border-warm-line relative">
          <span className="text-5xl opacity-30 select-none">{isEspecial ? '✈' : '○'}</span>

          {/* Status pill */}
          {isCompleto && (
            <div className="absolute top-3 right-3 font-body text-[9px] tracking-editorial uppercase bg-ink text-cream px-2.5 py-1">
              Completo
            </div>
          )}
          {!isCompleto && presente.percentual > 0 && (
            <div className="absolute top-3 right-3 font-body text-[9px] tracking-editorial uppercase border border-terracotta text-terracotta-dark bg-white px-2.5 py-1 tabular-nums">
              {presente.percentual}% arrecadado
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col flex-1 p-6">
          {presente.categoria && (
            <p className="font-body text-[10px] tracking-editorial uppercase text-terracotta-dark mb-2">
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
            {presente.preco ? (
              <>
                <div className="flex items-baseline justify-between mb-3">
                  <p className="font-heading text-2xl text-ink font-light">
                    {formatCurrency(presente.preco)}
                  </p>
                  {presente.valor_arrecadado > 0 && (
                    <p className="font-body text-[10px] tracking-editorial uppercase text-warm-gray">
                      {formatCurrency(presente.valor_arrecadado)} arrec.
                    </p>
                  )}
                </div>

                {/* Progress bar */}
                <div className="relative h-1 bg-warm-line mb-3 overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-terracotta transition-all duration-700"
                    style={{ width: `${presente.percentual}%` }}
                  />
                </div>

                {!isCompleto ? (
                  <p className="font-body text-[11px] text-warm-gray italic">
                    Restam {formatCurrency(restante)} · contribua com o valor que quiser
                  </p>
                ) : (
                  <p className="font-body text-[11px] text-terracotta-dark">
                    Obrigados a todos que contribuíram!
                  </p>
                )}
              </>
            ) : (
              <p className="font-heading text-2xl text-ink font-light">
                Valor livre
              </p>
            )}
          </div>
        </div>
      </button>

      <GiftDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        presente={presente}
      />
      <PixModal isOpen={showPix} onClose={() => setShowPix(false)} />
    </>
  )
}
