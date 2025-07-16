import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-4 sm:py-8">
      <div className="text-center max-w-2xl mx-auto px-3 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl text-white font-bold">C</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Collecto</h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-2">Smart UPI Money Collection</p>
          <p className="text-sm sm:text-base text-gray-500">Track payments, verify transactions, and manage collections effortlessly</p>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-lg sm:text-2xl">📱</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">UPI Integration</h3>
              <p className="text-xs sm:text-sm text-gray-600">Generate QR codes and payment links</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-lg sm:text-2xl">✅</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Payment Tracking</h3>
              <p className="text-xs sm:text-sm text-gray-600">Real-time payment status updates</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-lg sm:text-2xl">🔐</span>
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">Secure Verification</h3>
              <p className="text-xs sm:text-sm text-gray-600">Collector approval system</p>
            </div>
          </div>
          
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium text-base sm:text-lg w-full xs:w-auto">
              Get Started as Collector
            </Button>
          </Link>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm text-gray-500">
            Streamline your group payments and collections with ease
          </p>
          
          {/* Registration Contact */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Want to get registered as a collector?
            </p>
            <a 
              href="mailto:salman@salmansyyd.com?subject=Collecto Registration Request"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              <span>📧</span>
              <span>salman@salmansyyd.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}