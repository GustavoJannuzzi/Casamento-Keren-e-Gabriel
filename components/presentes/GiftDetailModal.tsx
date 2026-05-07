'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import type { PresenteComProgresso } from '@/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  presente: PresenteComProgresso
}

interface FormData {
  nome: string
  email: string
  valor: number
  mensagem?: string
}

export default function GiftDetailModal({ isOpen, onClose, presente }: Props) {
  const restante = presente.preco ? Math.max(0, Number(presente.preco) - presente.valor_arrecadado) : 0
  const [mode, setMode] = useState<'view' | 'contribuir' | 'inteiro'>('view')
  const [serverError, setServerError] = useState('')

  const schema = z.object({
    nome: z.string().min(2, 'Nome muito curto').max(100),
    email: z.string().email('E-mail inválido'),
    valor: z.coerce.number()
      .min(20, 'Valor mínimo R$ 20')
      .max(restante > 0 ? restante : 50000, restante > 0 ? `Máximo R$ ${restante.toFixed(2).replace('.', ',')}` : 'Valor muito alto'),
    mensagem: z.string().max(300).optional(),
  })

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { valor: mode === 'inteiro' ? restante : 50 },
  })

  function startContribuir() {
    setMode('contribuir')
    setValue('valor', 50)
  }
  function startInteiro() {
    setMode('inteiro')
    setValue('valor', restante)
  }

  async function onSubmit(data: FormData) {
    setServerError('')
    try {
      const res = await fetch('/api/mp/criar-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presenteId: presente.id,
          nome: data.nome,
          email: data.email,
          valor: Number(data.valor),
          mensagem: data.mensagem,
        }),
      })
      const result = await res.json()
      if (!res.ok || !result.init_point) {
        throw new Error(result.error || 'Erro ao criar pagamento')
      }
      window.location.href = result.init_point
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar pagamento'
      setServerError(msg)
    }
  }

  function handleClose() {
    setMode('view')
    setServerError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div>
        <p className="page-eyebrow mb-2">Presente</p>
        <h3 className="font-heading text-2xl text-ink font-light">{presente.nome}</h3>
        <div className="w-8 h-px bg-terracotta mt-3 mb-5" />

        {presente.descricao && (
          <p className="font-body text-sm text-warm-gray leading-relaxed mb-6">{presente.descricao}</p>
        )}

        {/* Progresso */}
        {presente.preco && (
          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <p className="font-body text-[11px] tracking-editorial uppercase text-warm-gray">
                Arrecadado
              </p>
              <p className="font-heading text-lg text-ink font-light tabular-nums">
                {formatCurrency(presente.valor_arrecadado)} <span className="text-warm-gray text-xs">de {formatCurrency(presente.preco)}</span>
              </p>
            </div>
            <div className="relative h-1.5 bg-warm-line overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-terracotta transition-all duration-700"
                style={{ width: `${presente.percentual}%` }}
              />
            </div>
            <p className="font-body text-[11px] text-warm-muted mt-2 tabular-nums">{presente.percentual}% completo</p>
          </div>
        )}

        {/* Lista de contribuintes */}
        {presente.contribuicoes.length > 0 && (
          <div className="mb-6 border-l-2 border-terracotta pl-4 py-2">
            <p className="page-eyebrow mb-3">Contribuíram</p>
            <ul className="space-y-2 max-h-32 overflow-y-auto">
              {presente.contribuicoes.map(c => (
                <li key={c.id} className="font-body text-xs text-warm-gray flex justify-between gap-2">
                  <span className="text-ink truncate">{c.contribuidor_nome}</span>
                  <span className="tabular-nums whitespace-nowrap">{formatCurrency(c.valor)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modo: visualização */}
        {mode === 'view' && (
          <div className="space-y-3">
            {restante > 0 && (
              <Button onClick={startContribuir} className="w-full justify-center">
                Contribuir com um valor
              </Button>
            )}
            {restante > 0 && presente.preco && (
              <Button variant="outline" onClick={startInteiro} className="w-full justify-center">
                Presentear inteiro · {formatCurrency(restante)}
              </Button>
            )}
            {restante <= 0 && presente.preco && (
              <p className="font-body text-sm text-terracotta-dark text-center py-4">
                Este presente já foi totalmente arrecadado. Obrigados! ✦
              </p>
            )}
          </div>
        )}

        {/* Modo: formulário */}
        {(mode === 'contribuir' || mode === 'inteiro') && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="font-body text-[11px] sm:text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
                Seu nome *
              </label>
              <input {...register('nome')} className="input-elegant" placeholder="Como devemos te identificar" />
              {errors.nome && <p className="font-body text-xs text-terracotta-dark mt-1">{errors.nome.message}</p>}
            </div>

            <div>
              <label className="font-body text-[11px] sm:text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
                E-mail *
              </label>
              <input {...register('email')} type="email" className="input-elegant" placeholder="seu@email.com" />
              {errors.email && <p className="font-body text-xs text-terracotta-dark mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="font-body text-[11px] sm:text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
                Valor (R$) {mode === 'inteiro' && '— total restante'}
              </label>
              <input
                {...register('valor', { valueAsNumber: true })}
                type="number"
                step="1"
                min={20}
                max={restante > 0 ? restante : undefined}
                readOnly={mode === 'inteiro'}
                className={`input-elegant tabular-nums ${mode === 'inteiro' ? 'opacity-60' : ''}`}
              />
              {errors.valor && <p className="font-body text-xs text-terracotta-dark mt-1">{errors.valor.message}</p>}
              {mode === 'contribuir' && (
                <p className="font-body text-[11px] text-warm-muted mt-1">Mínimo R$ 20</p>
              )}
            </div>

            <div>
              <label className="font-body text-[11px] sm:text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
                Mensagem (opcional)
              </label>
              <textarea {...register('mensagem')} rows={2} className="input-elegant resize-none" placeholder="Um recado carinhoso aos noivos" />
            </div>

            {serverError && <p className="font-body text-sm text-terracotta-dark">{serverError}</p>}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setMode('view')} className="flex-1 justify-center">
                Voltar
              </Button>
              <Button type="submit" loading={isSubmitting} className="flex-1 justify-center">
                Pagar com Mercado Pago
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
