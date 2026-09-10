'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, User } from 'lucide-react'

interface TopBarProps {
  variant?: 'home' | 'back'
  title?: string
}

export default function TopBar({ variant = 'home', title }: TopBarProps) {
  const router = useRouter()

  if (variant === 'home') {
    return (
      <div className="sticky top-0 z-40 bg-wt-surface/95 backdrop-blur-xl border-b border-wt-border">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="text-[21px] font-extrabold tracking-tight">
            War<span className="gradient-text">Tiket</span>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="w-9 h-9 rounded-full bg-wt-card border border-wt-border flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Notifikasi belum tersedia"
              title="Notifikasi belum tersedia"
              disabled
            >
              <Bell size={17} className="text-wt-muted" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="w-9 h-9 rounded-full bg-wt-card border border-wt-border flex items-center justify-center"
              onClick={() => router.push('/profile')}
              aria-label="Buka profil"
            >
              <User size={17} className="text-wt-muted" />
            </motion.button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sticky top-0 z-40 bg-wt-surface/95 backdrop-blur-xl border-b border-wt-border">
      <div className="flex items-center justify-between px-5 py-4">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-wt-card border border-wt-border flex items-center justify-center"
          aria-label="Kembali"
        >
          <ArrowLeft size={18} className="text-wt-text" />
        </motion.button>
        {title && (
          <span className="text-base font-bold text-wt-text">{title}</span>
        )}
        <div className="w-9" />
      </div>
    </div>
  )
}
