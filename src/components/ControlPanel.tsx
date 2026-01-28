'use client'

import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Settings } from 'lucide-react'

interface ControlPanelProps {
  isRunning: boolean
  onStart: () => void
  onStop: () => void
  onReset: () => void
  isLoading?: boolean
}

export function ControlPanel({ 
  isRunning, 
  onStart, 
  onStop, 
  onReset,
  isLoading = false 
}: ControlPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3"
    >
      {/* Main Action Button */}
      {isRunning ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStop}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-neon-red/20 border border-neon-red text-neon-red font-mono font-semibold hover:bg-neon-red/30 transition-all disabled:opacity-50"
        >
          <Pause className="w-5 h-5" />
          <span>Stop Agent</span>
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          disabled={isLoading}
          className="relative flex items-center gap-2 px-6 py-3 rounded-lg bg-neon-green/20 border border-neon-green text-neon-green font-mono font-semibold hover:bg-neon-green/30 transition-all disabled:opacity-50 overflow-hidden"
        >
          {isLoading ? (
            <>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <RotateCcw className="w-5 h-5" />
              </motion.div>
              <span>Hunting...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start Job Hunt</span>
            </>
          )}
        </motion.button>
      )}

      {/* Secondary Actions */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="p-3 rounded-lg bg-cyber-700/50 border border-cyber-600 text-cyber-300 hover:text-white hover:border-cyber-500 transition-all"
        title="Reset"
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-3 rounded-lg bg-cyber-700/50 border border-cyber-600 text-cyber-300 hover:text-white hover:border-cyber-500 transition-all"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </motion.button>
    </motion.div>
  )
}

