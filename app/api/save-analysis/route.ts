import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { saveAnalysis } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    }

    const body = await req.json()

    const analysis = await saveAnalysis({
      user_id: user.id,
      ...body,
    })

    return NextResponse.json({ success: true, id: analysis.id })
  } catch (err) {
    console.error('Save analysis error:', err)
    return NextResponse.json({ error: 'Kaydetme hatası' }, { status: 500 })
  }
}
