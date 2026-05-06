export default function Footer() {
  return (
    <footer className="border-t border-warm-line py-12 mt-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <p className="font-body text-xs text-warm-gray tracking-editorial uppercase hidden md:block">
            Curitiba — PR
          </p>

          <div className="text-center">
            <p className="font-heading text-3xl text-ink font-light tracking-tight">
              Keren <span className="text-terracotta">&</span> Gabriel
            </p>
            <p className="font-body text-xs text-warm-muted tracking-editorial uppercase mt-2">
              14 · Março · 2027
            </p>
          </div>

          <p className="font-body text-xs text-warm-gray text-right hidden md:block">
            Feito com amor ♥
          </p>
        </div>
      </div>
    </footer>
  )
}
