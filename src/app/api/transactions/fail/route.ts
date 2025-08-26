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
    const { transactionId } = await request.json()

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    // Find the transaction and verify ownership
    const transaction = await db.transaction.findFirst({
      where: { 
        id: transactionId,
        userId: decoded.userId,
        status: 'PENDING'
      }
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found or already processed' }, { status: 404 })
    }

    // Mark transaction as failed
    const updatedTransaction = await db.transaction.update({
      where: { id: transactionId },
      data: { status: 'FAILED' }
    })

    console.log('Transaction marked as failed:', {
      transactionId,
      userId: decoded.userId,
      amount: transaction.amount,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ 
      message: 'Transaction marked as failed',
      transaction: updatedTransaction
    })

  } catch (error) {
    console.error('Fail transaction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
