import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Fake login for demo purposes
    if (email === '1@gmail.com' && password === '1234') {
      const fakeUser = {
        id: 'fake-user-id',
        email: '1@gmail.com',
        phone: '+237 123 456 789',
        balance: 231305, // Starting balance for demo
        lastAiDepositDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago for testing
      }

      const token = jwt.sign(
        { userId: fakeUser.id, email: fakeUser.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      return NextResponse.json({
        message: 'Login successful',
        token,
        user: {
          id: fakeUser.id,
          email: fakeUser.email,
          phone: fakeUser.phone,
          balance: fakeUser.balance,
          lastAiDepositDate: fakeUser.lastAiDepositDate
        }
      })
    }

    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (password !== user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        lastAiDepositDate: user.lastAiDepositDate
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}