'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

function TechnicianApplication() {
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
      const certificationFiles = data.certificationPictures ? Array.from(data.certificationPictures) : []
      const certificationPicturesBase64 = []
      
      for (const file of certificationFiles) {
        const base64 = await fileToBase64(file)
        certificationPicturesBase64.push(base64)
      }
      
      const payload = {
        name: data.name,
        location: data.location,
        mobileNumber: data.mobileNumber,
        skills: data.skills,
        certificates: data.certificates,
        idProof: data.idProof,
        certificationPictures: certificationPicturesBase64.length > 0 ? certificationPicturesBase64 : null,
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/job-applications/technician`, {
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
            Apply as a Technician
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>}
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills
              </label>
              <textarea
                {...register('skills', { required: 'Skills are required' })}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your technical skills..."
              />
              {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>}
            </div>

            <div>
              <label htmlFor="certificates" className="block text-sm font-medium text-gray-700">
                Owned Certificates
              </label>
              <textarea
                {...register('certificates', { required: 'Certificates are required' })}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="List your certificates..."
              />
              {errors.certificates && <p className="mt-1 text-sm text-red-600">{errors.certificates.message}</p>}
            </div>

            <div>
              <label htmlFor="certificationPictures" className="block text-sm font-medium text-gray-700">
                Certification Pictures (optional - select multiple files)
              </label>
              <input
                id="certificationPictures"
                {...register('certificationPictures')}
                type="file"
                accept="image/*"
                multiple
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-white focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">You can select multiple certificate pictures at once</p>
            </div>

            <div>
              <label htmlFor="idProof" className="block text-sm font-medium text-gray-700">
                ID Number
              </label>
              <input
                {...register('idProof', { required: 'ID number is required' })}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="ID number or details..."
              />
              {errors.idProof && <p className="mt-1 text-sm text-red-600">{errors.idProof.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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

export default TechnicianApplication