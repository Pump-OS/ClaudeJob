import { NextResponse } from 'next/server'
import { addActivityLog } from '@/lib/storage'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { jobUrl, description } = body

    if (!jobUrl || !description) {
      return NextResponse.json(
        { error: 'Missing jobUrl or description' },
        { status: 400 }
      )
    }

    // Log the submission
    await addActivityLog({
      agentId: 'agent-001',
      type: 'job_found',
      message: `User submitted job: ${description.substring(0, 50)}...`,
      details: {
        jobUrl,
        description,
        source: 'user_submission'
      },
      timestamp: new Date()
    })

    // Here you would typically:
    // 1. Save to database
    // 2. Add to job queue for agent to process
    // 3. Notify agent about new job

    return NextResponse.json({
      success: true,
      message: 'Job submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting job:', error)
    return NextResponse.json(
      { error: 'Failed to submit job' },
      { status: 500 }
    )
  }
}


