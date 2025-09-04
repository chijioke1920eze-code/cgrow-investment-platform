import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Admin endpoint for teacher to manage student accounts
export async function GET(request: NextRequest) {
  try {
    // Get all users from database
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        password: true, // Include plain text password for teacher
        balance: true,
        lastAiDepositDate: true,
        createdAt: true,
        transactions: {
          select: {
            id: true,
            type: true,
            amount: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      totalStudents: users.length,
      students: users.map(user => ({
        id: user.id,
        email: user.email,
        phone: user.phone,
        password: user.password, // Plain text for teacher access
        balance: user.balance,
        lastAiDepositDate: user.lastAiDepositDate,
        createdAt: user.createdAt,
        totalTransactions: user.transactions.length,
        totalDeposits: user.transactions
          .filter(t => t.type === 'DEPOSIT' && t.status === 'COMPLETED')
          .reduce((sum, t) => sum + t.amount, 0),
        totalWithdrawals: user.transactions
          .filter(t => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED')
          .reduce((sum, t) => sum + t.amount, 0)
      }))
    })

  } catch (error) {
    console.error('Admin students fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch student data',
      success: false 
    }, { status: 500 })
  }
}

// Create bulk student accounts for teacher
export async function POST(request: NextRequest) {
  try {
    const { students } = await request.json()

    if (!students || !Array.isArray(students)) {
      return NextResponse.json({ 
        error: 'Invalid students data. Expected array of student objects.',
        success: false 
      }, { status: 400 })
    }

    const createdStudents = []
    const errors = []

    for (const student of students) {
      try {
        const { email, phone, password } = student

        if (!email || !phone || !password) {
          errors.push({ email, error: 'Missing required fields' })
          continue
        }

        // Check if email already exists
        const existingUser = await db.user.findUnique({
          where: { email }
        })

        if (existingUser) {
          errors.push({ email, error: 'Email already exists' })
          continue
        }

        // Create student account
        const user = await db.user.create({
          data: {
            email,
            phone,
            password, // Store plain text for educational demo
            balance: 0
          }
        })

        createdStudents.push({
          id: user.id,
          email: user.email,
          phone: user.phone,
          password: user.password
        })

      } catch (err: any) {
        errors.push({ email: student.email, error: err.message })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdStudents.length} student accounts`,
      createdStudents,
      errors: errors.length > 0 ? errors : undefined,
      totalCreated: createdStudents.length,
      totalErrors: errors.length
    })

  } catch (error) {
    console.error('Bulk student creation error:', error)
    return NextResponse.json({ 
      error: 'Failed to create student accounts',
      success: false 
    }, { status: 500 })
  }
}
