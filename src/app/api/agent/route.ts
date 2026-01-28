import { NextResponse } from 'next/server'
import { getAgent, getAgentThoughts, generateResume } from '@/lib/claude-agent'
import { calculateStats, getAgentState } from '@/lib/storage'

export async function GET() {
  try {
    const agent = getAgent()
    const state = await getAgentState()
    const stats = await calculateStats(agent.id)
    const thoughts = await getAgentThoughts()
    const resume = generateResume(agent)
    
    return NextResponse.json({
      agent: {
        ...agent,
        status: state.status,
        currentTask: state.currentTask,
        lastActive: state.lastActive
      },
      stats,
      thoughts,
      resume
    })
  } catch (error) {
    console.error('Error getting agent:', error)
    return NextResponse.json(
      { error: 'Failed to get agent info' },
      { status: 500 }
    )
  }
}
