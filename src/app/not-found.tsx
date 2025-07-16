'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-4 sm:py-8">
      <div className="text-center max-w-md mx-auto px-3 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <span className="text-3xl sm:text-4xl">😵</span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-bold text-gray-900 mb-3 sm:mb-4">404</h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-3">What can you do?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Check the URL for typos</p>
                <p>• Go back to the homepage</p>
                <p>• Contact support if you think this is an error</p>
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-3">
              <Link href="/" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg">
                  🏠 Go Home
                </Button>
              </Link>
              <Button 
                onClick={() => window.history.back()} 
                variant="outline" 
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5"
              >
                ← Go Back
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            Need help? Contact support
          </p>
          <a 
            href="mailto:salman@salmansyyd.com?subject=Collecto Support - 404 Error"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            <span>📧</span>
            <span>salman@salmansyyd.com</span>
          </a>
        </div>
      </div>
    </div>
  )
}