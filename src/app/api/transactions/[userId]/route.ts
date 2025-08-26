import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    if (decoded.userId !== params.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Handle fake user - return empty transactions for demo
    if (decoded.userId === 'fake-user-id') {
      return NextResponse.json({ transactions: [] })
    }

    const transactions = await db.transaction.findMany({
      where: { userId: params.userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ transactions })

  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}