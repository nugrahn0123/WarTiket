import { events, type Event } from './dummy-data'

export const MAX_TICKETS_PER_ORDER = 5
export const SERVICE_FEE = 10000

export interface Checkout {
  event: Event
  quantity: number
}

function parsePositiveInteger(value: string | null): number | null {
  if (!value || !/^\d+$/.test(value)) return null

  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null
}

export function getCheckout(searchParams: Pick<URLSearchParams, 'get'>): Checkout | null {
  const eventId = parsePositiveInteger(searchParams.get('eventId'))
  const quantity = parsePositiveInteger(searchParams.get('qty'))
  const event = events.find(candidate => candidate.id === eventId)

  if (!event || !quantity) return null
  if (quantity > Math.min(MAX_TICKETS_PER_ORDER, event.seats)) return null

  return { event, quantity }
}

export function calculateOrderTotal(price: number, quantity: number): number {
  return price * quantity + SERVICE_FEE
}

export function createInvoiceNumber(date = new Date()): string {
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('')
  const reference = crypto.randomUUID().slice(0, 8).toUpperCase()

  return `INV-${datePart}-${reference}`
}

export function isValidInvoiceNumber(value: string | null): value is string {
  return Boolean(value && /^INV-\d{8}-[A-F0-9]{8}$/.test(value))
}