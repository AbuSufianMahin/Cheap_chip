'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Users, TrendingUp, Shield, Star, CheckCircle, Search, ShoppingCart, Store } from 'lucide-react';
import Link from 'next/link';

function OurServices() {
  const [userType, setUserType] = useState(null); // null, 'buyer', 'seller'



  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-100 relative overflow-hidden">
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

            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 bg-clip-text text-transparent leading-tight">
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
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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

                    <Button className="w-full py-4 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                      Start Shopping 🛒
                    </Button>
                  </div>
                </div>
              </div>

              {/* Seller Card */}
              <div className="group cursor-pointer" onClick={() => setUserType('seller')}>
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-green-200 p-8 md:p-12 hover:border-green-400 hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
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

                    <Button 
                      className="w-full py-4 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                      asChild
                    >
                      <Link href="/our-services/create-sell-post">
                        Start Selling 💰
                      </Link>
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
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
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
                    <div className="h-48 bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center">
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
            <div className="text-center bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-12">
              <h3 className="text-3xl font-bold mb-4">Ready to find your perfect chips?</h3>
              <p className="text-gray-600 mb-6">Join thousands of satisfied buyers who found exactly what they needed</p>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg">
                Browse All Listings 🛒
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Seller Interface - Removed, now on separate page */}
    </div>
  );
}

export default OurServices;