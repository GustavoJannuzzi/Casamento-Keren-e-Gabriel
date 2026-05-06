import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export async function criarPreferenciaPresente(
  presente: { id: string; nome: string; preco: number },
  comprador: { nome: string; email: string }
) {
  const preference = new Preference(mp)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const result = await preference.create({
    body: {
      items: [
        {
          id: presente.id,
          title: presente.nome,
          unit_price: presente.preco,
          quantity: 1,
          currency_id: 'BRL',
        },
      ],
      payer: {
        name: comprador.nome,
        email: comprador.email,
      },
      back_urls: {
        success: `${baseUrl}/presentes?status=sucesso&id=${presente.id}`,
        failure: `${baseUrl}/presentes?status=erro`,
        pending: `${baseUrl}/presentes?status=pendente&id=${presente.id}`,
      },
      notification_url: `${process.env.NEXT_PUBLIC_MP_WEBHOOK_URL || baseUrl}/api/mp/webhook`,
      external_reference: presente.id,
      auto_return: 'approved',
      statement_descriptor: 'Casamento Keren & Gabriel',
    },
  })

  return result
}

export async function buscarPagamento(paymentId: string) {
  const payment = new Payment(mp)
  return payment.get({ id: paymentId })
}
