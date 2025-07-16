import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import CollectionEvent from '@/models/CollectionEvent'

export async function POST(request: NextRequest) {
  try {
    const { eventId, payerId } = await request.json()
    
    await dbConnect()
    
    const event = await CollectionEvent.findById(eventId)
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const payer = event.payers.id(payerId)
    if (!payer) {
      return NextResponse.json({ error: 'Payer not found' }, { status: 404 })
    }

    payer.state = 'pending_verification'
    payer.paymentTimestamp = new Date()
    
    await event.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark as paid' }, { status: 500 })
  }
}