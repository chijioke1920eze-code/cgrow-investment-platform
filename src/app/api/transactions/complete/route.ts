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
    const { transactionId, aiVerification } = await request.json()

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    const transaction = await db.transaction.findFirst({
      where: { 
        id: transactionId,
        userId: decoded.userId,
        status: 'PENDING'
      }
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found or already completed' }, { status: 404 })
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updateData: any = { status: 'COMPLETED' }
    
    // Store reference ID if provided by AI verification
    if (aiVerification?.extractedReferenceId) {
      updateData.referenceId = aiVerification.extractedReferenceId
      console.log('Storing reference ID:', aiVerification.extractedReferenceId, 'for transaction:', transactionId)
    }

    const updatedTransaction = await db.transaction.update({
      where: { id: transactionId },
      data: updateData
    })

    // For DEPOSIT transactions with AI verification, set withdrawal restriction
    const updateUserData: any = { balance: user.balance + transaction.amount }
    if (transaction.type === 'DEPOSIT' && aiVerification?.success) {
      updateUserData.lastAiDepositDate = new Date()
    }

    const updatedUser = await db.user.update({
      where: { id: decoded.userId },
      data: updateUserData
    })

    return NextResponse.json({ 
      message: 'Transaction completed successfully',
      newBalance: updatedUser.balance,
      transaction: updatedTransaction
    })

  } catch (error) {
    console.error('Complete transaction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}