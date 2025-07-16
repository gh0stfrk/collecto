import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import dbConnect from '@/lib/mongodb'
import CollectionEvent from '@/models/CollectionEvent'
import Collector from '@/models/Collector'
import { verifyToken } from '@/lib/auth'
import CreateEventForm from '@/components/CreateEventForm'
import LogoutButton from '@/components/LogoutButton'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default async function DashboardPage() {
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
  
  const collector = await Collector.findOne({ username: payload.username })
  if (!collector) {
    redirect('/login')
  }

  const events = await CollectionEvent.find({ 
    collectorId: collector._id 
  }).sort({ createdAt: -1 }).lean()

  const eventsWithStats = events.map(event => {
    const totalPayers = event.payers?.length || 0
    const paidCount = event.payers?.filter((p: any) => p.state === 'paid').length || 0
    const pendingCount = event.payers?.filter((p: any) => p.state === 'pending_verification').length || 0
    
    return {
      ...event,
      _id: event._id.toString(),
      createdAt: event.createdAt.toISOString(),
      totalPayers,
      paidCount,
      pendingCount,
      completionRate: totalPayers > 0 ? Math.round((paidCount / totalPayers) * 100) : 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, {collector.name}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Create Event Form */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border p-4 sm:p-6 lg:sticky lg:top-8">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Create New Event</h2>
                <p className="text-xs sm:text-sm text-gray-600">Set up a new collection for your group</p>
              </div>
              <CreateEventForm />
            </div>
          </div>

          {/* Events List */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">Your Events</h2>
              <p className="text-sm sm:text-base text-gray-600">Manage and track your collection events</p>
            </div>

            {eventsWithStats.length === 0 ? (
              <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border p-8 sm:p-12 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">📋</span>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No events yet</h3>
                <p className="text-sm sm:text-base text-gray-600">Create your first collection event to get started</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {eventsWithStats.map((event: any) => (
                  <div key={event._id} className="bg-white rounded-lg sm:rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4">
                        <div className="flex-1 mb-3 sm:mb-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                          {event.description && (
                            <p className="text-sm sm:text-base text-gray-600 mb-2">{event.description}</p>
                          )}
                          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 text-xs sm:text-sm text-gray-500">
                            <span>₹{event.amount} per person</span>
                            <span className="hidden xs:inline">•</span>
                            <span>Created {dayjs(event.createdAt).fromNow()}</span>
                          </div>
                        </div>
                        <div className="text-center sm:text-right">
                          <div className="text-xl sm:text-2xl font-bold text-gray-900">{event.completionRate}%</div>
                          <div className="text-xs text-gray-500">Complete</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>{event.paidCount} of {event.totalPayers} paid</span>
                          {event.pendingCount > 0 && <span>{event.pendingCount} pending</span>}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all" 
                            style={{ width: `${event.completionRate}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                        <div className="text-center p-2 sm:p-3 bg-green-50 rounded-md sm:rounded-lg">
                          <div className="text-sm sm:text-lg font-semibold text-green-700">{event.paidCount}</div>
                          <div className="text-xs text-green-600">Paid</div>
                        </div>
                        <div className="text-center p-2 sm:p-3 bg-amber-50 rounded-md sm:rounded-lg">
                          <div className="text-sm sm:text-lg font-semibold text-amber-700">{event.pendingCount}</div>
                          <div className="text-xs text-amber-600">Pending</div>
                        </div>
                        <div className="text-center p-2 sm:p-3 bg-red-50 rounded-md sm:rounded-lg">
                          <div className="text-sm sm:text-lg font-semibold text-red-700">{event.totalPayers - event.paidCount - event.pendingCount}</div>
                          <div className="text-xs text-red-600">Not Paid</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                        <Link 
                          href={`/${collector.username}/${event.slug}`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 sm:px-4 rounded-md sm:rounded-lg text-sm sm:text-base font-medium transition-colors"
                        >
                          View Event
                        </Link>
                        <Link 
                          href={`/${collector.username}/${event.slug}/collectorView`}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 px-3 sm:px-4 rounded-md sm:rounded-lg text-sm sm:text-base font-medium transition-colors"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}