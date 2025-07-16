'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { generateUPILink, generateQRCode } from '@/lib/upi'
import type { PayerModalProps } from '@/types'

export default function PayerModal({ payer, amount, upiId, collectorName, eventId, eventCreatedAt }: PayerModalProps) {
  const [qrCode, setQrCode] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleOpenModal = async () => {
    if (!qrCode) {
      const upiLink = generateUPILink(upiId, collectorName, amount, `Payment for ${payer.name} - Collecto`)
      const qr = await generateQRCode(upiLink)
      setQrCode(qr)
    }
  }

  const markAsPaid = async () => {
    setLoading(true)
    try {
      await fetch('/api/events/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, payerId: payer._id })
      })
      window.location.reload()
    } catch (error) {
      alert('Failed to mark as paid')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (payer.state) {
      case 'paid': return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case 'pending_verification': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default: return <Badge className="bg-red-100 text-red-800">Not Paid</Badge>
    }
  }

  const getStatusText = () => {
    if (payer.state === 'paid' && payer.paymentTimestamp) {
      const diffMs = new Date(payer.paymentTimestamp).getTime() - new Date(eventCreatedAt).getTime()
      const minutes = Math.floor(diffMs / (1000 * 60))
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))
      
      if (weeks > 0) return `Paid ${weeks} ${weeks === 1 ? 'week' : 'weeks'} after request`
      if (days > 0) return `Paid ${days} ${days === 1 ? 'day' : 'days'} after request`
      if (hours > 0) return `Paid ${hours} ${hours === 1 ? 'hour' : 'hours'} after request`
      if (minutes > 0) return `Paid ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} after request`
      return 'Paid less than 1 minute after request'
    }
    if (payer.state === 'pending_verification') {
      return 'Pending verification'
    }
    return 'Not paid'
  }

  const upiLink = generateUPILink(upiId, collectorName, amount, `Payment for ${payer.name} - Collecto`)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all"
          onClick={handleOpenModal}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-xs">
                  {payer.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-gray-900">{payer.name}</span>
            </div>
            {getStatusBadge()}
          </div>
          <div className="text-xs text-gray-500 ml-10">
            {getStatusText()}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-blue-600 font-bold text-lg">
              {payer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <DialogTitle className="text-lg font-semibold">{payer.name}</DialogTitle>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-xl font-bold text-gray-900">₹{amount}</span>
            {getStatusBadge()}
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {payer.state === 'paid' && (
            <div className="text-center bg-green-50 rounded-lg p-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">✅</span>
              </div>
              <p className="text-green-700 font-medium text-sm mb-1">{getStatusText()}</p>
              <p className="text-green-600 text-sm">Thank you for your payment! 🎉</p>
            </div>
          )}
          
          {payer.state === 'pending_verification' && (
            <div className="text-center bg-amber-50 rounded-lg p-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">⏳</span>
              </div>
              <p className="text-amber-700 font-medium text-sm">Payment Submitted</p>
              <p className="text-amber-600 text-xs mt-1">Waiting for collector verification</p>
            </div>
          )}
          
          {payer.state === 'not_paid' && (
            <div className="space-y-4">
              {qrCode && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-center mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Choose Payment Method</h3>
                    <p className="text-xs text-gray-600">Scan QR code or click the button below</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
                    <img src={qrCode} alt="UPI QR Code" className="mx-auto" width={140} height={140} />
                    <p className="text-center text-xs text-gray-500 mt-1">
                      📱 Scan with any UPI app
                    </p>
                  </div>
                  
                  <div className="relative mb-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-gray-50 px-2 text-gray-500">OR</span>
                    </div>
                  </div>
                  
                  <a 
                    href={upiLink}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <span>💳</span>
                    <span>Pay via UPI App</span>
                  </a>
                </div>
              )}
              
              <div className="border-t pt-3">
                <p className="text-center text-xs text-gray-600 mb-2">
                  Already paid? Let us know!
                </p>
                <Button 
                  onClick={markAsPaid} 
                  disabled={loading} 
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50 text-sm py-2"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Marking...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>✓</span>
                      <span>Mark as Paid</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}