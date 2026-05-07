/**
 * Gera CSV compatível com Excel BR:
 * - Separador `;` (default do Excel BR — vírgula é decimal)
 * - BOM UTF-8 no início (faz Excel reconhecer acentos)
 * - Aspas duplas em campos com `;`, `"` ou quebras de linha
 */
export function toCsv(rows: Array<Record<string, unknown>>, headers?: string[]): string {
  if (rows.length === 0 && !headers) return '﻿'

  const cols = headers ?? Object.keys(rows[0] ?? {})
  const lines = [cols.join(';')]

  for (const row of rows) {
    const fields = cols.map(col => escape(row[col]))
    lines.push(fields.join(';'))
  }

  return '﻿' + lines.join('\r\n')
}

function escape(value: unknown): string {
  if (value === null || value === undefined) return ''
  let str = typeof value === 'string' ? value : String(value)
  // Normaliza datas
  if (value instanceof Date) str = value.toISOString()
  // Aspas, ponto-e-vírgula, ou quebra de linha → envolve em aspas e escapa aspas duplas
  if (/["\n\r;]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function csvResponse(filename: string, csv: string): Response {
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
