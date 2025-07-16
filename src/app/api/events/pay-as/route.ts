import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import CollectionEvent from '@/models/CollectionEvent'

export async function POST(request: NextRequest) {
  try {
    const { eventId, payerName } = await request.json()
    
    await dbConnect()
    
    const event = await CollectionEvent.findById(eventId)
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if payer already exists
    const existingPayer = event.payers.find((p: any) => p.name.toLowerCase() === payerName.toLowerCase())
    
    if (existingPayer) {
      // Update existing payer
      existingPayer.state = 'pending_verification'
      existingPayer.paymentTimestamp = new Date()
    } else {
      // Add new payer
      event.payers.push({
        name: payerName,
        state: 'pending_verification',
        paymentTimestamp: new Date()
      })
    }
    
    await event.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
  }
}