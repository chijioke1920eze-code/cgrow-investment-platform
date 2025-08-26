'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Scale, Shield, Globe, DollarSign, Clock } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Scale className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <Badge className="mt-4 bg-red-900/50 text-red-300 border-red-700">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Please read carefully before using this service
          </Badge>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card className="border-0 shadow-lg bg-black/80 backdrop-blur-sm border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Globe className="w-6 h-6 text-blue-400" />
                <span>Introduction and Important Notice</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                Welcome to CGrow ("the Service"). By accessing or using our Service, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing the Service.
              </p>
              
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 mt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                  <h3 className="text-xl font-bold text-red-300">CRITICAL DISCLAIMER</h3>
                </div>
                <p className="text-red-200 font-medium leading-relaxed">
                  <strong>THIS SITE IS PROVIDED AS A PRANK OR OPEN SOURCE TEMPLATE ONLY.</strong> CGrow is not a registered financial institution, investment platform, or money service business. This website is created for educational, entertainment, and demonstration purposes only.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* No Financial Services */}
          <Card className="border-0 shadow-lg bg-black/80 backdrop-blur-sm border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                <span>No Financial Services Provided</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                CGrow does NOT provide any of the following services:
              </p>
              <ul className="text-white/80 space-y-2 ml-6">
                <li className="flex items-start space-x-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Investment services or financial advice</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Money transmission or payment processing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Custody of funds or digital assets</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Banking or financial institution services</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>Investment opportunities with guaranteed returns</span>
                </li>
              </ul>
              
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mt-4">
                <p className="text-yellow-200 font-medium">
                  <strong>ANY ATTEMPT TO SEND MONEY OR FUNDS TO ANYONE THROUGH THIS PLATFORM IS DONE ENTIRELY AT YOUR OWN RISK.</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibility */}
          <Card className="border-0 shadow-lg bg-black/80 backdrop-blur-sm border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="w-6 h-6 text-purple-400" />
                <span>User Responsibility and Liability</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                By using this Service, you acknowledge and agree to the following:
              </p>
              
              <div className="space-y-4">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Financial Loss Disclaimer</h4>
                  <p className="text-white/80">
                    <strong>WE WILL NOT BE RESPONSIBLE FOR ANY FINANCIAL LOSSES, DAMAGES, OR HARM RESULTING FROM YOUR USE OF THIS SERVICE.</strong> Any money sent to any individual, organization, or entity through this platform is your sole responsibility. We do not verify, endorse, or guarantee any transactions or recipients.
                  </p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">No Recourse or Compensation</h4>
                  <p className="text-white/80">
                    You understand and agree that we provide no warranties, guarantees, or recourse for any lost funds, failed transactions, or financial damages. All financial interactions are conducted at your own risk.
                  </p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Legal Compliance</h4>
                  <p className="text-white/80">
                    You are solely responsible for complying with all applicable laws, regulations, and financial authority requirements in your jurisdiction. This includes but is not limited to anti-money laundering (AML) laws, know your customer (KYC) requirements, and financial regulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Compliance */}
          <Card className="border-0 shadow-lg bg-black/80 backdrop-blur-sm border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Scale className="w-6 h-6 text-yellow-400" />
                <span>Legal Compliance and Jurisdiction</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                This Service operates in compliance with applicable laws and regulations:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Applicable Laws</h4>
                  <ul className="text-white/80 space-y-1 text-sm">
                    <li>• Financial Services Regulations</li>
                    <li>• Consumer Protection Laws</li>
                    <li>• Electronic Transaction Laws</li>
                    <li>• Anti-Fraud Legislation</li>
                    <li>• Securities and Exchange Regulations</li>
                  </ul>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">User Obligations</h4>
                  <ul className="text-white/80 space-y-1 text-sm">
                    <li>• Truthful information provision</li>
                    <li>• Compliance with local laws</li>
                    <li>• Responsible financial behavior</li>
                    <li>• Protection of account credentials</li>
                    <li>• Reporting of suspicious activities</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mt-4">
                <h4 className="text-blue-300 font-semibold mb-2">Jurisdiction and Governing Law</h4>
                <p className="text-blue-200">
                  These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which the Service operates, without regard to its conflict of law provisions.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Risk Acknowledgment */}
          <Card className="border-0 shadow-lg bg-black/80 backdrop-blur-sm border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Clock className="w-6 h-6 text-orange-400" />
                <span>Risk Acknowledgment and Release</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-900/20 border border-orange-700 rounded-lg p-6">
                <h4 className="text-orange-300 font-semibold mb-4 text-lg">ACKNOWLEDGMENT OF RISKS</h4>
                <p className="text-orange-200 leading-relaxed mb-4">
                  By using this Service, you acknowledge that you understand and accept the following risks:
                </p>
                <ul className="text-orange-200 space-y-2 ml-4">
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-400 mt-1">▸</span>
                    <span><strong>Risk of Financial Loss:</strong> Any money sent through this platform may be lost forever with no possibility of recovery.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-400 mt-1">▸</span>
                    <span><strong>No Regulatory Protection:</strong> This Service is not regulated by financial authorities, offering no investor protection.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-400 mt-1">▸</span>
                    <span><strong>Technical Risks:</strong> Platform errors, bugs, or technical issues may result in loss of funds or data.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-400 mt-1">▸</span>
                    <span><strong>Third-Party Risks:</strong> We are not responsible for the actions of third parties you may interact with through this Service.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <h4 className="text-red-300 font-semibold mb-2">RELEASE OF LIABILITY</h4>
                <p className="text-red-200">
                  You hereby release and discharge CGrow, its affiliates, officers, directors, employees, and agents from any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or related to your use of this Service or any financial transactions conducted through it.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Final Agreement */}
          <Card className="border-0 shadow-lg bg-black/80 backdrop-blur-sm border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white">Final Agreement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                By continuing to use this Service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. You acknowledge that this is a prank/template website and that any financial interactions are conducted at your own risk with no expectation of recourse or protection.
              </p>
              
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-white/80 text-center font-medium">
                  <strong>IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST IMMEDIATELY CEASE USING THIS SERVICE.</strong>
                </p>
              </div>

              <div className="text-center pt-4">
                <p className="text-zinc-400 text-sm">
                  For questions about these Terms of Service, please contact us through the provided channels on this website.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}