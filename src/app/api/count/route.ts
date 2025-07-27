import { NextResponse } from 'next/server'
import { waitlistOperations } from '@/lib/supabase'
import { CountResponse } from '@/lib/types'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const count = await waitlistOperations.getSignupCount()
    
    const response: CountResponse = {
      success: true,
      message: 'Signup count retrieved successfully',
      data: { count }
    }
    
    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'CDN-Cache-Control': 'public, s-maxage=60',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=60'
      }
    })
  } catch (error) {
    console.error('Error fetching signup count:', error)
    
    const response: CountResponse = {
      success: false,
      message: 'Failed to fetch signup count',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
    
    return NextResponse.json(response, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}