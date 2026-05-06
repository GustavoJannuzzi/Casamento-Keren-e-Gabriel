import PageHeader from '@/components/ui/PageHeader'
import Timeline from '@/components/historia/Timeline'

export const metadata = { title: 'Nossa História | Casamento Keren & Gabriel' }

export default function NossaHistoriaPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          eyebrow="Uma história de amor"
          title="Nossa História"
          subtitle="Cada amor tem seu próprio caminho. O nosso começou com um olhar e se construiu em aventuras, risadas e cumplicidade."
        />
        <Timeline />
      </div>
    </div>
  )
}
