import RsvpForm from '@/components/confirmacao/RsvpForm'
import PageHeader from '@/components/ui/PageHeader'

export const metadata = { title: 'Confirmar Presença | Casamento Keren & Gabriel' }

export default function ConfirmarPresencaPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-10">
      <div className="max-w-xl mx-auto">
        <PageHeader
          eyebrow="Sua presença é nosso maior presente"
          title="Confirmar Presença"
          subtitle="Por favor, confirme até 14 de fevereiro de 2027. Isso nos ajuda muito na organização!"
        />
        <RsvpForm />
      </div>
    </div>
  )
}
