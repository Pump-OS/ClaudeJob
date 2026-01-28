import { NextResponse } from 'next/server'
import { runJobHuntingCycle } from '@/lib/claude-agent'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Allow up to 60 seconds for job hunting

export async function POST() {
  try {
    const result = await runJobHuntingCycle()
    
    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (error) {
    console.error('Error running job hunt:', error)
    return NextResponse.json(
      { error: 'Job hunting cycle failed', details: String(error) },
      { status: 500 }
    )
  }
}

