'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      alert('Logout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} disabled={loading} variant="outline">
      {loading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}