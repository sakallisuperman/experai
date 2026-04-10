import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getUserAnalyses, getUserSubscription } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    }

    const [analyses, subscription] = await Promise.all([
      getUserAnalyses(userId, 50),
      getUserSubscription(userId),
    ])

    return NextResponse.json({
      analyses: analyses || [],
      subscription: subscription || { plan: 'free', status: 'active' },
    })
  } catch (err) {
    console.error('History error:', err)
    // Return empty data if DB not connected yet
    return NextResponse.json({
      analyses: [],
      subscription: { plan: 'free', status: 'active' },
    })
  }
}
