import { NextResponse } from 'next/server'
import { getActivityLogs } from '@/lib/storage'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const logs = await getActivityLogs(limit)
    
    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Error getting activity logs:', error)
    return NextResponse.json(
      { error: 'Failed to get activity logs' },
      { status: 500 }
    )
  }
}

