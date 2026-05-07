export type PresenteStatus = 'disponivel' | 'reservado' | 'comprado'

export interface Presente {
  id: string
  nome: string
  descricao: string | null
  preco: number | null
  imagem_url: string | null
  categoria: string | null
  status: PresenteStatus
  comprador_nome: string | null
  comprador_mensagem: string | null
  mp_preference_id: string | null
  mp_payment_id: string | null
  created_at: string
}

export interface Confirmacao {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  acompanhantes: number
  confirmado: boolean
  restricao_alimentar: string | null
  mensagem: string | null
  created_at: string
}

export interface Recado {
  id: string
  nome: string
  mensagem: string
  aprovado: boolean
  created_at: string
}

export interface Padrinho {
  id: string
  nome: string
  titulo: string
  foto_url: string | null
  ordem: number | null
}

export interface RsvpFormData {
  nome: string
  email: string
  telefone: string
  confirmado: boolean
  acompanhantes: number
  restricao_alimentar: string
  mensagem: string
}

export interface RecadoFormData {
  nome: string
  mensagem: string
}

export interface Contribuicao {
  id: string
  presente_id: string
  contribuidor_nome: string
  contribuidor_email: string | null
  valor: number
  mensagem: string | null
  status: 'pendente' | 'aprovado' | 'cancelado'
  mp_preference_id: string | null
  mp_payment_id: string | null
  created_at: string
}

export interface PresenteComProgresso extends Presente {
  valor_arrecadado: number
  percentual: number
  contribuicoes: Contribuicao[]
}

export interface CriarPreferenciaPayload {
  presenteId: string
  nome: string
  email: string
  valor?: number
  mensagem?: string
}

export interface ReservarPayload {
  compradorNome: string
  compradorMensagem: string
}
