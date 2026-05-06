interface MapEmbedProps {
  query: string
  title: string
}

export default function MapEmbed({ query, title }: MapEmbedProps) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=15`

  return (
    <div className="w-full overflow-hidden border border-warm-line">
      <iframe
        title={title}
        src={src}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
