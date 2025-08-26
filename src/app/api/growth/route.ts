import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const GROWTH_RATE = 0.15 // 15% daily growth

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    // Handle fake user
    if (decoded.userId === 'fake-user-id') {
      const fakeUserBalance = 231305 // Current fake balance
      const growthAmount = fakeUserBalance * GROWTH_RATE
      const newBalance = fakeUserBalance + growthAmount
      
      return NextResponse.json({ 
        message: 'Daily growth applied successfully',
        oldBalance: fakeUserBalance,
        newBalance: newBalance,
        growthAmount,
        growthRate: GROWTH_RATE,
        nextGrowthTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
      })
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the last investment log for this user
    const lastInvestmentLog = await db.investmentLog.findFirst({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' }
    })

    const now = new Date()
    let shouldApplyGrowth = false

    if (!lastInvestmentLog) {
      // If no investment log exists, check if user has a balance and account is older than 24 hours
      const accountAge = now.getTime() - new Date(user.createdAt).getTime()
      if (user.balance > 0 && accountAge >= 24 * 60 * 60 * 1000) {
        shouldApplyGrowth = true
      }
    } else {
      // Check if at least 24 hours have passed since the last growth
      const timeSinceLastGrowth = now.getTime() - new Date(lastInvestmentLog.createdAt).getTime()
      if (timeSinceLastGrowth >= 24 * 60 * 60 * 1000) {
        shouldApplyGrowth = true
      }
    }

    if (!shouldApplyGrowth) {
      return NextResponse.json({ 
        message: 'No growth to apply at this time',
        currentBalance: user.balance,
        nextGrowthTime: lastInvestmentLog 
          ? new Date(new Date(lastInvestmentLog.createdAt).getTime() + 24 * 60 * 60 * 1000)
          : new Date(new Date(user.createdAt).getTime() + 24 * 60 * 60 * 1000)
      })
    }

    const oldBalance = user.balance
    const growthAmount = oldBalance * GROWTH_RATE
    const newBalance = oldBalance + growthAmount

    // Update user balance
    const updatedUser = await db.user.update({
      where: { id: decoded.userId },
      data: { balance: newBalance }
    })

    // Log the growth
    await db.investmentLog.create({
      data: {
        userId: decoded.userId,
        oldBalance: oldBalance,
        newBalance: newBalance,
        growthRate: GROWTH_RATE
      }
    })

    return NextResponse.json({ 
      message: 'Daily growth applied successfully',
      oldBalance,
      newBalance,
      growthAmount,
      growthRate: GROWTH_RATE,
      nextGrowthTime: new Date(now.getTime() + 24 * 60 * 60 * 1000)
    })

  } catch (error) {
    console.error('Growth application error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    // Handle fake user
    if (decoded.userId === 'fake-user-id') {
      const now = new Date()
      const nextGrowthTime = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      const timeUntilNextGrowth = 0 // Allow immediate growth for demo
      const hoursUntilNextGrowth = 0
      const minutesUntilNextGrowth = 0
      
      return NextResponse.json({ 
        currentBalance: 231305,
        nextGrowthTime,
        timeUntilNextGrowth,
        hoursUntilNextGrowth,
        minutesUntilNextGrowth,
        canApplyGrowth: true,
        recentGrowth: [],
        growthRate: GROWTH_RATE
      })
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const lastInvestmentLog = await db.investmentLog.findFirst({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' }
    })

    const now = new Date()
    let nextGrowthTime: Date

    if (!lastInvestmentLog) {
      nextGrowthTime = new Date(new Date(user.createdAt).getTime() + 24 * 60 * 60 * 1000)
    } else {
      nextGrowthTime = new Date(new Date(lastInvestmentLog.createdAt).getTime() + 24 * 60 * 60 * 1000)
    }

    const timeUntilNextGrowth = Math.max(0, nextGrowthTime.getTime() - now.getTime())
    const hoursUntilNextGrowth = Math.floor(timeUntilNextGrowth / (60 * 60 * 1000))
    const minutesUntilNextGrowth = Math.floor((timeUntilNextGrowth % (60 * 60 * 1000)) / (60 * 1000))

    const investmentLogs = await db.investmentLog.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json({ 
      currentBalance: user.balance,
      nextGrowthTime,
      timeUntilNextGrowth,
      hoursUntilNextGrowth,
      minutesUntilNextGrowth,
      canApplyGrowth: timeUntilNextGrowth === 0,
      recentGrowth: investmentLogs,
      growthRate: GROWTH_RATE
    })

  } catch (error) {
    console.error('Growth info error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}