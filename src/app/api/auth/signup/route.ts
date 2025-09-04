import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, password } = await request.json()

    if (!email || !phone || !password) {
      return NextResponse.json({ error: 'Email, phone, and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const existingPhone = await db.user.findUnique({
      where: { phone }
    })

    if (existingPhone) {
      return NextResponse.json({ error: 'Phone number already exists' }, { status: 400 })
    }

    const user = await db.user.create({
      data: {
        email,
        phone,
        password: password, // Store plain text password for educational demo
        balance: 0
      }
    })

    // Generate JWT token for auto-login
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({ 
      message: 'Account created successfully! Welcome to CGrow!',
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
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}