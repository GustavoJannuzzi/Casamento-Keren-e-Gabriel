import { cn } from '@/lib/utils'
import type { PresenteStatus } from '@/types'

interface BadgeProps {
  status: PresenteStatus
  className?: string
}

const labels: Record<PresenteStatus, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  comprado: 'Presenteado',
}

const styles: Record<PresenteStatus, string> = {
  disponivel: 'bg-cream border-warm-line text-warm-gray',
  reservado:  'bg-terracotta/10 border-terracotta/30 text-terracotta-dark',
  comprado:   'bg-ink border-ink text-cream',
}

export default function Badge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-body text-[9px] tracking-editorial uppercase px-2.5 py-1 border',
        styles[status],
        className
      )}
    >
      <span
        className={cn('w-1 h-1 rounded-full flex-shrink-0', {
          'bg-warm-gray':    status === 'disponivel',
          'bg-terracotta':   status === 'reservado',
          'bg-cream':        status === 'comprado',
        })}
      />
      {labels[status]}
    </span>
  )
}
