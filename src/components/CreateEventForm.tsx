'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function CreateEventForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [payers, setPayers] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payerList = payers.split('\n').filter(name => name.trim()).map(name => ({ name: name.trim() }))
      
      const res = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          amount: parseFloat(amount),
          payers: payerList
        })
      })

      if (res.ok) {
        const { slug, collectorName } = await res.json()
        window.location.href = `/${collectorName}/${slug}`
      } else {
        alert('Failed to create event')
      }
    } catch (error) {
      alert('Error creating event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div>
        <Label htmlFor="title" className="text-xs sm:text-sm font-medium text-gray-700">Event Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Team Lunch Collection"
          className="mt-1 text-sm"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description" className="text-xs sm:text-sm font-medium text-gray-700">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          className="mt-1 resize-none text-sm"
          rows={2}
        />
      </div>
      
      <div>
        <Label htmlFor="amount" className="text-xs sm:text-sm font-medium text-gray-700">Amount per person (₹)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="500"
          className="mt-1 text-sm"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="payers" className="text-xs sm:text-sm font-medium text-gray-700">Payer Names</Label>
        <Textarea
          id="payers"
          value={payers}
          onChange={(e) => setPayers(e.target.value)}
          placeholder="John Doe&#10;Jane Smith&#10;Bob Johnson"
          className="mt-1 resize-none text-sm"
          rows={3}
          required
        />
        <p className="text-xs text-gray-500 mt-1">Enter one name per line</p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-2.5 text-sm sm:text-base" 
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs sm:text-sm">Creating...</span>
          </div>
        ) : (
          <span className="text-sm sm:text-base">🚀 Create Event</span>
        )}
      </Button>
    </form>
  )
}