import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import dbConnect from '@/lib/mongodb'
import CollectionEvent from '@/models/CollectionEvent'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { eventId, payerId } = await request.json()
    
    await dbConnect()
    
    const event = await CollectionEvent.findById(eventId).populate('collectorId')
    if (!event || event.collectorId.username !== payload.username) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const payer = event.payers.id(payerId)
    if (!payer) {
      return NextResponse.json({ error: 'Payer not found' }, { status: 404 })
    }

    payer.state = 'not_paid'
    payer.paymentTimestamp = undefined
    payer.verificationTimestamp = undefined
    
    await event.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reject payment' }, { status: 500 })
  }
}