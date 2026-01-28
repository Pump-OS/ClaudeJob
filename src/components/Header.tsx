'use client'

import { motion } from 'framer-motion'
import { HelpCircle, Info, Zap, Send } from 'lucide-react'
import Image from 'next/image'

interface HeaderProps {
  onAboutClick?: () => void
  onHowItWorksClick?: () => void
  onHelpClick?: () => void
}

export function Header({ onAboutClick, onHowItWorksClick, onHelpClick }: HeaderProps) {
  return (
    <header className="relative border-b border-coal-light/30 backdrop-blur-sm bg-coal-darker/80 sticky top-0 z-50">
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sand to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <motion.div
                className="w-10 h-10 rounded-lg overflow-hidden"
                animate={{ 
                  boxShadow: [
                    '0 0 10px rgba(223, 193, 145, 0.3)',
                    '0 0 20px rgba(223, 193, 145, 0.5)',
                    '0 0 10px rgba(223, 193, 145, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Image
                  src="/images/agent-icon.svg"
                  alt="ClawdJob"
                  width={40}
                  height={40}
                  className="w-full h-full"
                />
              </motion.div>
            </div>
            
            <span className="pixel-text pixel-text-small hidden sm:inline-block">
              CLAUDEJOB
            </span>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center gap-1"
          >
            <button
              onClick={onAboutClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-coal-lighter hover:text-sand hover:bg-coal/50 transition-all"
            >
              <Info className="w-4 h-4" />
              <span className="text-sm font-mono">About</span>
            </button>
            <a
              href="https://x.com/byronddavies"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-coal-lighter hover:text-sand hover:bg-coal/50 transition-all"
            >
              <span className="text-sm font-mono font-bold">𝕏</span>
            </a>
            <button
              onClick={onHowItWorksClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-coal-lighter hover:text-sand hover:bg-coal/50 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-mono">How It Works</span>
            </button>
            <button
              onClick={onHelpClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-terracotta/20 border border-terracotta/30 text-terracotta hover:bg-terracotta/30 hover:text-sand transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="text-sm font-mono">Help Clawdjob</span>
            </button>
          </motion.nav>

          {/* Mobile menu button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:hidden p-2 rounded-lg bg-coal/50 border border-coal-light/30 text-coal-lighter"
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </header>
  )
}
