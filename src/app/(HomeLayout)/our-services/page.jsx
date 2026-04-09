'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

function OurServices() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: data.productName,
          productCategory: data.productCategory,
          productCondition: data.productCondition,
          productPrice: parseFloat(data.productPrice),
          productDescription: data.productDescription,
          productImage: data.productImage,
          productLocation: data.productLocation,
          productContactNumber: data.productContactNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create sell post');
      }

      setSuccessMessage('Sell post created successfully!');
      reset();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create sell post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-white via-green-50 to-green-100 py-12 px-4">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"></div>

      <div className="w-full max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold mb-3 bg-linear-to-rrom-green-600 to-green-800 bg-clip-text text-transparent">
            Create Your Sell Post
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Share your items with our community and start selling today
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-green-100">
          {successMessage && (
            <div className="p-4 bg-linear-to-r from-green-50 to-green-100 border border-green-300 text-green-700 rounded-lg flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-linear-to-r from-red-50 to-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-2">
              <span className="text-xl">✕</span>
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <Label htmlFor="productName" className="text-gray-700 font-semibold">Product Name *</Label>
              <Input
                id="productName"
                placeholder="Enter product name"
                {...register('productName', { required: 'Product name is required' })}
                className="mt-2 border-green-200 focus:ring-green-500 focus:border-green-500"
              />
              {errors.productName && <span className="text-red-500 text-sm mt-1 block">{errors.productName.message}</span>}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="productCategory" className="text-gray-700 font-semibold">Category *</Label>
              <select
                id="productCategory"
                {...register('productCategory', { required: 'Category is required' })}
                className="w-full mt-2 px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Appliances">Appliances</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
              {errors.productCategory && <span className="text-red-500 text-sm mt-1 block">{errors.productCategory.message}</span>}
            </div>

            {/* Condition */}
            <div>
              <Label htmlFor="productCondition" className="text-gray-700 font-semibold">Condition *</Label>
              <select
                id="productCondition"
                {...register('productCondition', { required: 'Condition is required' })}
                className="w-full mt-2 px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              >
                <option value="">Select condition</option>
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
              {errors.productCondition && <span className="text-red-500 text-sm mt-1 block">{errors.productCondition.message}</span>}
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="productPrice" className="text-gray-700 font-semibold">Price ($) *</Label>
              <Input
                id="productPrice"
                type="number"
                step="0.01"
                placeholder="Enter price"
                {...register('productPrice', { 
                  required: 'Price is required',
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: 'Please enter a valid price'
                  }
                })}
                className="mt-2 border-green-200 focus:ring-green-500 focus:border-green-500"
              />
              {errors.productPrice && <span className="text-red-500 text-sm mt-1 block">{errors.productPrice.message}</span>}
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="productLocation" className="text-gray-700 font-semibold">Location *</Label>
              <Input
                id="productLocation"
                placeholder="Enter your location"
                {...register('productLocation', { required: 'Location is required' })}
                className="mt-2 border-green-200 focus:ring-green-500 focus:border-green-500"
              />
              {errors.productLocation && <span className="text-red-500 text-sm mt-1 block">{errors.productLocation.message}</span>}
            </div>

            {/* Contact Number */}
            <div>
              <Label htmlFor="productContactNumber" className="text-gray-700 font-semibold">Contact Number *</Label>
              <Input
                id="productContactNumber"
                placeholder="Enter your contact number"
                {...register('productContactNumber', { required: 'Contact number is required' })}
                className="mt-2 border-green-200 focus:ring-green-500 focus:border-green-500"
              />
              {errors.productContactNumber && <span className="text-red-500 text-sm mt-1 block">{errors.productContactNumber.message}</span>}
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <Label htmlFor="productImage" className="text-gray-700 font-semibold">Image URL</Label>
              <Input
                id="productImage"
                placeholder="Enter image URL"
                {...register('productImage')}
                className="mt-2 border-green-200 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="productDescription" className="text-gray-700 font-semibold">Description</Label>
              <textarea
                id="productDescription"
                placeholder="Enter product description"
                {...register('productDescription')}
                className="w-full mt-2 px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 h-24 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner />
                Creating...
              </div>
            ) : (
              'Create Sell Post'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default OurServices;