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

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid withdrawal amount' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    // Check AI deposit restriction (14 days from last AI-verified deposit)
    if (user.lastAiDepositDate) {
      const daysSinceAiDeposit = (Date.now() - new Date(user.lastAiDepositDate).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceAiDeposit < 14) {
        const daysLeft = Math.ceil(14 - daysSinceAiDeposit)
        return NextResponse.json({ 
          error: `Withdrawal restricted. ${daysLeft} days remaining since AI-verified deposit.`,
          daysLeft,
          restrictionType: 'AI_DEPOSIT_RESTRICTION'
        }, { status: 400 })
      }
    }

    const transaction = await db.transaction.create({
      data: {
        type: 'WITHDRAWAL',
        amount: amount,
        status: 'COMPLETED',
        userId: decoded.userId
      }
    })

    const updatedUser = await db.user.update({
      where: { id: decoded.userId },
      data: { balance: user.balance - amount }
    })

    return NextResponse.json({ 
      message: 'Withdrawal successful',
      newBalance: updatedUser.balance,
      transaction
    })

  } catch (error) {
    console.error('Withdrawal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}