'use client';

import { useRef, useState } from 'react';
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
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const imageInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageDataUrl('');
      setImageFileName('');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrorMessage('Image size must be under 10MB');
      setImageDataUrl('');
      setImageFileName('');
      event.target.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, or WebP)');
      setImageDataUrl('');
      setImageFileName('');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageDataUrl(e.target?.result || '');
      setImageFileName(file.name);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const getPriceSuggestions = (category) => {
    const suggestions = {
      'CPU Chips': '৳500 - ৳50,000 (Intel i3: ৳2,000-৳5,000, Intel i5: ৳5,000-৳15,000, Intel i7: ৳10,000-৳30,000, Intel i9: ৳25,000-৳50,000)',
      'GPU Chips': '৳1,000 - ৳1,50,000 (GTX 1050: ৳5,000-৳10,000, RTX 2060: ৳20,000-৳40,000, RTX 3070: ৳40,000-৳80,000, RTX 4090: ৳1,00,000-৳1,50,000)',
      'RAM Chips': '৳200 - ৳15,000 (4GB DDR4: ৳500-৳1,500, 8GB DDR4: ৳1,000-৳3,000, 16GB DDR4: ৳2,500-৳7,000, 32GB DDR4: ৳5,000-৳15,000)',
      'Motherboard Chips': '৳300 - ৳25,000 (Entry Level: ৳1,000-৳5,000, Gaming: ৳5,000-৳15,000, Workstation: ৳10,000-৳25,000)',
      'SSD Chips': '৳150 - ৳20,000 (120GB: ৳500-৳1,500, 256GB: ৳1,000-৳3,000, 512GB: ৳2,000-৳6,000, 1TB: ৳4,000-৳12,000)',
      'Power Supply Chips': '৳100 - ৳8,000 (450W: ৳500-৳1,500, 650W: ৳1,000-৳3,000, 850W: ৳2,000-৳6,000, 1000W+: ৳3,000-৳8,000)',
      'Other Chips': '৳50 - ৳10,000 (Cooling fans, cables, adapters, etc.)'
    };
    return suggestions[category] || '৳50 - ৳10,000 (Contact us for specific guidance)';
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!imageDataUrl) {
      setErrorMessage('Please upload a product image');
      setLoading(false);
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
      const now = new Date().toISOString();
      const trackingId = data.trackingId?.trim() || `ORD-${Date.now()}`;

      const payload = {
        productName: data.productName,
        productCategory: data.productCategory,
        productCondition: data.productCondition,
        productPrice: parseFloat(data.productPrice),
        productPriceRange: data.productPriceRange,
        productDescription: data.productDescription,
        productImage: imageDataUrl,
        productLocation: data.productLocation,
        productContactNumber: data.productContactNumber,

        trackingId,
        customerEmail: data.customerEmail || null,
        customerPhone: data.productContactNumber,
        askingPrice: parseFloat(data.productPrice),
        pickupLocation: {
          address: data.productLocation,
          coordinates: { lat: null, lng: null },
        },
        activity_log: {
          createdAt: now,
          assignedAt: null,
          pickedAt: null,
          deliveredAt: null,
          inspectedAt: null,
          pricedAt: null,
          customerDecidedAt: null,
          finalizedAt: null,
        },
      };

      const response = await fetch(`${apiBaseUrl}/api/product-lifecycle/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create sell post');
      }

      setSuccessMessage(`Sell post created successfully! Tracking ID: ${trackingId}`);
      reset();
      setImageDataUrl('');
      setImageFileName('');
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
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
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
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
                <option value="">Choose a chip category</option>
                <option value="CPU Chips">CPU Chips (Processors)</option>
                <option value="GPU Chips">GPU Chips (Graphics Cards)</option>
                <option value="RAM Chips">RAM Chips (Memory)</option>
                <option value="Motherboard Chips">Motherboard Chips</option>
                <option value="SSD Chips">SSD Chips (Storage)</option>
                <option value="Power Supply Chips">Power Supply Chips</option>
                <option value="Other Chips">Other Computer Chips</option>
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
              <Label htmlFor="productPrice" className="text-gray-700 font-semibold">Price (৳) *</Label>
              <Input
                id="productPrice"
                type="number"
                step="500"
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

            {/* Price Range */}
            <div>
              <Label htmlFor="productPriceRange" className="text-gray-700 font-semibold">Price Range *</Label>
              <select
                id="productPriceRange"
                {...register('productPriceRange', { required: 'Price range is required' })}
                className="w-full mt-2 px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              >
                <option value="">Select price range</option>
                <option value="0-1000">0 - 1,000</option>
                <option value="1000-5000">1,000 - 5,000</option>
                <option value="5000-10000">5,000 - 10,000</option>
                <option value="10000-25000">10,000 - 25,000</option>
                <option value="25000+">25,000+</option>
              </select>
              {errors.productPriceRange && <span className="text-red-500 text-sm mt-1 block">{errors.productPriceRange.message}</span>}
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

            {/* Tracking ID */}
            <div>
              <Label htmlFor="trackingId" className="text-gray-700 font-semibold">Tracking ID</Label>
              <Input
                id="trackingId"
                placeholder="e.g. ORD-20260417-001"
                {...register('trackingId')}
                className="mt-2 border-green-200 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Product Image Upload */}
            <div className="md:col-span-2">
              <Label htmlFor="productImage" className="text-gray-700 font-semibold">Product Image *</Label>
              <input
                ref={imageInputRef}
                id="productImage"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                className="mt-2 block w-full rounded-md border border-green-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="mt-1 text-xs text-gray-500">Supported: JPG, PNG, WebP (max 10MB)</p>
              {imageFileName && <p className="mt-1 text-sm text-green-700">Selected: {imageFileName}</p>}
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