import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import dbConnect from '@/lib/mongodb'
import CollectionEvent from '@/models/CollectionEvent'
import Collector from '@/models/Collector'
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

    const { title, description, amount, payers } = await request.json()
    
    await dbConnect()
    const collector = await Collector.findOne({ username: payload.username })
    
    if (!collector) {
      return NextResponse.json({ error: 'Collector not found' }, { status: 404 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    const event = new CollectionEvent({
      title,
      description,
      amount,
      slug,
      collectorId: collector._id,
      payers,
      status: 'published'
    })

    await event.save()

    return NextResponse.json({ 
      success: true, 
      slug, 
      collectorName: collector.username 
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}