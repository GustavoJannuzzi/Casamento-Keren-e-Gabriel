import MapEmbed from '@/components/detalhes/MapEmbed'
import PageHeader from '@/components/ui/PageHeader'

export const metadata = { title: 'Detalhes | Casamento Keren & Gabriel' }

const ceremony = {
  label: 'Cerimônia',
  time: '16h00',
  place: 'Igreja Nossa Senhora do Brasil',
  address: 'Curitiba — PR',
  note: 'Chegada até 15h45',
  mapQuery: 'Igreja Nossa Senhora do Brasil, Curitiba, PR',
}

const reception = {
  label: 'Recepção',
  time: '18h00',
  place: 'Espaço Villa Verde',
  address: 'Curitiba — PR',
  note: 'Traje: festa',
  mapQuery: 'Curitiba, PR',
}

export default function DetalhesPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          eyebrow="O grande dia"
          title="Detalhes"
          subtitle="Sábado, 14 de março de 2027 — Curitiba, Paraná."
        />

        {/* Data destaque */}
        <div className="flex items-center justify-center gap-8 mb-16 border-t border-b border-warm-line py-8">
          <div className="text-center">
            <span className="font-heading text-7xl text-ink font-light leading-none block">14</span>
            <span className="font-body text-xs tracking-editorial uppercase text-warm-gray">Dia</span>
          </div>
          <div className="w-px h-16 bg-warm-line" />
          <div className="text-center">
            <span className="font-heading text-3xl text-ink font-light block">Março</span>
            <span className="font-body text-xs tracking-editorial uppercase text-warm-gray">Mês</span>
          </div>
          <div className="w-px h-16 bg-warm-line" />
          <div className="text-center">
            <span className="font-heading text-3xl text-ink font-light block">2027</span>
            <span className="font-body text-xs tracking-editorial uppercase text-warm-gray">Ano</span>
          </div>
        </div>

        {/* Dois locais */}
        <div className="grid md:grid-cols-2 gap-px bg-warm-line mb-16">
          {[ceremony, reception].map((item) => (
            <div key={item.label} className="bg-cream p-8 md:p-12">
              <p className="page-eyebrow mb-4">{item.label}</p>
              <h2 className="font-heading text-3xl md:text-4xl text-ink font-light leading-tight mb-2">
                {item.place}
              </h2>
              <p className="font-body text-sm text-warm-gray mb-6">{item.address}</p>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-heading text-5xl text-ink font-light">{item.time}</span>
                <span className="font-body text-xs text-warm-muted italic">{item.note}</span>
              </div>

              <div className="mb-6">
                <MapEmbed query={item.mapQuery} title={`Mapa — ${item.place}`} />
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(item.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex"
              >
                Abrir no Google Maps
              </a>
            </div>
          ))}
        </div>

        {/* Salvar na agenda */}
        <div className="text-center border-t border-warm-line pt-10">
          <p className="font-body text-sm text-warm-gray mb-5">
            Adicione à sua agenda para não esquecer
          </p>
          <a
            href="/api/agenda"
            download="casamento-keren-gabriel.ics"
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Salvar na Agenda
          </a>
        </div>
      </div>
    </div>
  )
}
