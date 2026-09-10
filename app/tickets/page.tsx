'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import TopBar from '@/components/TopBar'
import { myTickets, formatPrice } from '@/lib/dummy-data'
import { getPurchasedTickets } from '@/lib/ticket-storage'
import { Ticket } from 'lucide-react'

type Status = 'aktif' | 'selesai' | 'dibatalkan'

const TABS: { id: Status; label: string }[] = [
  { id: 'aktif',      label: 'Aktif' },
  { id: 'selesai',    label: 'Selesai' },
  { id: 'dibatalkan', label: 'Dibatalkan' },
]

const STATUS_CFG: Record<Status, { label: string; text: string; bg: string }> = {
  aktif:      { label: 'Aktif',      text: 'text-wt-green',  bg: 'bg-wt-green/15'  },
  selesai:    { label: 'Selesai',    text: 'text-wt-muted',  bg: 'bg-wt-border/60' },
  dibatalkan: { label: 'Dibatalkan', text: 'text-wt-red',    bg: 'bg-wt-red/15'    },
}

export default function TicketsPage() {
  const [tab, setTab] = useState<Status>('aktif')
  const [purchasedTickets, setPurchasedTickets] = useState<typeof myTickets>([])
  const router = useRouter()
  const list = [...purchasedTickets, ...myTickets].filter(ticket => ticket.status === tab)

  useEffect(() => {
    const refreshTickets = () => setPurchasedTickets(getPurchasedTickets())

    refreshTickets()
    window.addEventListener('storage', refreshTickets)
    return () => window.removeEventListener('storage', refreshTickets)
  }, [])

  return (
    <div className="flex flex-col pb-24">
      <TopBar variant="home" />

      <div className="px-5 pt-5">
        <h1 className="text-[22px] font-extrabold text-wt-text mb-4">Tiket Saya</h1>

        {/* Tab switcher */}
        <div className="flex bg-wt-card rounded-xl p-1 gap-1 mb-5">
          {TABS.map(t => (
            <motion.button
              key={t.id}
              className="flex-1 py-2 rounded-lg text-xs font-semibold relative"
              onClick={() => setTab(t.id)}
            >
              {tab === t.id && (
                <motion.div
                  layoutId="ticket-tab"
                  className="absolute inset-0 bg-wt-accent rounded-lg"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <span className={`relative z-10 ${tab === t.id ? 'text-white' : 'text-wt-muted'}`}>
                {t.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Ticket list */}
        <AnimatePresence mode="wait">
          {list.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Ticket size={48} className="text-wt-muted mb-4" strokeWidth={1.5} />
              <p className="text-wt-text font-semibold">Belum ada tiket</p>
              <p className="text-wt-muted text-sm mt-1 mb-5">Beli tiket konser favoritmu sekarang!</p>
              <motion.button
                className="px-6 py-3 rounded-2xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
              >
                Jelajahi Konser
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              {list.map((ticket, i) => {
                const cfg = STATUS_CFG[ticket.status]
                return (
                  <motion.div
                    key={ticket.id}
                    className="bg-wt-card border border-wt-border rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    {/* Top half */}
                    <div className="flex gap-3 p-4">
                      <div
                        className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ background: ticket.event.gradient }}
                      >
                        <div style={{ position:'absolute',width:60,height:60,top:-15,right:-15,background:'rgba(255,255,255,0.1)',borderRadius:'50%' }} />
                        <div style={{ position:'absolute',width:40,height:40,bottom:-10,left:-10,background:'rgba(0,0,0,0.15)',borderRadius:'50%' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-wt-text truncate">{ticket.event.title}</h4>
                        <p className="text-xs text-wt-muted mt-0.5">
                          {ticket.event.date} · {ticket.event.city}
                        </p>
                        <p className="text-xs text-wt-muted mt-0.5">
                          {ticket.quantity} tiket · {formatPrice(ticket.totalPrice)}
                        </p>
                      </div>
                    </div>

                    {/* Torn-paper divider */}
                    <div className="ticket-divider" />

                    {/* Bottom half */}
                    <div className="flex items-center justify-between p-4">
                      <div
                        className="w-14 h-14 bg-white rounded-xl flex items-center justify-center"
                        role="img"
                        aria-label={`Kode QR tiket ${ticket.id}`}
                      >
                        <QRCodeSVG
                          value={ticket.qrCode}
                          size={44}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="M"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.bg} ${cfg.text} block mb-1.5`}>
                          {cfg.label}
                        </span>
                        <span className="text-[10px] text-wt-muted font-mono">{ticket.qrCode}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
