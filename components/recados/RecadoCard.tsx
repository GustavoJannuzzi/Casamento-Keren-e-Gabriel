import { formatDate } from '@/lib/utils'
import type { Recado } from '@/types'

export default function RecadoCard({ recado }: { recado: Recado }) {
  return (
    <div className="border border-warm-line p-6 bg-white hover:border-warm-gray transition-colors duration-300">
      <div className="flex items-baseline gap-2 mb-4">
        <div className="w-7 h-7 bg-ink flex items-center justify-center flex-shrink-0">
          <span className="font-heading text-sm text-cream leading-none">
            {recado.nome.charAt(0).toUpperCase()}
          </span>
        </div>
        <h3 className="font-heading text-lg text-ink font-light">{recado.nome}</h3>
        <time className="font-body text-[10px] tracking-editorial uppercase text-warm-gray ml-auto">
          {formatDate(recado.created_at)}
        </time>
      </div>

      <p className="font-body text-sm text-warm-gray leading-relaxed italic border-l-2 border-terracotta pl-4">
        &ldquo;{recado.mensagem}&rdquo;
      </p>
    </div>
  )
}
