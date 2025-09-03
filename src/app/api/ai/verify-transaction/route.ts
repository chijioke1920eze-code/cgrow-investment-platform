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

    // Use OpenRouter API for real AI verification
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://unknown-app.com',
        'X-Title': 'Payment Verification System'
      },
      body: JSON.stringify({
        model: 'qwen/qwen2.5-vl-72b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: userPrompt },
              { 
                type: 'image_url', 
                image_url: { url: image }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    })

    if (!openRouterResponse.ok) {
      console.error('OpenRouter API error:', {
        status: openRouterResponse.status,
        statusText: openRouterResponse.statusText,
        url: openRouterResponse.url
      })
      
      // Strict verification - fail if API doesn't work
      return NextResponse.json({
        success: false,
        confidence: 0,
        detected: {
          phoneNumber: false,
          transactionRef: false,
          amount: false,
          airtelMoney: false
        },
        warnings: ['AI verification system unavailable. Please try again later.'],
        riskScore: 100
      }, { status: 500 })
    }

    const aiResponse = await openRouterResponse.json()
    const aiAnalysis = aiResponse.choices[0]?.message?.content

    console.log('AI Verification Analysis:', {
      expectedAmount,
      userBalance,
      rawResponse: aiAnalysis,
      timestamp: new Date().toISOString()
    })

    try {
      // Parse AI response as JSON
      const result = JSON.parse(aiAnalysis)
      
      console.log('Parsed AI Result:', {
        success: result.success,
        confidence: result.confidence,
        riskScore: result.riskScore,
        detected: result.detected,
        warnings: result.warnings,
        extractedReferenceId: result.extractedReferenceId
      })
      
      // Check if reference ID has been used before (only if AI verification passed)
      if (result.success && result.extractedReferenceId) {
        console.log('Checking reference ID uniqueness:', result.extractedReferenceId)
        
        // Check for existing reference ID using raw query to avoid type issues
        const existingTransaction = await db.$queryRaw`
          SELECT * FROM Transaction 
          WHERE referenceId = ${result.extractedReferenceId} 
          AND status = 'COMPLETED' 
          LIMIT 1
        ` as any[]
        
        if (existingTransaction.length > 0) {
          const existing = existingTransaction[0]
          console.log('Reference ID already used:', {
            existingTransactionId: existing.id,
            existingUserId: existing.userId,
            amount: existing.amount,
            date: existing.createdAt
          })
          
          return NextResponse.json({
            success: false,
            confidence: 0,
            detected: result.detected,
            warnings: ['⚠️ FRAUD ALERT: This transaction reference has already been used. Each mobile money transaction can only be used once.'],
            riskScore: 100,
            extractedReferenceId: result.extractedReferenceId
          })
        }
      }
      
      // Enhance result with encouraging messages for successful verification
      if (result.success) {
        result.successMessage = "🎉 Excellent! Your payment has been verified successfully!"
      }

      return NextResponse.json(result)
    } catch (parseError: any) {
      console.error('Failed to parse AI response as JSON:', {
        parseError: parseError.message,
        rawResponse: aiAnalysis,
        expectedAmount: expectedAmount
      })
      
      // Strict verification - fail if AI response is invalid
      return NextResponse.json({
        success: false,
        confidence: 0,
        detected: {
          phoneNumber: false,
          transactionRef: false,
          amount: false,
          airtelMoney: false
        },
        warnings: ['AI analysis failed to provide valid verification result. Please ensure image is clear and genuine.'],
        riskScore: 95
      }, { status: 400 })
    }

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
