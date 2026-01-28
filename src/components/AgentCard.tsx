'use client'

import { motion } from 'framer-motion'
import { Cpu, Briefcase, Clock, Zap } from 'lucide-react'
import Image from 'next/image'

interface AgentCardProps {
  agent: {
    name: string
    avatar: string
    skills: string[]
    personality: string
    status: string
    currentTask?: string
  }
  thoughts: string
}

export function AgentCard({ agent, thoughts }: AgentCardProps) {
  const statusColors: Record<string, string> = {
    idle: 'bg-coal-lighter',
    searching: 'bg-sand',
    applying: 'bg-terracotta',
    waiting: 'bg-rust',
    interviewing: 'bg-sand'
  }

  const statusColor = statusColors[agent.status] || statusColors.idle

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-coal/50 border border-coal-light/30 backdrop-blur-sm card-hover"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sand/5 to-transparent pointer-events-none" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar - Robot Icon */}
          <div className="relative">
            <motion.div
              className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-sand/30"
              animate={{ 
                boxShadow: [
                  '0 0 15px rgba(223, 193, 145, 0.2)',
                  '0 0 25px rgba(223, 193, 145, 0.4)',
                  '0 0 15px rgba(223, 193, 145, 0.2)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Image
                src="/images/agent-icon.svg"
                alt="AI Agent"
                width={80}
                height={80}
                className="w-full h-full"
              />
            </motion.div>
            
            {/* Status indicator */}
            <motion.div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${statusColor} border-2 border-coal`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          
          {/* Name and status */}
          <div className="flex-1">
            <h2 className="text-2xl font-display font-bold text-sand mb-1">
              {agent.name}
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <Cpu className="w-4 h-4 text-terracotta" />
              <span className="text-terracotta">AI Job Hunter Agent</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase ${statusColor} text-coal-darker`}>
                {agent.status}
              </span>
            </div>
          </div>
        </div>
        
        {/* Current Task */}
        {agent.currentTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 rounded-xl bg-coal-dark/50 border border-coal-light/20"
          >
            <div className="flex items-center gap-2 text-sm text-sand/90">
              <Zap className="w-4 h-4 text-terracotta" />
              <span className="font-mono">{agent.currentTask}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-sand"
              >
                ▋
              </motion.span>
            </div>
          </motion.div>
        )}
        
        {/* Agent Thoughts */}
        <div className="mb-4 p-4 rounded-xl bg-coal-darker/50 border border-coal-light/10">
          <div className="flex items-start gap-2">
            <div className="text-terracotta text-sm font-mono mt-0.5">〉</div>
            <p className="text-sm text-sand/70 font-mono leading-relaxed">
              {thoughts}
            </p>
          </div>
        </div>
        
        {/* Skills */}
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-wider text-coal-lighter mb-2 font-mono">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {agent.skills.slice(0, 5).map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-2 py-1 text-xs rounded-lg bg-coal-dark text-sand/80 border border-coal-light/20 font-mono"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-coal-dark/30 border border-coal-light/10">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-sand" />
              <span className="text-xs text-coal-lighter font-mono">Experience</span>
            </div>
            <p className="text-lg font-bold text-sand mt-1">2+ Years</p>
          </div>
          <div className="p-3 rounded-xl bg-coal-dark/30 border border-coal-light/10">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-terracotta" />
              <span className="text-xs text-coal-lighter font-mono">Availability</span>
            </div>
            <p className="text-lg font-bold text-sand mt-1">24/7</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
