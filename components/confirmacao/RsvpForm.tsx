'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import ThankYou from './ThankYou'
import type { RsvpFormData } from '@/types'

const schema = z.object({
  nome: z.string().min(2, 'Nome muito curto').max(100),
  email: z.string().email('Email inválido').or(z.literal('')),
  telefone: z.string().max(20).optional(),
  confirmado: z.boolean(),
  acompanhantes: z.number().int().min(0).max(10),
  restricao_alimentar: z.string().max(300).optional(),
  mensagem: z.string().max(500).optional(),
})

export default function RsvpForm() {
  const [submitted, setSubmitted] = useState(false)
  const [nomeEnviado, setNomeEnviado] = useState('')
  const [confirmadoEnviado, setConfirmadoEnviado] = useState(true)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      confirmado: true,
      acompanhantes: 0,
    },
  })

  const confirmado = watch('confirmado')

  async function onSubmit(data: RsvpFormData) {
    setServerError('')
    try {
      const res = await fetch('/api/confirmacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setNomeEnviado(data.nome)
      setConfirmadoEnviado(data.confirmado)
      setSubmitted(true)
    } catch {
      setServerError('Ocorreu um erro ao enviar. Por favor, tente novamente.')
    }
  }

  if (submitted) {
    return (
      <ThankYou
        nome={nomeEnviado}
        confirmado={confirmadoEnviado}
        onReset={() => setSubmitted(false)}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-xl mx-auto">
      {/* Attendance toggle */}
      <div>
        <p className="font-body text-[10px] tracking-editorial uppercase text-warm-gray mb-3">
          Você irá comparecer?
        </p>
        <div className="flex gap-3">
          {[true, false].map((val) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => setValue('confirmado', val)}
              className={`flex-1 py-3 border font-body text-xs tracking-editorial uppercase transition-colors duration-200 ${
                confirmado === val
                  ? val
                    ? 'bg-ink text-cream border-ink'
                    : 'bg-warm-gray text-cream border-warm-gray'
                  : 'border-warm-line text-warm-gray hover:border-warm-gray hover:text-ink'
              }`}
            >
              {val ? 'Sim, estarei lá' : 'Infelizmente não'}
            </button>
          ))}
        </div>
      </div>

      {/* Nome */}
      <div>
        <label className="font-body text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
          Nome completo *
        </label>
        <input
          {...register('nome')}
          placeholder="Seu nome"
          className="input-elegant"
        />
        {errors.nome && <p className="font-body text-xs text-terracotta-dark mt-1">{errors.nome.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="font-body text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="seu@email.com"
          className="input-elegant"
        />
        {errors.email && <p className="font-body text-xs text-terracotta-dark mt-1">{errors.email.message}</p>}
      </div>

      {/* Telefone */}
      <div>
        <label className="font-body text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
          Telefone / WhatsApp
        </label>
        <input
          {...register('telefone')}
          placeholder="(41) 99999-9999"
          className="input-elegant"
        />
      </div>

      {/* Acompanhantes */}
      {confirmado && (
        <div>
          <label className="font-body text-[10px] tracking-editorial uppercase text-warm-gray block mb-3">
            Acompanhantes (além de você)
          </label>
          <div className="flex gap-2 flex-wrap">
            {[0, 1, 2, 3, 4].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setValue('acompanhantes', n)}
                className={`px-4 py-2.5 border font-body text-xs tracking-editorial uppercase transition-colors duration-200 ${
                  watch('acompanhantes') === n
                    ? 'bg-ink text-cream border-ink'
                    : 'border-warm-line text-warm-gray hover:border-warm-gray hover:text-ink'
                }`}
              >
                {n === 0 ? 'Só eu' : `+${n}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Restrição alimentar */}
      <div>
        <label className="font-body text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
          Restrição alimentar (opcional)
        </label>
        <input
          {...register('restricao_alimentar')}
          placeholder="Ex: vegetariano, sem glúten, alergia a frutos do mar..."
          className="input-elegant"
        />
      </div>

      {/* Mensagem */}
      <div>
        <label className="font-body text-[10px] tracking-editorial uppercase text-warm-gray block mb-2">
          Mensagem para os noivos (opcional)
        </label>
        <textarea
          {...register('mensagem')}
          placeholder="Deixe um recado carinhoso..."
          className="input-elegant resize-none"
          rows={3}
        />
      </div>

      {serverError && (
        <p className="font-body text-sm text-terracotta-dark text-center">{serverError}</p>
      )}

      <Button
        type="submit"
        loading={isSubmitting}
        size="lg"
        className="w-full"
      >
        Enviar Confirmação
      </Button>
    </form>
  )
}
