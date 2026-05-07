import { cookies } from 'next/headers'
import { timingSafeEqual } from 'crypto'

export async function isNoivosAuthorized(): Promise<boolean> {
  const expected = process.env.NOIVOS_PASSWORD
  if (!expected) return false

  const cookieStore = await cookies()
  const token = cookieStore.get('noivos-token')?.value
  if (!token) return false

  const bufA = Buffer.from(token)
  const bufB = Buffer.from(expected)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}
