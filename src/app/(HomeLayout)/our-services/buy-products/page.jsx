'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Search, Filter, ArrowLeft, MapPin, Phone, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { generatePriceRanges, formatPrice } from '@/lib/priceUtils';

function BuyProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const categories = [
    'CPU Chips',
    'GPU Chips',
    'RAM Chips',
    'Motherboard Chips',
    'SSD Chips',
    'Power Supply Chips',
    'Other Chips'
  ];

  const conditions = ['Brand New', 'Like New', 'Good', 'Fair', 'Poor'];

  const priceRanges = generatePriceRanges();

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when filters change
  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, selectedCategory, selectedCondition, maxPrice, minPrice, selectedLocation]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

      const response = await fetch(`${apiUrl}/api/products-info`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Filter to only active products
      const activeProducts = Array.isArray(data)
        ? data.filter(p => p.status === 'active' || !p.status)
        : [];

      setProducts(activeProducts);
    } catch (err) {
      console.error('[BuyProducts] Error:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.productName?.toLowerCase().includes(term) ||
          p.productCategory?.toLowerCase().includes(term) ||
          p.productDescription?.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.productCategory === selectedCategory);
    }

    // Condition filter
    if (selectedCondition) {
      filtered = filtered.filter(p => p.productCondition === selectedCondition);
    }

    // Price filter
    if (minPrice) {
      filtered = filtered.filter(p => {
        const price = extractNumericPrice(p.productPrice);
        return price >= parseFloat(minPrice);
      });
    }

    if (maxPrice) {
      filtered = filtered.filter(p => {
        const price = extractNumericPrice(p.productPrice);
        return price <= parseFloat(maxPrice);
      });
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(p =>
        p.productLocation?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const extractNumericPrice = (priceStr) => {
    if (!priceStr) return 0;
    // Extract first number from price range like "৳5,000 - ৳10,000" or "5000-10000"
    const match = priceStr.toString().match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'brand new':
        return 'bg-green-100 text-green-800';
      case 'like new':
        return 'bg-emerald-100 text-emerald-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/our-services" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 hover:underline">
            <ArrowLeft className="w-5 h-5" />
            Back to Services
          </Link>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Search className="w-4 h-4" />
              Browse Computer Chips
            </div>

            <h1 className="text-5xl font-bold mb-4 bg-linear-to-rrom-blue-600 to-blue-800 bg-clip-text text-transparent">
              Find Your Perfect Computer Chips
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore thousands of quality computer components from verified sellers. Use filters below to find exactly what you need.
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-12 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Filters & Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search Bar */}
            <div className="lg:col-span-2">
              <Label className="text-sm font-semibold mb-2 block">Search Products</Label>
              <Input
                placeholder="e.g., RTX 3080, Intel i7..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-blue-200 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Category</Label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Condition</Label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full p-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="">All Conditions</option>
                {conditions.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Min Price (৳)</Label>
              <select
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full p-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="">Any</option>
                {priceRanges.map(price => (
                  <option key={price} value={price}>
                    ৳{price.toLocaleString()} ({formatPrice(price)})
                  </option>
                ))}
              </select>
            </div>

            {/* Max Price */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Max Price (৳)</Label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full p-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="">Any</option>
                {[...priceRanges].reverse().map(price => (
                  <option key={price} value={price}>
                    ৳{price.toLocaleString()} ({formatPrice(price)})
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Location</Label>
              <Input
                placeholder="City name"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="border-2 border-blue-200 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory || selectedCondition || minPrice || maxPrice || selectedLocation) && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedCondition('');
                  setMinPrice('');
                  setMaxPrice('');
                  setSelectedLocation('');
                }}
                className="text-blue-600 hover:bg-blue-50"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Products Count */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-700">
            Showing <span className="text-blue-600 font-bold">{filteredProducts.length}</span> of <span className="text-blue-600 font-bold">{products.length}</span> products
          </div>
          <Button onClick={fetchProducts} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Search className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <p className="text-lg text-gray-600">Loading products...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-800 mb-2">Failed to Load Products</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <Button onClick={fetchProducts} className="bg-red-600 hover:bg-red-700 text-white">
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product._id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-blue-200">
                {/* Product Image */}
                <div className="h-48 bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-6xl">
                  {product.productImage ? (
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    '🔧'
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl line-clamp-2">{product.productName}</CardTitle>
                    <Badge className={getConditionColor(product.productCondition)}>
                      {product.productCondition}
                    </Badge>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    {product.productCategory}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Price */}
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-3xl font-bold text-blue-600">{product.productPrice || 'Not Listed'}</p>
                  </div>

                  {/* Description */}
                  {product.productDescription && (
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-gray-700 line-clamp-2">{product.productDescription}</p>
                    </div>
                  )}

                  {/* Location */}
                  {product.productLocation && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{product.productLocation}</span>
                    </div>
                  )}

                  {/* Contact */}
                  {product.productContactNumber && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{product.productContactNumber}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                      <Link href={`/our-services/buy-products/${product._id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 w-full">
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              {products.length === 0
                ? 'No products available yet. Check back later!'
                : 'No products match your filters. Try adjusting your search criteria.'}
            </p>
            {products.length > 0 && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedCondition('');
                  setMinPrice('');
                  setMaxPrice('');
                  setSelectedLocation('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* No Products at All */}
        {!loading && products.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Be the First to List!</h3>
            <p className="text-gray-600 mb-6">
              No computer chips are listed yet. Want to start selling?
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/our-services/create-sell-post">
                Start Selling 💚
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyProducts;
