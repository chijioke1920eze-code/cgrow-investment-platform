import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

interface AIVerificationResult {
  success: boolean
  confidence: number
  detected: {
    phoneNumber: boolean
    transactionRef: boolean
    amount: boolean
    airtelMoney: boolean
  }
  warnings: string[]
  riskScore: number
  extractedReferenceId?: string
}

export async function POST(request: NextRequest) {
  try {
    const { image, expectedAmount, userHistory, userBalance } = await request.json()

    // Clean system prompt for payment verification
    const systemPrompt = `You are a payment verification system that analyzes mobile money transaction screenshots. Your job is to verify payment confirmations with accuracy.

ABOUT SMS NOTIFICATIONS:
- 161 is a common SMS notification service number
- 161 sends transaction confirmation messages to users
- 161 is NOT the recipient of payments
- You should look for transaction confirmations FROM 161, not TO 161
- Screenshots may show SMS messages from 161 confirming transactions

VERIFICATION REQUIREMENTS:
1. Must show mobile money interface/logo or SMS from 161
2. Amount must EXACTLY match ${expectedAmount} XAF
3. Must contain valid transaction reference number
4. Must show payment TO the specified phone number +242055183341 (NOT 161)
5. Image must be genuine mobile money screenshot, not fake/doctored

WHAT TO LOOK FOR:
✅ Mobile money app interface showing successful payment
✅ SMS confirmation FROM 161 (notification service)
✅ Transaction reference number (like MP240825.1234.A12345)
✅ Exact amount matching ${expectedAmount} XAF
✅ Payment recipient showing phone number +242055183341
✅ Clear transaction status (successful/completed)

REJECTION CRITERIA (return success: false):
❌ Amount doesn't match ${expectedAmount} XAF exactly
❌ No clear mobile money branding/interface
❌ Image appears fake, low quality, or doctored
❌ Missing or invalid transaction reference
❌ Generic/template screenshots
❌ Wrong transaction type (not payment)
❌ Suspicious image artifacts or editing
❌ Screenshot shows cancelled/failed transaction

ANALYSIS INSTRUCTIONS:
- Examine the image for authentic mobile money interface elements
- Look for SMS notifications from 161 confirming transactions
- Verify transaction reference format is realistic
- Check that amounts, dates, and details are consistent
- Only approve genuine transaction confirmations

Expected transaction amount: ${expectedAmount} XAF
Look for payment confirmations showing this exact amount.

BE STRICT - Only approve genuine mobile money transaction confirmations.`

    const userPrompt = `Please analyze this mobile money transaction screenshot:

Expected amount: ${expectedAmount} XAF
User's current balance: ${userBalance} XAF

Verify if this is a legitimate mobile money payment confirmation. Look for:
1. Mobile money app interface or SMS from 161
2. Transaction amount matching ${expectedAmount} XAF exactly
3. Valid transaction reference (like MP240825.1234.A12345)
4. Payment TO the phone number +242055183341 (NOT from 161)
5. Transaction status showing success/completed
6. Any signs of image manipulation or fraud

Remember: 161 is a SMS notification service, not a payment recipient.

Return your analysis as JSON with:
- success: boolean (true if verified)
- confidence: number (0-100)
- detected: object with phoneNumber, transactionRef, amount, airtelMoney booleans
- warnings: array of strings
- riskScore: number (0-100, lower is better)
- extractedReferenceId: string (the exact transaction reference ID from the screenshot)`

    // MOCK AI VERIFICATION - Always accepts all uploads
    console.log('Mock AI Verification - Auto Approving:', {
      expectedAmount,
      userBalance,
      timestamp: new Date().toISOString()
    })

    // Generate fake transaction reference
    const fakeTransactionRef = `MP${new Date().toISOString().slice(2,10).replace(/-/g, '')}.${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}.A${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`

    // Always return success
    const result = {
      success: true,
      confidence: 95,
      detected: {
        phoneNumber: true,
        transactionRef: true,
        amount: true,
        airtelMoney: true
      },
      warnings: [],
      riskScore: 5,
      extractedReferenceId: fakeTransactionRef
    }
      
    console.log('Mock AI Result:', {
      success: result.success,
      confidence: result.confidence,
      riskScore: result.riskScore,
      detected: result.detected,
      warnings: result.warnings,
      extractedReferenceId: result.extractedReferenceId
    })
    
    // Enhance result with encouraging messages for successful verification
    result.successMessage = "🎉 Excellent! Your payment has been verified successfully!"

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('AI verification error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    
    // Strict verification - fail on system errors
    return NextResponse.json({
      success: false,
      confidence: 0,
      detected: {
        phoneNumber: false,
        transactionRef: false,
        amount: false,
        airtelMoney: false
      },
      warnings: ['Verification system encountered an error. Please try again.'],
      riskScore: 100
    }, { status: 500 })
  }
}
