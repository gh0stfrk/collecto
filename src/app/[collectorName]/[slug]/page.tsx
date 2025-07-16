import { notFound } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import CollectionEvent from '@/models/CollectionEvent'
import Collector from '@/models/Collector'
import { generateUPILink, generateQRCode } from '@/lib/upi'
import PayerModal from '@/components/PayerModal'
import PayAsModal from '@/components/PayAsModal'
import type { Payer } from '@/types'

interface Props {
  params: Promise<{ collectorName: string; slug: string }>
}

export default async function EventPage({ params }: Props) {
  const { collectorName, slug } = await params
  
  await dbConnect()
  
  const collector: any = await Collector.findOne({ username: collectorName })
  
  if (!collector || !collector.name) notFound()

  const eventData: any = await CollectionEvent.findOne({ 
    slug, 
    collectorId: collector._id 
  }).lean()
  
  if (!eventData || !eventData.payers) notFound()
  
  // Convert MongoDB result to our typed format
  const event = {
    ...eventData,
    _id: eventData._id?.toString() || '',
    createdAt: eventData.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: eventData.updatedAt?.toISOString() || new Date().toISOString(),
    payers: eventData.payers || []
  }

  const upiLink = generateUPILink(collector.upiId, collector.name, event.amount)
  const qrCode = await generateQRCode(upiLink)

  const convertPayer = (p: any): Payer => ({
    _id: p._id?.toString() || '',
    name: p.name || '',
    state: p.state || 'not_paid',
    paymentTimestamp: p.paymentTimestamp?.toISOString(),
    verificationTimestamp: p.verificationTimestamp?.toISOString()
  })

  const paidPayers: Payer[] = event.payers.filter((p: any) => p?.state === 'paid').map(convertPayer)
  const pendingPayers: Payer[] = event.payers.filter((p: any) => p?.state === 'pending_verification').map(convertPayer)
  const notPaidPayers: Payer[] = event.payers.filter((p: any) => p?.state === 'not_paid').map(convertPayer)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 break-words">{event.title}</h1>
            {event.description && (
              <p className="text-sm sm:text-lg text-gray-600 mb-3 sm:mb-4">{event.description}</p>
            )}
            <div className="flex flex-col xs:flex-row items-center justify-center gap-3 xs:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Amount: <span className="font-semibold text-gray-900">₹{event.amount}</span> per person</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Collector: <span className="font-semibold text-gray-900">{collector.name}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">

        {/* {event.status === 'published' && (
          <div className="text-center mb-8 p-6 border rounded-lg">
            <img src={qrCode} alt="UPI QR Code" className="mx-auto mb-4" width={200} height={200} />
            <a 
              href={upiLink}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Pay Now via UPI
            </a>
          </div>
        )} */}

        {/* Pay As Someone Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Don't see your name?</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Pay on behalf of someone who might have been missed</p>
            <PayAsModal 
              amount={event.amount}
              upiId={collector.upiId}
              collectorName={collector.name}
              eventId={event._id}
            />
          </div>
        </div>

        {/* Payment Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Paid */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-green-50 px-3 sm:px-6 py-3 sm:py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-semibold text-green-800 flex items-center gap-2">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full"></div>
                  Paid
                </h3>
                <span className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {paidPayers.length}
                </span>
              </div>
            </div>
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
              {paidPayers.length === 0 ? (
                <p className="text-gray-500 text-center py-3 sm:py-4 text-sm">No payments completed yet</p>
              ) : (
                paidPayers.map((payer: Payer) => (
                  <PayerModal 
                    key={payer._id} 
                    payer={payer} 
                    amount={event.amount}
                    upiId={collector.upiId}
                    collectorName={collector.name}
                    eventId={event._id}
                    eventCreatedAt={event.createdAt}
                  />
                ))
              )}
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-amber-50 px-3 sm:px-6 py-3 sm:py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-semibold text-amber-800 flex items-center gap-2">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 bg-amber-500 rounded-full animate-pulse"></div>
                  Pending
                </h3>
                <span className="bg-amber-100 text-amber-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {pendingPayers.length}
                </span>
              </div>
            </div>
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
              {pendingPayers.length === 0 ? (
                <p className="text-gray-500 text-center py-3 sm:py-4 text-sm">No pending verifications</p>
              ) : (
                pendingPayers.map((payer: Payer) => (
                  <PayerModal 
                    key={payer._id} 
                    payer={payer} 
                    amount={event.amount}
                    upiId={collector.upiId}
                    collectorName={collector.name}
                    eventId={event._id}
                    eventCreatedAt={event.createdAt}
                  />
                ))
              )}
            </div>
          </div>

          {/* Not Paid */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-red-50 px-3 sm:px-6 py-3 sm:py-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-semibold text-red-800 flex items-center gap-2">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 bg-red-500 rounded-full"></div>
                  Not Paid
                </h3>
                <span className="bg-red-100 text-red-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {notPaidPayers.length}
                </span>
              </div>
            </div>
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
              {notPaidPayers.length === 0 ? (
                <p className="text-gray-500 text-center py-3 sm:py-4 text-sm">Everyone has paid!</p>
              ) : (
                notPaidPayers.map((payer: Payer) => (
                  <PayerModal 
                    key={payer._id} 
                    payer={payer} 
                    amount={event.amount}
                    upiId={collector.upiId}
                    collectorName={collector.name}
                    eventId={event._id}
                    eventCreatedAt={event.createdAt}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}