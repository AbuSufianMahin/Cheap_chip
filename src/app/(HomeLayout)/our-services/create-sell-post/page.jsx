'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Info, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function CreateSellPost() {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPriceGuide, setShowPriceGuide] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const selectedCategory = watch('productCategory');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setErrorMessage('Image size must be under 10MB');
        event.target.value = '';
        setImagePreview(null);
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Please upload a valid image file (JPEG, PNG, or WebP)');
        event.target.value = '';
        setImagePreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setErrorMessage('');
    }
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

    const imageFile = document.getElementById('productImage').files[0];
    if (!imageFile) {
      setErrorMessage('Please upload a product image');
      setLoading(false);
      return;
    }

    try {
      const base64Image = imagePreview.split(',')[1];

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/product-lifecycle/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: data.productName,
          productCategory: data.productCategory,
          productCondition: data.productCondition,
          productPriceRange: data.productPriceRange,
          productDescription: data.productDescription,
          productImage: `data:${imageFile.type};base64,${base64Image}`,
          productLocation: data.productLocation,
          productContactNumber: data.productContactNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create sell post');
      }

      setSuccessMessage('🎉 Your computer chip has been listed successfully! Tech enthusiasts will see your post soon!');
      reset();
      setImagePreview(null);
      document.getElementById('productImage').value = '';

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create sell post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-100 relative overflow-hidden py-12 px-4">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/our-services"
          className="mb-8 flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Services
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span className="text-lg">🔧</span>
            Trusted by 5,000+ Tech Sellers
          </div>

          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 bg-clip-text text-transparent leading-tight">
            Sell Your Computer Chips
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl leading-relaxed">
            Turn your unused computer chips into cash! Whether it's CPU, GPU, RAM, or other computer components,
            list them here and start earning today!
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">💻</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Tech-Savvy Buyers</h3>
            <p className="text-gray-600">Connect with computer enthusiasts and professionals who know the real value</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🔧</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Quality Components</h3>
            <p className="text-gray-600">Sell genuine computer chips with detailed specifications and condition</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Fast Transactions</h3>
            <p className="text-gray-600">Quick sales for popular chips like GPUs and CPUs from ready buyers</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-200 p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">List Your Computer Chip</h2>
            <p className="text-gray-600">Fill in the details below and connect with buyers looking for quality computer hardware</p>
          </div>

          {successMessage && (
            <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-800 rounded-2xl flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <span className="font-semibold text-lg">{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-red-50 border-2 border-red-300 text-red-800 rounded-2xl flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Product Name */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
              <Label htmlFor="productName" className="text-xl font-bold text-gray-800 mb-3 block">
                What are you selling? *
              </Label>
              <Input
                id="productName"
                placeholder="e.g., Intel Core i7-10700K, RTX 3080, 16GB DDR4 RAM..."
                {...register('productName', { required: 'Product name is required' })}
                className="text-lg py-4 px-4 border-2 border-green-300 focus:ring-green-500 focus:border-green-500 rounded-xl"
              />
              {errors.productName && <span className="text-red-500 text-sm mt-2 block font-medium">{errors.productName.message}</span>}
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="productCategory" className="text-lg font-semibold text-gray-700">Category *</Label>
                <select
                  id="productCategory"
                  {...register('productCategory', { required: 'Category is required' })}
                  className="w-full py-3 px-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-lg"
                >
                  <option value="">Choose a chip category</option>
                  <option value="CPU Chips">🖥️ CPU Chips (Processors)</option>
                  <option value="GPU Chips">🎮 GPU Chips (Graphics Cards)</option>
                  <option value="RAM Chips">💾 RAM Chips (Memory)</option>
                  <option value="Motherboard Chips">🔧 Motherboard Chips</option>
                  <option value="SSD Chips">💿 SSD Chips (Storage)</option>
                  <option value="Power Supply Chips">⚡ Power Supply Chips</option>
                  <option value="Other Chips">🔌 Other Computer Chips</option>
                </select>
                {errors.productCategory && <span className="text-red-500 text-sm font-medium">{errors.productCategory.message}</span>}
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label htmlFor="productCondition" className="text-lg font-semibold text-gray-700">Condition *</Label>
                <select
                  id="productCondition"
                  {...register('productCondition', { required: 'Condition is required' })}
                  className="w-full py-3 px-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-lg"
                >
                  <option value="">Select condition</option>
                  <option value="Brand New">✨ Brand New</option>
                  <option value="Like New">🆕 Like New</option>
                  <option value="Good">👍 Good</option>
                  <option value="Fair">👌 Fair</option>
                  <option value="Poor">📦 Poor</option>
                </select>
                {errors.productCondition && <span className="text-red-500 text-sm font-medium">{errors.productCondition.message}</span>}
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="productPriceRange" className="text-lg font-semibold text-gray-700">Price Range (৳) *</Label>
                  {selectedCategory && (
                    <button
                      type="button"
                      onClick={() => setShowPriceGuide(!showPriceGuide)}
                      className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm font-medium"
                    >
                      <Info className="w-4 h-4" />
                      Price Guide
                    </button>
                  )}
                </div>
                <select
                  id="productPriceRange"
                  {...register('productPriceRange', {
                    required: 'Price range is required'
                  })}
                  className="w-full py-3 px-4 border-2 border-green-200 rounded-xl focus:ring-green-500 focus:border-green-500 text-lg bg-white"
                >
                  <option value="">Select Price Range</option>
                  <option value="0-1000">৳0 - ৳1,000</option>
                  <option value="1000-2000">৳1,000 - ৳2,000</option>
                  <option value="2000-3000">৳2,000 - ৳3,000</option>
                  <option value="3000-4000">৳3,000 - ৳4,000</option>
                  <option value="4000-5000">৳4,000 - ৳5,000</option>
                  <option value="5000-6000">৳5,000 - ৳6,000</option>
                  <option value="6000-7000">৳6,000 - ৳7,000</option>
                  <option value="7000-8000">৳7,000 - ৳8,000</option>
                  <option value="8000-9000">৳8,000 - ৳9,000</option>
                  <option value="9000-10000">৳9,000 - ৳10,000</option>
                  <option value="10000-15000">৳10,000 - ৳15,000</option>
                  <option value="15000-20000">৳15,000 - ৳20,000</option>
                  <option value="20000-25000">৳20,000 - ৳25,000</option>
                  <option value="25000-30000">৳25,000 - ৳30,000</option>
                  <option value="30000-40000">৳30,000 - ৳40,000</option>
                  <option value="40000-50000">৳40,000 - ৳50,000</option>
                  <option value="50000-75000">৳50,000 - ৳75,000</option>
                  <option value="75000-100000">৳75,000 - ৳1,00,000</option>
                  <option value="100000-150000">৳1,00,000 - ৳1,50,000</option>
                  <option value="150000-200000">৳1,50,000 - ৳2,00,000</option>
                  <option value="200000+">৳2,00,000+</option>
                </select>
                {errors.productPriceRange && <span className="text-red-500 text-sm font-medium">{errors.productPriceRange.message}</span>}

                {/* Price Guide */}
                {showPriceGuide && selectedCategory && (
                  <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-800 mb-1">Approximate Price Range:</p>
                        <p className="text-green-700 text-sm">{getPriceSuggestions(selectedCategory)}</p>
                        <p className="text-green-600 text-xs mt-2">* Prices may vary based on condition, brand, and location</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="productLocation" className="text-lg font-semibold text-gray-700">Location *</Label>
                <Input
                  id="productLocation"
                  placeholder="City, State"
                  {...register('productLocation', { required: 'Location is required' })}
                  className="py-3 px-4 border-2 border-green-200 rounded-xl focus:ring-green-500 focus:border-green-500 text-lg"
                />
                {errors.productLocation && <span className="text-red-500 text-sm font-medium">{errors.productLocation.message}</span>}
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="productContactNumber" className="text-lg font-semibold text-gray-700">Contact Number *</Label>
                <Input
                  id="productContactNumber"
                  placeholder="Your phone number"
                  {...register('productContactNumber', { required: 'Contact number is required' })}
                  className="py-3 px-4 border-2 border-green-200 rounded-xl focus:ring-green-500 focus:border-green-500 text-lg"
                />
                {errors.productContactNumber && <span className="text-red-500 text-sm font-medium">{errors.productContactNumber.message}</span>}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="productImage" className="text-lg font-semibold text-gray-700">Product Image *</Label>
                <div className="space-y-3">
                  <input
                    id="productImage"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="w-full py-3 px-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  <p className="text-sm text-gray-500">Maximum file size: 10MB. Supported formats: JPEG, PNG, WebP</p>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="max-w-48 max-h-48 object-cover rounded-lg border-2 border-green-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            document.getElementById('productImage').value = '';
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="productDescription" className="text-lg font-semibold text-gray-700">Description</Label>
              <textarea
                id="productDescription"
                placeholder="Describe your computer chip in detail. Include specifications like model number, generation, clock speed, condition, warranty status, and any other relevant technical details that buyers would want to know..."
                {...register('productDescription')}
                className="w-full py-4 px-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 h-32 resize-none text-lg"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Spinner className="w-6 h-6" />
                    <span>Creating Your Sell Post...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span>🚀 List My Computer Chip</span>
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Trust Indicators */}
          <div className="mt-8 pt-8 border-t border-green-200">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Verified Buyers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Quality Assurance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSellPost;
