import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const { amount } = await request.json()

    if (!amount || amount < 1000) {
      return NextResponse.json({ error: 'Minimum deposit amount is 1,000 XAF' }, { status: 400 })
    }

    const transaction = await db.transaction.create({
      data: {
        type: 'DEPOSIT',
        amount: amount,
        status: 'PENDING',
        userId: decoded.userId
      }
    })

    return NextResponse.json({ 
      message: 'Deposit initiated successfully',
      transaction
    })

  } catch (error) {
    console.error('Deposit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}