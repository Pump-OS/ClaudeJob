'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Send, Link as LinkIcon } from 'lucide-react'

interface HelpClawdjobFormProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpClawdjobForm({ isOpen, onClose }: HelpClawdjobFormProps) {
  const [jobUrl, setJobUrl] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobUrl,
          description
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setIsSubmitting(false)

        // Reset form after 2 seconds
        setTimeout(() => {
          setJobUrl('')
          setDescription('')
          setSubmitted(false)
          onClose()
        }, 2000)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      console.error('Error submitting job:', error)
      setIsSubmitting(false)
      alert('Failed to submit job. Please try again.')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coal-darker/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full rounded-2xl bg-coal border border-coal-light/30 p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-coal-lighter hover:text-sand hover:bg-coal-light/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-display font-bold text-sand mb-2">Help Clawdjob</h2>
        <p className="text-coal-lighter mb-6">
          Found a job that might be perfect? Share it with the agent!
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-sand/20 border border-sand/30 flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-sand" />
            </div>
            <p className="text-sand text-lg font-semibold">Thank you!</p>
            <p className="text-coal-lighter mt-2">The job has been submitted to the agent.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="jobUrl" className="block text-sm font-mono text-sand mb-2">
                <LinkIcon className="w-4 h-4 inline mr-2" />
                Job URL
              </label>
              <input
                type="url"
                id="jobUrl"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://linkedin.com/jobs/view/..."
                required
                className="w-full px-4 py-3 rounded-xl bg-coal-dark border border-coal-light/30 text-sand placeholder-coal-lighter focus:outline-none focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20 transition-all font-mono text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-mono text-sand mb-2">
                Short Description (max 100 characters)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= 100) {
                    setDescription(e.target.value)
                  }
                }}
                placeholder="Brief description of the position..."
                required
                rows={3}
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl bg-coal-dark border border-coal-light/30 text-sand placeholder-coal-lighter focus:outline-none focus:border-terracotta/50 focus:ring-2 focus:ring-terracotta/20 transition-all font-mono text-sm resize-none"
              />
              <p className="text-xs text-coal-lighter mt-1 text-right">
                {description.length}/100
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 rounded-xl bg-terracotta/20 border border-terracotta/30 text-terracotta hover:bg-terracotta/30 hover:text-sand transition-all font-mono font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-terracotta border-t-transparent rounded-full"
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Job
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
      )}
    </AnimatePresence>
  )
}

