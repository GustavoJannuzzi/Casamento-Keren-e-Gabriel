'use client'

import { useEffect, useState } from 'react'
import { getTimeUntilWedding } from '@/lib/utils'

interface TimeUnit { value: number; label: string }

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeUntilWedding())

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeUntilWedding()), 1000)
    return () => clearInterval(interval)
  }, [])

  const units: TimeUnit[] = [
    { value: time.days,    label: 'dias' },
    { value: time.hours,   label: 'horas' },
    { value: time.minutes, label: 'min' },
    { value: time.seconds, label: 'seg' },
  ]

  return (
    <div className="flex items-end gap-5">
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex items-end gap-5">
          <div className="text-center">
            <span className="font-heading text-4xl md:text-5xl font-light text-ink tabular-nums block leading-none">
              {String(value).padStart(2, '0')}
            </span>
            <span className="font-body text-[10px] tracking-editorial uppercase text-warm-gray block mt-1.5">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="font-heading text-2xl text-warm-line font-light mb-6 select-none">·</span>
          )}
        </div>
      ))}
    </div>
  )
}
