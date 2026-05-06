'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface PixModalProps {
  isOpen: boolean
  onClose: () => void
}

const PIX_KEY = process.env.NEXT_PUBLIC_PIX_KEY || 'casamento@keren-gabriel.com.br'

export default function PixModal({ isOpen, onClose }: PixModalProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(PIX_KEY)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // fallback
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lua de Mel" size="md">
      <div className="space-y-6">
        <p className="font-body text-sm text-warm-gray leading-relaxed">
          Sua contribuição é um presente incrível e nos ajuda a realizar a viagem dos nossos sonhos.
          Qualquer valor é recebido com muito amor e gratidão.
        </p>

        {/* QR Code placeholder */}
        <div className="border border-warm-line p-8 flex flex-col items-center gap-3 bg-cream">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 49 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-ink"
                style={{ opacity: [0,1,2,3,4,5,6,7,8,14,15,21,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48].includes(i) ? 1 : 0.08 }}
              />
            ))}
          </div>
          <p className="font-body text-[10px] tracking-editorial uppercase text-warm-muted">
            QR Code PIX — configure em .env
          </p>
        </div>

        {/* PIX Key copy */}
        <div>
          <p className="font-body text-[10px] tracking-editorial uppercase text-warm-gray mb-2">
            Chave PIX
          </p>
          <div className="flex gap-2">
            <div className="flex-1 border border-warm-line px-4 py-3 font-body text-sm text-ink bg-cream overflow-hidden truncate">
              {PIX_KEY}
            </div>
            <Button
              onClick={handleCopy}
              variant={copied ? 'ghost' : 'outline'}
              size="sm"
              className="flex-shrink-0"
            >
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
          </div>
        </div>

        <div className="border-t border-warm-line pt-4">
          <p className="font-body text-[10px] tracking-editorial uppercase text-warm-gray text-center mb-3">
            Prefere Mercado Pago?
          </p>
          <Button
            onClick={() => window.open('https://www.mercadopago.com.br', '_blank')}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Pagar pelo Mercado Pago
          </Button>
        </div>
      </div>
    </Modal>
  )
}
