'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

function DeliveryApplication() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const router = useRouter()

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const onSubmit = async (data) => {
    try {
      const drivingLicenseFile = data.drivingLicensePicture?.[0]
      const payload = {
        name: data.name,
        location: data.location,
        mobileNumber: data.mobileNumber,
        drivingLicense: data.drivingLicense,
        idProof: data.idProof,
        drivingLicensePicture: drivingLicenseFile ? await fileToBase64(drivingLicenseFile) : null,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job-applications/delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        alert('Application submitted successfully!')
        router.push('/careers')
      } else {
        alert('Failed to submit application. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Apply as a Delivery Man
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Home Location
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                {...register('mobileNumber', { required: 'Mobile number is required' })}
                type="tel"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
              {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>}
            </div>

            <div>
              <label htmlFor="drivingLicense" className="block text-sm font-medium text-gray-700">
                Driving License Number
              </label>
              <input
                {...register('drivingLicense', { required: 'Driving license is required' })}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
              {errors.drivingLicense && <p className="mt-1 text-sm text-red-600">{errors.drivingLicense.message}</p>}
            </div>

            <div>
              <label htmlFor="drivingLicensePicture" className="block text-sm font-medium text-gray-700">
                Driving License Picture (optional)
              </label>
              <input
                id="drivingLicensePicture"
                {...register('drivingLicensePicture')}
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="idProof" className="block text-sm font-medium text-gray-700">
                ID Number
              </label>
              <input
                {...register('idProof', { required: 'ID number is required' })}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="ID number or details..."
              />
              {errors.idProof && <p className="mt-1 text-sm text-red-600">{errors.idProof.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DeliveryApplication