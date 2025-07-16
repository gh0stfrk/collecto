import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Collector from '@/models/Collector'
import { verifyPassword, createToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    await dbConnect()
    const collector = await Collector.findOne({ username })

    console.log(collector)
    
    if (!collector || !await verifyPassword(password, collector.passwordHash)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createToken({ username: collector.username })
    
    const response = NextResponse.json({ success: true })
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400
    })
    
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}