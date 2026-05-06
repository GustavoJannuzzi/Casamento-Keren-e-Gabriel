'use client'

import { useEffect, useState } from 'react'

interface Heart {
  id: number
  left: string
  size: string
  duration: string
  delay: string
  opacity: string
}

const HEART_SVG = `❤️`

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    const generated: Heart[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: `${5 + (i * 6)}%`,
      size: `${10 + Math.floor(Math.random() * 14)}px`,
      duration: `${7 + Math.random() * 8}s`,
      delay: `${Math.random() * 10}s`,
      opacity: `${0.2 + Math.random() * 0.35}`,
    }))
    setHearts(generated)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="heart-particle select-none"
          style={{
            left: heart.left,
            fontSize: heart.size,
            animationDuration: heart.duration,
            animationDelay: heart.delay,
            opacity: heart.opacity,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  )
}
