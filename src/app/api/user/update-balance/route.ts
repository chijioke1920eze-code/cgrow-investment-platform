import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    // Handle fake user
    if (decoded.userId === 'fake-user-id') {
      return NextResponse.json({
        user: {
          id: 'fake-user-id',
          email: '1@gmail.com',
          phone: '+237 123 456 789',
          balance: 231305,
          lastAiDepositDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago for testing
        }
      })
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        lastAiDepositDate: user.lastAiDepositDate
      }
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const { balance } = await request.json()

    if (typeof balance !== 'number' || balance < 0) {
      return NextResponse.json({ error: 'Invalid balance amount' }, { status: 400 })
    }

    // Update user balance in database
    const updatedUser = await db.user.update({
      where: { id: decoded.userId },
      data: { balance: Math.round(balance * 100) / 100 } // Round to 2 decimal places
    })

    console.log('User balance updated:', {
      userId: decoded.userId,
      oldBalance: updatedUser.balance,
      newBalance: balance,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ 
      message: 'Balance updated successfully',
      balance: updatedUser.balance
    })

  } catch (error) {
    console.error('Update balance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
