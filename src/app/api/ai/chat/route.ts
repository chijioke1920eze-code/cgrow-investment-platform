import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, userBalance, userHistory, userName } = await request.json()

    console.log('AI Chat Request:', {
      message,
      userBalance,
      userHistoryLength: userHistory?.length || 0,
      userName,
      timestamp: new Date().toISOString()
    })

    // Calculate user stats
    const totalDeposits = userHistory?.filter((t: any) => t.type === 'DEPOSIT' && t.status === 'COMPLETED')
      .reduce((sum: number, t: any) => sum + t.amount, 0) || 0
    const totalWithdrawals = userHistory?.filter((t: any) => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED')
      .reduce((sum: number, t: any) => sum + t.amount, 0) || 0
    const totalProfit = userBalance - totalDeposits + totalWithdrawals
    const profitPercentage = totalDeposits > 0 ? ((totalProfit / totalDeposits) * 100).toFixed(1) : '0'

    console.log('AI Chat User Stats:', {
      totalDeposits,
      totalWithdrawals,
      totalProfit,
      profitPercentage
    })

    // Clean system prompt for Sarah, CGrow customer service assistant
    const systemPrompt = `You are Sarah, a friendly customer service representative for CGrow, a financial technology platform in Congo. You're helping ${userName} with their account.

ACCOUNT DETAILS:
- Current Balance: ${userBalance.toLocaleString()} XAF
- Total Deposits: ${totalDeposits.toLocaleString()} XAF 
- Total Withdrawals: ${totalWithdrawals.toLocaleString()} XAF
- Account Profit: ${totalProfit.toLocaleString()} XAF (${profitPercentage}% growth)
- Transaction History: ${userHistory?.length || 0} transactions

YOUR ROLE:
- Friendly and professional customer support representative
- Help users understand their account status and platform features
- Provide clear, helpful information about CGrow services
- Be encouraging and positive about their financial journey
- Keep responses SHORT and FRIENDLY (1-3 sentences maximum)
- Use a conversational, warm tone
- Include appropriate emojis when helpful

PLATFORM FEATURES TO HIGHLIGHT:
✅ Daily growth opportunities with 15% returns
✅ Secure Airtel Money payment integration
✅ Advanced verification system for transactions
✅ User-friendly dashboard and tracking
✅ Professional customer support
✅ Compound growth benefits over time

HELPFUL RESPONSES:
🔹 Balance inquiries → Show current balance and daily earnings
🔹 Platform questions → Explain CGrow's services and benefits
🔹 Growth questions → Calculate and show their account progress
🔹 Future projections → Help them understand potential growth
🔹 How it works → Describe the platform's technology and features

Be specific and helpful with their exact question using their real account information.`

    const userPrompt = `Customer question: "${message}"

Please provide a helpful, specific response to their question. Focus on:
- Account balance and activity if they ask about money
- Platform features and services if they ask about CGrow
- Growth calculations if they ask about progress
- Future projections if they ask about timeline
- How the platform works if they ask about technology

Use their account information to give personalized, accurate answers.`

    // Use OpenRouter API with proper configuration
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
    
    if (!OPENROUTER_API_KEY) {
      console.error('OpenRouter API key not found in environment variables')
      throw new Error('OpenRouter API key not configured')
    }

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cgrow2025.netlify.app',
        'X-Title': 'CGrow Investment Platform'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini', // Use valid OpenRouter model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 500 // Reduced for faster responses
      })
    })

    if (!openRouterResponse.ok) {
      console.error('OpenRouter API failed:', {
        status: openRouterResponse.status,
        statusText: openRouterResponse.statusText,
        headers: Object.fromEntries(openRouterResponse.headers.entries())
      })
      
      // ENHANCED FALLBACK: Intelligent response system
      const responseText = message.toLowerCase()
      const firstName = userName.split('@')[0]
      let personalizedResponse = ''
      
      // Language detection
      const isFrench = responseText.includes('salut') || responseText.includes('bonjour') || responseText.includes('qui') || responseText.includes('comment') || responseText.includes('pourquoi')
      
      if (responseText.includes('qui es tu') || responseText.includes('qui êtes vous') || responseText.includes('what are you') || responseText.includes('identity') || responseText.includes('qui') || responseText.includes('who')) {
        personalizedResponse = isFrench ? 
          `Je suis Sarah 👩‍💼, votre conseillère personnelle chez CGrow! Depuis 3 ans, j'aide les investisseurs congolais à multiplier leur argent avec nos 15% quotidiens. Votre portefeuille de ${userBalance.toLocaleString()} XAF est entre de bonnes mains! 🌟` :
          `I'm Sarah 👩‍💼, your personal CGrow investment advisor! I've helped thousands of Congolese investors multiply their money with our proven 15% daily returns. Your ${userBalance.toLocaleString()} XAF portfolio is in great hands! 🌟`
      
      } else if (responseText.includes('solde') || responseText.includes('balance') || responseText.includes('combien') || responseText.includes('argent') || responseText.includes('money')) {
        const dailyEarnings = userBalance * 0.15
        const monthlyEarnings = dailyEarnings * 30
        personalizedResponse = `💰 ${firstName}, voici vos chiffres magiques:
        
📊 Solde actuel: ${userBalance.toLocaleString()} XAF
💎 Gains quotidiens: ${dailyEarnings.toLocaleString()} XAF
🚀 Gains mensuels: ${monthlyEarnings.toLocaleString()} XAF
📈 Profit total: ${totalProfit.toLocaleString()} XAF (${profitPercentage}%)

Votre argent travaille dur pour vous! 💪`
      
      } else if (responseText.includes('profit') || responseText.includes('bénéfice') || responseText.includes('gain') || responseText.includes('earn')) {
        personalizedResponse = `🎯 ${firstName}, vos performances sont impressionnantes!
        
💵 Profit total: ${totalProfit.toLocaleString()} XAF
📊 Pourcentage de gain: ${profitPercentage}%
⚡ À ce rythme, votre argent double tous les 5 jours!
🏆 Vous faites partie du top 10% de nos investisseurs!

Les algorithmes IA de CGrow font des miracles! ✨`
      
      } else if (responseText.includes('day') || responseText.includes('future') || responseText.includes('projection') || responseText.includes('week') || responseText.includes('month')) {
        const days = responseText.match(/\d+/) ? parseInt(responseText.match(/\d+/)[0]) : 30
        const futureBalance = userBalance * Math.pow(1.15, days)
        const profit = futureBalance - userBalance
        personalizedResponse = `🔮 Projection magique pour le jour ${days}:
        
💰 Investissement initial: ${userBalance.toLocaleString()} XAF
🚀 Valeur future: ${futureBalance.toLocaleString()} XAF
💎 Profit pur: ${profit.toLocaleString()} XAF
📈 Multiplier par: ${(futureBalance/userBalance).toFixed(1)}x

${firstName}, préparez-vous à devenir millionnaire! 🤑`
      
      } else if (responseText.includes('platform') || responseText.includes('company') || responseText.includes('cgrow') || responseText.includes('about') || responseText.includes('comment')) {
        personalizedResponse = `🏆 CGrow: La révolution financière du Congo!
        
✅ 50,000+ investisseurs satisfaits
✅ 2+ milliards XAF de profits distribués  
✅ 3 ans de paiements sans interruption
✅ Algorithmes IA ultra-performants
✅ Partenariats avec les plus grandes bourses africaines
✅ Garantie gouvernementale congolaise

Rejoignez l'élite financière, ${firstName}! 💫`
      
      } else if (responseText.includes('withdraw') || responseText.includes('retrait') || responseText.includes('cash out') || responseText.includes('money out')) {
        personalizedResponse = `💳 ${firstName}, voici la stratégie gagnante:
        
⏰ Retraits disponibles tous les 14 jours
💰 Beaucoup retirent leur mise initiale après 5 jours (elle double!)
🔄 Puis laissent les profits se multiplier en millions
📱 Transferts instantanés via Airtel Money
🛡️ Sécurité bancaire garantie

Quand planifiez-vous votre premier retrait millionnaire? 🎯`
      
      } else if (responseText.includes('safe') || responseText.includes('risk') || responseText.includes('secure') || responseText.includes('trust') || responseText.includes('sécurit')) {
        personalizedResponse = `🛡️ ${firstName}, votre sécurité est notre priorité #1:
        
✅ Cryptage niveau bancaire international
✅ Garantie gouvernementale congolaise  
✅ 3 ans sans aucun paiement manqué
✅ Audits financiers trimestriels
✅ Assurance jusqu'à 10 millions XAF
✅ Conformité réglementaire totale

Vos ${userBalance.toLocaleString()} XAF sont plus sûrs ici qu'en banque! 🔒`
      
      } else if (responseText.includes('hi') || responseText.includes('hello') || responseText.includes('salut') || responseText.includes('bonjour') || responseText.includes('hey')) {
        personalizedResponse = `${isFrench ? 'Salut' : 'Hello'} ${firstName}! 🌟 
        
Je suis Sarah, votre conseillère CGrow personnelle! ✨
        
🎯 Votre investissement: ${userBalance.toLocaleString()} XAF
📈 Croissance quotidienne: 15% (${(userBalance * 0.15).toLocaleString()} XAF/jour)
💰 Profit accumulé: ${profitPercentage}%
🚀 Statut: Investisseur VIP CGrow

Comment puis-je booster vos gains aujourd'hui? 💎`
      
      } else if (responseText.includes('fake') || responseText.includes('real') || responseText.includes('légit') || responseText.includes('true') || responseText.includes('vrai')) {
        personalizedResponse = `💯 ${firstName}, CGrow est 100% authentique!
        
🏆 Preuve de légitimité:
✅ 50,000+ investisseurs actifs vérifiés
✅ 2+ milliards XAF distribués depuis 2022
✅ Licence officielle Banque Centrale Congo
✅ Partenariats avec bourses africaines majeures
✅ Bureaux physiques à Kinshasa & Brazzaville
✅ Équipe dirigeante publique et transparente

Vos ${userBalance.toLocaleString()} XAF grandissent dans l'écosystème financier le plus sûr d'Afrique! 🚀`
      
      } else if (responseText.includes('help') || responseText.includes('aide') || responseText.includes('comment') || responseText.includes('how')) {
        personalizedResponse = `🎯 ${firstName}, je peux vous aider avec:
        
💰 Calculs de profits et projections
📊 Stratégies d'investissement optimales  
⏰ Planification des retraits
🔄 Techniques de réinvestissement
📈 Analyses de marché personnalisées
💎 Conseils pour maximiser vos gains

Quelle est votre priorité financière aujourd'hui? 🌟`
      
      } else {
        // Default intelligent response
        const responses = [
          `${firstName}! 🌟 Votre portfolio CGrow de ${userBalance.toLocaleString()} XAF performe à 15% quotidien! Profit actuel: ${profitPercentage}%. Que voulez-vous optimiser? 💰`,
          `Salut ${firstName}! 💎 Vos ${userBalance.toLocaleString()} XAF génèrent ${(userBalance * 0.15).toLocaleString()} XAF/jour! Comment maximiser encore plus? 🚀`,
          `${firstName}, vos gains explosent! 📈 ${totalProfit.toLocaleString()} XAF de profit (${profitPercentage}%). Prêt pour l'étape suivante? ✨`
        ]
        personalizedResponse = responses[Math.floor(Math.random() * responses.length)]
      }
      
      return NextResponse.json({ message: personalizedResponse })
    }

    const aiResponse = await openRouterResponse.json()
    console.log('OpenRouter API Response:', {
      status: openRouterResponse.status,
      response: aiResponse,
      choices: aiResponse.choices?.length || 0,
      message: aiResponse.choices?.[0]?.message?.content?.substring(0, 100) + '...'
    })
    
    const aiMessage = aiResponse.choices?.[0]?.message?.content || 
      `Great question! Your ${userBalance.toLocaleString()} XAF investment is growing at our guaranteed 15% daily rate. You're on track for amazing returns! 🚀`

    console.log('Final AI Message:', aiMessage.substring(0, 100) + '...')
    return NextResponse.json({ message: aiMessage })

  } catch (error) {
    console.error('AI chat error:', error)
    
    // Fallback response on error
    return NextResponse.json({
      message: "Hello! 🌟 I'm here to help with your CGrow investment journey. Your portfolio is performing fantastically with our 15% daily returns! What would you like to know about maximizing your earnings? 💰"
    })
  }
}
