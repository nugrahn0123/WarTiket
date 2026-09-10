'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertTriangle, Landmark, CreditCard, Wallet, QrCode } from 'lucide-react'
import TopBar from '@/components/TopBar'
import { formatPrice } from '@/lib/dummy-data'
import { calculateOrderTotal, getCheckout, SERVICE_FEE } from '@/lib/checkout'

const METHODS = [
  { id: 'transfer', label: 'Transfer', Icon: Landmark   },
  { id: 'card',     label: 'Kartu',    Icon: CreditCard },
  { id: 'wallet',   label: 'Dompet',   Icon: Wallet     },
  { id: 'qris',     label: 'QRIS',     Icon: QrCode     },
]

function PaymentContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const checkout     = getCheckout(searchParams)

  const [method,  setMethod]  = useState('transfer')
  const [loading, setLoading] = useState(false)

  if (!checkout) {
    return (
      <div className="flex min-h-screen flex-col">
        <TopBar variant="back" title="Pembayaran" />
        <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
          <AlertTriangle size={44} className="mb-4 text-wt-yellow" strokeWidth={1.5} />
          <h1 className="text-lg font-bold text-wt-text">Pesanan tidak valid</h1>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-wt-muted">
            Pilih kembali konser dan jumlah tiket yang ingin dibeli.
          </p>
          <button
            className="mt-6 rounded-xl bg-wt-accent px-5 py-3 text-sm font-bold text-white"
            onClick={() => router.push('/')}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    )
  }

  const { event, quantity } = checkout
  const total = calculateOrderTotal(event.price, quantity)

  const handlePay = () => {
    setLoading(true)
    setTimeout(() => {
      router.push(`/success?eventId=${event.id}&qty=${quantity}&method=${method}`)
    }, 1400)
  }

  const rows = [
    { label: 'Harga tiket',   value: formatPrice(event.price) },
    { label: 'Jumlah',        value: `${quantity} tiket` },
    { label: 'Subtotal',      value: formatPrice(event.price * quantity) },
    { label: 'Biaya layanan', value: formatPrice(SERVICE_FEE) },
  ]

  return (
    <div className="flex flex-col pb-8">
      <TopBar variant="back" title="Pembayaran" />

      <div className="px-5 pt-5 flex flex-col gap-5">

        {/* Order summary card */}
        <div className="bg-wt-card border border-wt-border rounded-2xl overflow-hidden">
          {/* Event row */}
          <div className="flex items-center gap-3 p-4 border-b border-wt-border">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
               style={{ background: event.gradient }}>
            <div style={{ position:'absolute',width:60,height:60,top:-15,right:-15,background:'rgba(255,255,255,0.1)',borderRadius:'50%' }} />
            <div style={{ position:'absolute',width:40,height:40,bottom:-10,left:-10,background:'rgba(0,0,0,0.15)',borderRadius:'50%' }} />
          </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-wt-text truncate">{event.title}</h3>
              <p className="text-xs text-wt-muted mt-0.5">{event.date} · {event.city}</p>
            </div>
          </div>

          {/* Price rows */}
          <div className="p-4 space-y-2.5">
            <p className="text-[10px] text-wt-muted uppercase tracking-wider font-semibold mb-3">
              Rincian Pesanan
            </p>
            {rows.map(r => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-wt-muted">{r.label}</span>
                <span className="text-wt-text font-medium">{r.value}</span>
              </div>
            ))}
            <div className="border-t border-wt-border pt-3 flex justify-between">
              <span className="text-sm font-bold text-wt-text">Total Bayar</span>
              <span className="text-base font-extrabold text-wt-accent2">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div>
          <h3 className="text-sm font-bold text-wt-text mb-3">Metode Pembayaran</h3>
          <div className="grid grid-cols-4 gap-2.5">
            {METHODS.map(m => {
              const Icon = m.Icon
              return (
                <motion.button
                  key={m.id}
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-2 py-3.5 rounded-2xl border transition-colors ${
                    method === m.id
                      ? 'bg-wt-accent/10 border-wt-accent'
                      : 'bg-wt-card border-wt-border'
                  }`}
                  onClick={() => setMethod(m.id)}
                >
                  <Icon size={22} className={method === m.id ? 'text-wt-accent' : 'text-wt-muted'} strokeWidth={1.8} />
                  <span className={`text-[11px] font-semibold ${method === m.id ? 'text-wt-accent' : 'text-wt-muted'}`}>
                    {m.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Pay button */}
        <motion.button
          className="w-full h-14 rounded-2xl font-bold text-white text-base overflow-hidden relative"
          style={{ background: loading ? '#282828' : 'linear-gradient(135deg, #f97316, #fb923c)' }}
          whileHover={!loading ? { boxShadow: '0 0 32px rgba(249,115,22,0.5)' } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? (
            <motion.div className="flex items-center justify-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.75, ease: 'linear' }}
              />
              Memproses…
            </motion.div>
          ) : (
            `Bayar Sekarang — ${formatPrice(total)}`
          )}
        </motion.button>

        <p className="text-center text-xs text-wt-muted -mt-2">
          Dengan membayar, kamu setuju dengan syarat &amp; ketentuan WarTiket
        </p>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-wt-border border-t-wt-accent rounded-full animate-spin" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}
