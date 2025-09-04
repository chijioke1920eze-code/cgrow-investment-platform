'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatCurrency } from '@/lib/utils'

interface Student {
  id: string
  email: string
  phone: string
  password: string
  balance: number
  lastAiDepositDate: string | null
  createdAt: string
  totalTransactions: number
  totalDeposits: number
  totalWithdrawals: number
}

export default function AdminPanel() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [totalStudents, setTotalStudents] = useState(0)
  const [showPasswords, setShowPasswords] = useState(false)
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Authentication handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    
    // Check hardcoded teacher credentials
    if (loginEmail === '2@gmail.com' && loginPassword === '888888') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      setLoginEmail('')
      setLoginPassword('')
    } else {
      setLoginError('Invalid teacher credentials. Contact system administrator.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
  }

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/students')
      const data = await response.json()
      
      if (data.success) {
        setStudents(data.students)
        setTotalStudents(data.totalStudents)
      }
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check for existing authentication
    const adminAuth = localStorage.getItem('adminAuth')
    if (adminAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchStudents()
    }
  }, [isAuthenticated])

  const copyAllPasswords = () => {
    const passwordList = students.map(s => `${s.email}: ${s.password}`).join('\n')
    navigator.clipboard.writeText(passwordList)
    alert('All passwords copied to clipboard!')
  }

  const exportStudentData = () => {
    const csvData = [
      'Email,Phone,Password,Balance,Total Deposits,Total Withdrawals,Created At',
      ...students.map(s => 
        `${s.email},${s.phone},${s.password},${s.balance},${s.totalDeposits},${s.totalWithdrawals},${s.createdAt}`
      )
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'student_accounts.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-800/50 border-zinc-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">👨‍🏫 Teacher Login</CardTitle>
            <p className="text-zinc-400">Admin Panel Access</p>
            <Badge className="mx-auto bg-blue-900/50 text-blue-300 border-blue-700">
              🎓 Educational Demo Control
            </Badge>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Teacher Email
                </label>
                <Input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-zinc-700 border-zinc-600 text-white"
                  placeholder="Enter teacher email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="bg-zinc-700 border-zinc-600 text-white"
                  placeholder="Enter password"
                  required
                />
              </div>
              {loginError && (
                <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-700">
                  {loginError}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                🔐 Access Admin Panel
              </Button>
            </form>
            <div className="mt-6 text-center">
              <div className="text-xs text-zinc-500">
                For teacher access only. Contact administrator if needed.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading student data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">👨‍🏫 Teacher Admin Panel</h1>
            <p className="text-zinc-400">Educational Demo - CGrow Investment Platform</p>
            <Badge className="mt-2 bg-blue-900/50 text-blue-300 border-blue-700">
              🎓 Educational Purpose Only
            </Badge>
          </div>
          <Button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            🚪 Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400">{totalStudents}</div>
              <div className="text-sm text-zinc-400">Total Students</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-400">
                {formatCurrency(students.reduce((sum, s) => sum + s.balance, 0))}
              </div>
              <div className="text-sm text-zinc-400">Total Balance</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-400">
                {students.reduce((sum, s) => sum + s.totalTransactions, 0)}
              </div>
              <div className="text-sm text-zinc-400">Total Transactions</div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-800/50 border-zinc-700">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-400">
                {formatCurrency(students.reduce((sum, s) => sum + s.totalDeposits, 0))}
              </div>
              <div className="text-sm text-zinc-400">Total Deposits</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button 
            onClick={() => setShowPasswords(!showPasswords)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showPasswords ? '🙈 Hide' : '👁️ Show'} Passwords
          </Button>
          <Button 
            onClick={copyAllPasswords}
            className="bg-green-600 hover:bg-green-700"
          >
            📋 Copy All Passwords
          </Button>
          <Button 
            onClick={exportStudentData}
            className="bg-purple-600 hover:bg-purple-700"
          >
            📊 Export CSV
          </Button>
          <Button 
            onClick={fetchStudents}
            className="bg-orange-600 hover:bg-orange-700"
          >
            🔄 Refresh Data
          </Button>
        </div>

        {/* Student List */}
        <Card className="bg-zinc-800/50 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">Student Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center text-zinc-400 py-8">
                No student accounts found. Students will appear here after they create accounts.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="text-left p-2 text-zinc-300">Email</th>
                      <th className="text-left p-2 text-zinc-300">Phone</th>
                      <th className="text-left p-2 text-zinc-300">Password</th>
                      <th className="text-left p-2 text-zinc-300">Balance</th>
                      <th className="text-left p-2 text-zinc-300">Transactions</th>
                      <th className="text-left p-2 text-zinc-300">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-zinc-700/50 hover:bg-zinc-700/20">
                        <td className="p-2 text-white">{student.email}</td>
                        <td className="p-2 text-zinc-300">{student.phone}</td>
                        <td className="p-2">
                          <span className="font-mono text-green-400">
                            {showPasswords ? student.password : '••••••••'}
                          </span>
                        </td>
                        <td className="p-2 text-blue-400 font-medium">
                          {formatCurrency(student.balance)}
                        </td>
                        <td className="p-2 text-zinc-300">
                          {student.totalTransactions}
                          {student.totalDeposits > 0 && (
                            <div className="text-xs text-green-400">
                              +{formatCurrency(student.totalDeposits)} deposits
                            </div>
                          )}
                        </td>
                        <td className="p-2 text-zinc-400 text-xs">
                          {new Date(student.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Educational Notes */}
        <Card className="mt-8 bg-amber-900/20 border-amber-700">
          <CardHeader>
            <CardTitle className="text-amber-400">📚 Educational Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-200 space-y-2">
            <p>• This platform demonstrates common investment scam tactics</p>
            <p>• Students experience realistic scam interface with fake money</p>
            <p>• Passwords are visible to help manage student accounts safely</p>
            <p>• Use this data to discuss red flags and financial literacy</p>
            <p>• Reveal educational purpose after students complete the exercise</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
