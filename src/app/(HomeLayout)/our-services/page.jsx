'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { DollarSign, Users, TrendingUp, Shield, Star, CheckCircle, Info, Search, ShoppingCart, Store } from 'lucide-react';

function OurServices() {
  const [userType, setUserType] = useState(null); // null, 'buyer', 'seller'
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
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setErrorMessage('Image size must be under 10MB');
        event.target.value = '';
        setImagePreview(null);
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Please upload a valid image file (JPEG, PNG, or WebP)');
        event.target.value = '';
        setImagePreview(null);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous error
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

    // Check if image is uploaded
    const imageFile = document.getElementById('productImage').files[0];
    if (!imageFile) {
      setErrorMessage('Please upload a product image');
      setLoading(false);
      return;
    }

    try {
      // For now, we'll convert the image to base64 and send as URL
      // In a real application, you'd upload to a cloud storage service
      const base64Image = imagePreview.split(',')[1]; // Remove data:image/jpeg;base64, prefix

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
      setImagePreview(null); // Clear image preview
      document.getElementById('productImage').value = ''; // Clear file input

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create sell post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-green-50 to-emerald-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-20 animate-bounce">
        <Store className="w-8 h-8 text-green-400 opacity-60" />
      </div>
      <div className="absolute top-40 right-32 animate-bounce" style={{ animationDelay: '1s' }}>
        <ShoppingCart className="w-8 h-8 text-emerald-400 opacity-60" />
      </div>
      <div className="absolute bottom-32 left-32 animate-bounce" style={{ animationDelay: '2s' }}>
        <Search className="w-8 h-8 text-green-500 opacity-60" />
      </div>

      {/* Landing Page - Choose User Type */}
      {userType === null && (
        <div className="relative z-10 py-12 px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="text-lg">🔧</span>
              Welcome to Cheap Chip Marketplace
            </div>

            <h1 className="text-6xl font-bold mb-6 bg-linear-to-rrom-green-600 via-emerald-600 to-green-800 bg-clip-text text-transparent leading-tight">
              What brings you here today?
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join our thriving community of tech enthusiasts. Whether you're looking to buy quality computer chips
              or sell your unused hardware, we've got you covered!
            </p>
          </div>

          {/* User Type Selection */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Buyer Card */}
              <div className="group cursor-pointer" onClick={() => setUserType('buyer')}>
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-green-200 p-8 md:p-12 hover:border-green-400 hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <ShoppingCart className="w-10 h-10 text-white" />
                    </div>

                    <h3 className="text-3xl font-bold text-gray-800 mb-4">I'm a Buyer</h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      Looking for quality computer chips? Browse thousands of listings from trusted sellers
                      and find the perfect components for your build.
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span>Verified sellers & quality products</span>
                      </div>
                      <div className="flex items-center gap-3 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span>Competitive prices & great deals</span>
                      </div>
                      <div className="flex items-center gap-3 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span>Secure transactions & fast delivery</span>
                      </div>
                    </div>

                    <Button className="w-full py-4 text-lg bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                      Start Shopping 🛒
                    </Button>
                  </div>
                </div>
              </div>

              {/* Seller Card */}
              <div className="group cursor-pointer" onClick={() => setUserType('seller')}>
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-green-200 p-8 md:p-12 hover:border-green-400 hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-linear-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Store className="w-10 h-10 text-white" />
                    </div>

                    <h3 className="text-3xl font-bold text-gray-800 mb-4">I'm a Seller</h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      Got unused computer chips? List your hardware and connect with buyers
                      looking for quality components at great prices.
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span>Reach thousands of potential buyers</span>
                      </div>
                      <div className="flex items-center gap-3 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span>Easy listing with price guidance</span>
                      </div>
                      <div className="flex items-center gap-3 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span>Secure platform & fast payments</span>
                      </div>
                    </div>

                    <Button className="w-full py-4 text-lg bg-linear-to-rrom-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-green-500/25">
                      Start Selling 💰
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-green-600 mb-2">5,000+</div>
                  <div className="text-gray-600">Active Sellers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">15,000+</div>
                  <div className="text-gray-600">Computer Chips Listed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">50,000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buyer Interface */}
      {userType === 'buyer' && (
        <div className="relative z-10 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => setUserType(null)}
              className="mb-8 flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
            >
              ← Back to Main Menu
            </button>

            {/* Buyer Hero */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Find Your Perfect Computer Chips
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Browse thousands of quality computer components from trusted sellers
              </p>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label className="text-lg font-semibold">Search Chips</Label>
                  <Input
                    placeholder="e.g., RTX 3080, Intel i7..."
                    className="mt-2 py-3"
                  />
                </div>
                <div>
                  <Label className="text-lg font-semibold">Category</Label>
                  <select className="w-full mt-2 py-3 px-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option>All Categories</option>
                    <option>CPU Chips</option>
                    <option>GPU Chips</option>
                    <option>RAM Chips</option>
                    <option>SSD Chips</option>
                    <option>Motherboard Chips</option>
                    <option>Power Supply Chips</option>
                  </select>
                </div>
                <div>
                  <Label className="text-lg font-semibold">Max Price (৳)</Label>
                  <Input
                    type="number"
                    placeholder="50000"
                    className="mt-2 py-3"
                  />
                </div>
                <div className="flex items-end">
                  <Button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Products */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Featured Computer Chips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Sample Product Cards */}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="h-48 bg-linear-to-rrom-green-100 to-blue-100 flex items-center justify-center">
                      <span className="text-6xl">🔧</span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2">RTX 3080 GPU Chip</h3>
                      <p className="text-gray-600 mb-4">Brand new, warranty included</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-600">৳85,000</span>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-linear-to-r from-blue-50 to-green-50 rounded-3xl p-12">
              <h3 className="text-3xl font-bold mb-4">Ready to find your perfect chips?</h3>
              <p className="text-gray-600 mb-6">Join thousands of satisfied buyers who found exactly what they needed</p>
              <Button className="bg-linear-to-rrom-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg">
                Browse All Listings 🛒
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Seller Interface */}
      {userType === 'seller' && (
        <div className="relative z-10 py-12 px-4">
          {/* Back Button */}
          <button
            onClick={() => setUserType(null)}
            className="mb-8 flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
          >
            ← Back to Main Menu
          </button>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="text-lg">🔧</span>
              Trusted by 5,000+ Tech Sellers
            </div>

            <h1 className="text-6xl font-bold mb-6 bg-linear-to-rrom-green-600 via-emerald-600 to-green-800 bg-clip-text text-transparent leading-tight">
              Sell Your Computer Chips
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Turn your unused computer chips into cash! Whether it's CPU, GPU, RAM, or other computer components,
              list them here and start earning today!
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-200 p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">List Your Computer Chip</h2>
                <p className="text-gray-600">Fill in the details below and connect with buyers looking for quality computer hardware</p>
              </div>

              {successMessage && (
                <div className="mb-6 p-6 bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-800 rounded-2xl flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                  <span className="font-semibold text-lg">{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-6 bg-linear-to-r from-red-50 to-red-50 border-2 border-red-300 text-red-800 rounded-2xl flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <span className="font-semibold">{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Product Name - Hero Field */}
                <div className="bg-linear-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
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
                    <div className="relative">
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
                    </div>
                    {errors.productPriceRange && <span className="text-red-500 text-sm font-medium">{errors.productPriceRange.message}</span>}

                    {/* Price Guide */}
                    {showPriceGuide && selectedCategory && (
                      <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
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
                    className="w-full h-16 bg-linear-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25"
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
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-500" />
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
      )}
    </div>
  );
}

export default OurServices;