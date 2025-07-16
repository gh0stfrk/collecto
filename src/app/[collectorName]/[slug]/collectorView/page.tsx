import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import CollectionEvent from '@/models/CollectionEvent'
import Collector from '@/models/Collector'
import { verifyToken } from '@/lib/auth'
import VerifyPayment from '@/components/VerifyPayment'
import LogoutButton from '@/components/LogoutButton'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Payer } from '@/types'

dayjs.extend(relativeTime)

interface Props {
  params: Promise<{ collectorName: string; slug: string }>
}

export default async function CollectorViewPage({ params }: Props) {
  const { collectorName, slug } = await params
  
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) {
    redirect('/login')
  }

  const payload = await verifyToken(token)
  if (!payload) {
    redirect('/login')
  }

  await dbConnect()
  
  const collector = await Collector.findOne({ username: collectorName })
  if (!collector || collector.username !== payload.username) {
    notFound()
  }

  const event = await CollectionEvent.findOne({ 
    slug, 
    collectorId: collector._id 
  }).lean()
  
  if (!event) notFound()

  const pendingPayers: Payer[] = event.payers.filter((p: any) => p.state === 'pending_verification').map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    state: p.state,
    paymentTimestamp: p.paymentTimestamp?.toISOString(),
    verificationTimestamp: p.verificationTimestamp?.toISOString()
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3 xs:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{event.title}</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Collector Dashboard</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Stats Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Pending Verifications</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Review and approve payment claims</p>
            </div>
            <div className="bg-amber-100 text-amber-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-sm xs:text-base">
              {pendingPayers.length} pending
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        {pendingPayers.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-sm sm:text-base text-gray-600">No payments pending verification at the moment.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {pendingPayers.map((payer: Payer) => (
              <div key={payer._id} className="bg-white rounded-lg sm:rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-xs sm:text-sm">
                            {payer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{payer.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Claimed payment {dayjs(payer.paymentTimestamp).fromNow()}
                          </p>
                        </div>
                      </div>
                      <div className="ml-11 sm:ml-13">
                        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-pulse"></div>
                          Awaiting verification
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3 ml-11 sm:ml-4">
                      <VerifyPayment 
                        eventId={event._id.toString()} 
                        payerId={payer._id}
                        payerName={payer.name}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}