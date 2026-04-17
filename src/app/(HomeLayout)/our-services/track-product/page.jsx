'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Truck, Package, AlertCircle, Search, RefreshCw } from 'lucide-react';

function TrackProduct() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  // Auto-fetch order on mount or when orderId changes via URL
  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
      handleTrack(orderIdParam);
    }
  }, [searchParams]);

  // Handle auto-refresh
  useEffect(() => {
    if (autoRefresh && orderId) {
      intervalRef.current = setInterval(() => {
        handleTrack(orderId);
      }, 5000); // Refresh every 5 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, orderId]);

  const handleTrack = async (id = orderId) => {
    if (!id.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
      console.log('[TrackOrder] Fetching from:', `${apiUrl}/api/orders/track/${id}`);
      
      const response = await fetch(`${apiUrl}/api/orders/track/${id}`);
      console.log('[TrackOrder] Response status:', response.status);
      
      const data = await response.json();
      console.log('[TrackOrder] Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Order not found');
      }

      setOrderData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[TrackOrder] Error:', err);
      setError(err.message || 'Failed to fetch order. Make sure the backend server is running at ' + (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'));
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrack();
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'ordered':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ordered':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Package className="w-4 h-4" />
            Track Your Order
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Track Your Computer Chip Order
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your order ID below to get real-time updates on your computer chip purchase status
          </p>
        </div>

        {/* Tracking Form */}
        <Card className="mb-8 shadow-lg border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Track Your Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="orderId" className="text-lg font-semibold">
                  Order ID
                </Label>
                <Input
                  id="orderId"
                  type="text"
                  placeholder="Enter your order ID (e.g., ORD-123456)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="mt-2 text-lg"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 text-lg"
                >
                  {loading ? 'Tracking...' : 'Track Order'}
                </Button>
                {orderData && (
                  <Button
                    type="button"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    variant={autoRefresh ? 'default' : 'outline'}
                    className={`px-4 ${autoRefresh ? 'bg-green-500 text-white' : ''}`}
                  >
                    <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                  </Button>
                )}
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {lastUpdated && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                  {autoRefresh && ' • Live tracking enabled'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details */}
        {orderData && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="shadow-lg border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{orderData.orderId}</span>
                  <Badge className={getStatusColor(orderData.status)}>
                    {orderData.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Product Details</h3>
                    <p className="text-lg font-medium">{orderData.productName}</p>
                    <p className="text-gray-600">{orderData.productCategory}</p>
                    <p className="text-gray-600">Condition: {orderData.productCondition}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Order Information</h3>
                    <p>Ordered on: {new Date(orderData.createdAt).toLocaleDateString()}</p>
                    <p>Price Range: {orderData.productPrice}</p>
                    <p>Location: {orderData.productLocation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card className="shadow-lg border-green-200">
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.timeline?.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-800">{step.status}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(step.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No tracking information available yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Status with Live Indicator */}
            <Card className="shadow-lg border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 mb-4">
                    {getStatusIcon(orderData.status)}
                    <h3 className="text-xl font-bold text-gray-800">Current Status</h3>
                    {autoRefresh && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                        Live
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-gray-700 mb-2 capitalize">{orderData.status}</p>
                  <p className="text-gray-600">
                    {orderData.status === 'delivered'
                      ? '✓ Your order has been successfully delivered!'
                      : orderData.status === 'shipped'
                      ? '🚚 Your order is on the way'
                      : orderData.status === 'processing'
                      ? '⚙️ Your order is being prepared'
                      : '📦 Your order is being processed. We\'ll keep you updated.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 shadow-lg border-green-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Can't find your order ID? Contact our support team for assistance.
              </p>
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TrackProduct;