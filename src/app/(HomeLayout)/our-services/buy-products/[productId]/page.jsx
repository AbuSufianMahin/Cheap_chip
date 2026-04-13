'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Phone, Mail, Calendar, AlertCircle, Share2, Heart } from 'lucide-react';
import Link from 'next/link';

function ProductDetails() {
  const params = useParams();
  const productId = params.productId;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
      console.log('[ProductDetails] Fetching product:', productId);

      const response = await fetch(`${apiUrl}/api/product-lifecycle/${productId}`);
      console.log('[ProductDetails] Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - Product not found`);
      }

      const data = await response.json();
      console.log('[ProductDetails] Product data:', data);
      setProduct(data);
    } catch (err) {
      console.error('[ProductDetails] Error:', err);
      setError(err.message || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <Spinner className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/our-services/buy-products" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 hover:underline">
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </Link>

          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Product</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <div className="flex gap-3">
                  <Button onClick={fetchProductDetails} className="bg-red-600 hover:bg-red-700 text-white">
                    Try Again
                  </Button>
                  <Button asChild variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <Link href="/our-services/buy-products">
                      Back to Products
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/our-services/buy-products" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 hover:underline">
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </Link>

          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h3>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/our-services/buy-products">
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link href="/our-services/buy-products" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 hover:underline">
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-white rounded-2xl p-8 shadow-lg border border-blue-200 h-96">
            {product.productImage ? (
              <img
                src={product.productImage}
                alt={product.productName}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-8xl">🔧</div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Badges */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-4xl font-bold text-gray-800 leading-tight">{product.productName}</h1>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {product.productCategory && (
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    {product.productCategory}
                  </Badge>
                )}
                {product.productCondition && (
                  <Badge className={`${getConditionColor(product.productCondition)} text-sm py-1 px-3`}>
                    {product.productCondition}
                  </Badge>
                )}
                {product.status && (
                  <Badge variant="outline" className="text-sm py-1 px-3">
                    {product.status === 'active' ? '✓ Available' : 'Unavailable'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Price */}
            {product.productPrice && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <p className="text-gray-600 text-sm mb-1">Price</p>
                <p className="text-4xl font-bold text-blue-600">{product.productPrice}</p>
              </div>
            )}

            {/* Location and Contact */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.productLocation && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-800">{product.productLocation}</p>
                    </div>
                  </div>
                )}

                {product.productContactNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Contact Number</p>
                      <a
                        href={`tel:${product.productContactNumber}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {product.productContactNumber}
                      </a>
                    </div>
                  </div>
                )}

                {product.createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Posted</p>
                      <p className="font-semibold text-gray-800">{formatDate(product.createdAt)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl">
                <Phone className="w-5 h-5 mr-2" />
                Call Seller
              </Button>
              <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-6 text-lg font-semibold rounded-xl">
                <Mail className="w-5 h-5 mr-2" />
                Message
              </Button>
            </div>

            {/* Share Button */}
            <Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-4">
              <Share2 className="w-5 h-5 mr-2" />
              Share This Product
            </Button>
          </div>
        </div>

        {/* Description and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Main Description */}
          <div className="lg:col-span-2">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {product.productDescription || 'No description provided by the seller.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Specifications */}
          <div>
            <Card className="border-blue-200 sticky top-4">
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.productCategory && (
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold text-gray-800">{product.productCategory}</p>
                  </div>
                )}

                {product.productCondition && (
                  <div>
                    <p className="text-sm text-gray-600">Condition</p>
                    <p className="font-semibold text-gray-800">{product.productCondition}</p>
                  </div>
                )}

                {product.status && (
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold text-gray-800">
                      {product.status === 'active' ? '✓ Available' : 'Not Available'}
                    </p>
                  </div>
                )}

                {product.current_status && (
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <p className="font-semibold text-gray-800 capitalize">{product.current_status}</p>
                  </div>
                )}

                {product._id && (
                  <div>
                    <p className="text-sm text-gray-600">Product ID</p>
                    <p className="font-mono text-xs text-gray-600 break-all">{product._id}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        {(product.repairLog?.length > 0 || Object.keys(product.activity_log || {}).length > 0) && (
          <div className="mt-12">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle>Product History</CardTitle>
              </CardHeader>
              <CardContent>
                {product.activity_log && Object.keys(product.activity_log).length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 mb-3">Activity Log</h4>
                    {Object.entries(product.activity_log).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-200 text-sm">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-semibold text-gray-800">
                          {typeof value === 'object' ? JSON.stringify(value) : value?.toString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Similar Products Suggestion */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-200 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Looking for more products?</h3>
          <p className="text-gray-600 mb-6">Browse our full catalog to find other computer chips and components.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            <Link href="/our-services/buy-products">
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
