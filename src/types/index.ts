export type User = {
  id: number
  name: string
  position: string
  email: string
}

export type Batch = {
  idbatch: number
  year: number
  starts: string
  ends: string
  fee: number
}

export type Student = {
  idwanafunzi: number
  student_name: string
  address: string
  parent_phone: string
  year: number | null
  fee: number | null
  paid_amount: number
  remaining_amount: number
}

export type Institution = {
  idtaasisi: number
  taasisi_name: string
}

export type Language = 'SW' | 'EN'

export type Notice = { kind: 'success' | 'error'; text: string } | null
