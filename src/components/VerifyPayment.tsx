'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { VerifyPaymentProps } from '@/types'

export default function VerifyPayment({ eventId, payerId, payerName }: VerifyPaymentProps) {
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)

  const verifyPayment = async () => {
    setVerifyLoading(true)
    try {
      const res = await fetch('/api/events/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, payerId })
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to verify payment')
      }
    } catch (error) {
      alert('Error verifying payment')
    } finally {
      setVerifyLoading(false)
    }
  }

  const rejectPayment = async () => {
    setRejectLoading(true)
    try {
      const res = await fetch('/api/events/reject-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, payerId })
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to reject payment')
      }
    } catch (error) {
      alert('Error rejecting payment')
    } finally {
      setRejectLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button onClick={verifyPayment} disabled={verifyLoading || rejectLoading}>
        {verifyLoading ? 'Verifying...' : 'Verify'}
      </Button>
      <Button 
        onClick={rejectPayment} 
        disabled={verifyLoading || rejectLoading}
        variant="destructive"
      >
        {rejectLoading ? 'Rejecting...' : 'Reject'}
      </Button>
    </div>
  )
}