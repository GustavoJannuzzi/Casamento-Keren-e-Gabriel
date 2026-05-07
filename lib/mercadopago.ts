import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

export interface PreferenciaInput {
  presente: { id: string; nome: string }
  valor: number
  contribuidor: { nome: string; email: string }
  contribuicaoId: string
}

export async function criarPreferenciaContribuicao({
  presente, valor, contribuidor, contribuicaoId,
}: PreferenciaInput) {
  const preference = new Preference(mp)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const webhookBase = process.env.NEXT_PUBLIC_MP_WEBHOOK_URL || baseUrl

  const result = await preference.create({
    body: {
      items: [
        {
          id: contribuicaoId,
          title: `Presente: ${presente.nome}`,
          unit_price: valor,
          quantity: 1,
          currency_id: 'BRL',
        },
      ],
      payer: {
        name: contribuidor.nome,
        email: contribuidor.email,
      },
      back_urls: {
        success: `${baseUrl}/presentes?status=sucesso&id=${presente.id}`,
        failure: `${baseUrl}/presentes?status=erro`,
        pending: `${baseUrl}/presentes?status=pendente&id=${presente.id}`,
      },
      notification_url: `${webhookBase}/api/mp/webhook`,
      external_reference: contribuicaoId,
      auto_return: 'approved',
      statement_descriptor: 'Casamento K&G',
    },
  })

  return result
}

export async function buscarPagamento(paymentId: string) {
  const payment = new Payment(mp)
  return payment.get({ id: paymentId })
}
