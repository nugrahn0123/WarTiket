import { events, type MyTicket } from './dummy-data'

const STORAGE_KEY = 'wartiket:purchased-tickets'

type StoredTicket = Omit<MyTicket, 'event'>

function isStoredTicket(value: unknown): value is StoredTicket {
  if (!value || typeof value !== 'object') return false

  const ticket = value as Partial<StoredTicket>
  return (
    typeof ticket.id === 'string' &&
    Number.isSafeInteger(ticket.eventId) &&
    Number.isSafeInteger(ticket.quantity) &&
    Number.isFinite(ticket.totalPrice) &&
    ticket.status === 'aktif' &&
    typeof ticket.invoiceNo === 'string' &&
    typeof ticket.purchasedAt === 'string' &&
    typeof ticket.qrCode === 'string'
  )
}

function readStoredTickets(): StoredTicket[] {
  if (typeof window === 'undefined') return []

  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(isStoredTicket) : []
  } catch {
    return []
  }
}

export function getPurchasedTickets(): MyTicket[] {
  return readStoredTickets().flatMap(ticket => {
    const event = events.find(candidate => candidate.id === ticket.eventId)
    return event ? [{ ...ticket, event }] : []
  })
}

export function savePurchasedTicket(ticket: StoredTicket): void {
  if (typeof window === 'undefined') return

  const tickets = readStoredTickets()
  if (tickets.some(existing => existing.invoiceNo === ticket.invoiceNo)) return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([ticket, ...tickets]))
  } catch {}
}