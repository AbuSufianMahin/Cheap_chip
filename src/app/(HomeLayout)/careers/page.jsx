import React from 'react'
import Link from 'next/link'
import ResponsiveWidth from '@/components/shared/ResponsiveWidth'

function page() {
  return (
    <ResponsiveWidth>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Join Our Team
            </h1>
            <div className="space-y-4">
              <Link
                href="/careers/technician"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply as a Technician
              </Link>
              <Link
                href="/careers/delivery"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Apply as a Delivery Man
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveWidth>
  )
}

export default page