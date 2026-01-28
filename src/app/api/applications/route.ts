import { NextResponse } from 'next/server'
import { getApplications, updateApplicationStatus } from '@/lib/storage'

export async function GET() {
  try {
    const applications = getApplications()
    
    // Sort by date, most recent first
    applications.sort((a, b) => 
      new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    )
    
    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error getting applications:', error)
    return NextResponse.json(
      { error: 'Failed to get applications' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { applicationId, status, responseMessage } = body
    
    if (!applicationId || !status) {
      return NextResponse.json(
        { error: 'Missing applicationId or status' },
        { status: 400 }
      )
    }
    
    const updated = updateApplicationStatus(applicationId, status, responseMessage)
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ application: updated })
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}
