export type PayerState = 'not_paid' | 'pending_verification' | 'paid'

export type EventStatus = 'draft' | 'published'

export interface Payer {
  _id: string
  name: string
  state: PayerState
  paymentTimestamp?: string
  verificationTimestamp?: string
}

export interface Collector {
  _id: string
  username: string
  name: string
  passwordHash: string
  upiId: string
  createdAt: string
  updatedAt: string
}

export interface CollectionEvent {
  _id: string
  title: string
  description?: string
  slug: string
  amount: number
  collectorId: string
  status: EventStatus
  payers: Payer[]
  createdAt: string
  updatedAt: string
}

export interface PayerModalProps {
  payer: Payer
  amount: number
  upiId: string
  collectorName: string
  eventId: string
  eventCreatedAt: string
}

export interface PayAsModalProps {
  amount: number
  upiId: string
  collectorName: string
  eventId: string
}

export interface VerifyPaymentProps {
  eventId: string
  payerId: string
  payerName: string
}