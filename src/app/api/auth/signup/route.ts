import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

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

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        email,
        phone,
        password: hashedPassword,
        balance: 0
      }
    })

    return NextResponse.json({ 
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        balance: user.balance
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}