import { NextResponse } from 'next/server'
import { generateICS } from '@/lib/utils'

export async function GET() {
  const icsContent = generateICS()

  return new NextResponse(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="casamento-keren-gabriel.ics"',
      'Cache-Control': 'no-cache',
    },
  })
}
