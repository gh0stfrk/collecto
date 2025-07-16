'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateUPILink, generateQRCode } from '@/lib/upi'
import type { PayAsModalProps } from '@/types'

export default function PayAsModal({ amount, upiId, collectorName, eventId }: PayAsModalProps) {
  const [payerName, setPayerName] = useState('')
  const [qrCode, setQrCode] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'name' | 'payment'>('name')

  const handleGenerateQR = async () => {
    if (!payerName.trim()) return
    
    const upiLink = generateUPILink(upiId, collectorName, amount, `Payment for ${payerName} - Collecto`)
    const qr = await generateQRCode(upiLink)
    setQrCode(qr)
    setStep('payment')
  }

  const markAsPaid = async () => {
    setLoading(true)
    try {
      await fetch('/api/events/pay-as', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, payerName: payerName.trim() })
      })
      window.location.reload()
    } catch (error) {
      alert('Failed to mark as paid')
    } finally {
      setLoading(false)
    }
  }

  const upiLink = generateUPILink(upiId, collectorName, amount, `Payment for ${payerName} - Collecto`)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base w-full xs:w-auto">
          <span className="mr-2">💳</span>
          <span>Pay as Someone Else</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👥</span>
          </div>
          <DialogTitle className="text-lg font-semibold">Pay on Behalf of Someone</DialogTitle>
          <p className="text-sm text-gray-600 mt-1">Help someone who might have been missed</p>
        </DialogHeader>
        
        {step === 'name' && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-blue-600">₹{amount}</div>
                <div className="text-xs text-blue-600">Amount per person</div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="payerName" className="text-sm font-medium text-gray-700 mb-2 block">
                Enter the person's name
              </Label>
              <Input
                id="payerName"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <Button 
              onClick={handleGenerateQR} 
              disabled={!payerName.trim()} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              <span className="mr-2">🚀</span>
              Generate Payment QR
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-4">
            <div className="text-center bg-gray-50 rounded-lg p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold text-sm">
                  {payerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="font-semibold text-gray-900">{payerName}</p>
              <p className="text-lg font-bold text-blue-600">₹{amount}</p>
            </div>
            
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-4">
              <div className="text-center mb-3">
                <h3 className="font-medium text-gray-900 text-sm mb-1">Choose Payment Method</h3>
                <p className="text-xs text-gray-600">Scan QR code or click the button below</p>
              </div>
              
              <div className="bg-white rounded-lg p-3 mb-3 border">
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
                  <span className="bg-white px-2 text-gray-500">OR</span>
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
            
            <div className="space-y-2">
              <Button 
                onClick={markAsPaid} 
                disabled={loading} 
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50 py-2.5"
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
              
              <Button 
                onClick={() => setStep('name')} 
                variant="ghost" 
                className="w-full text-gray-600 hover:text-gray-800 py-2"
              >
                ← Back to Name Entry
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}