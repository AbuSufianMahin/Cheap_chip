'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Truck, CheckCircle, Clock, Search, Eye, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import axiosPublic from '@/lib/axiosPublic';

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [repairRequests, setRepairRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'repairs'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchOrders();
        if (activeTab === 'repairs') {
          fetchRepairRequests();
        }
      }, 5000);
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
  }, [autoRefresh, activeTab]);

  const fetchOrders = async () => {
    try {
      // For now, we'll use a mock user ID. In a real app, this would come from authentication
      const userId = 'test-user-123'; // Replace with actual user ID from auth context

      const response = await axiosPublic.get(`/api/orders/user/${userId}`);
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchRepairRequests = async () => {
    try {
      const trackingId = searchTerm.trim();
      if (!trackingId) {
        setRepairRequests([]);
        return;
      }

      const response = await fetch(
        `/api/repair-requests?trackingId=${trackingId}`
      );
      const data = await response.json();

      if (response.ok) {
        setRepairRequests([data.data]);
        setError('');
      } else {
        setRepairRequests([]);
        setError('Repair request not found');
      }
    } catch (err) {
      setRepairRequests([]);
      setError('Failed to fetch repair request');
    }
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
        return <Package className="w-5 h-5 text-gray-500" />;
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

  const filteredOrders = orders.filter(order =>
    order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'orders' ? 'My Orders' : 'Track Repairs'}
          </h1>
          <p className="text-gray-600 mt-1">
            {activeTab === 'orders'
              ? 'Track and manage your computer chip orders'
              : 'Track your CPU repair requests by 6-digit ID'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'default' : 'outline'}
            className={autoRefresh ? 'bg-green-500 text-white' : ''}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => {
            setActiveTab('orders');
            setError('');
            setSearchTerm('');
          }}
          className={`py-3 px-4 font-semibold transition ${
            activeTab === 'orders'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Product Orders
        </button>
        <button
          onClick={() => {
            setActiveTab('repairs');
            setError('');
            setSearchTerm('');
          }}
          className={`py-3 px-4 font-semibold transition ${
            activeTab === 'repairs'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span className="mr-2">🔧</span>
          Repair Requests
        </button>
      </div>

      {/* Search - for Orders */}
      {activeTab === 'orders' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Orders</Label>
                <Input
                  id="search"
                  placeholder="Search by order ID or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search - for Repairs */}
      {activeTab === 'repairs' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="repair-search">Enter 6-Digit Tracking ID</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="repair-search"
                    placeholder="e.g., 123456"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength="6"
                    className="mt-0 font-mono text-lg tracking-widest"
                  />
                  <Button
                    onClick={fetchRepairRequests}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <span className="text-red-500">⚠️</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      {activeTab === 'orders' && (
        <>
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t placed any orders yet'}
                  </p>
                  {!searchTerm && (
                    <Link href="/our-services">
                      <Button className="bg-green-600 hover:bg-green-700">
                        Browse Products
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredOrders.map((order) => (
                <Card key={order._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        {order.product?.productImage ? (
                          <img
                            src={order.product.productImage}
                            alt={order.product.productName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{order.product?.productName || 'Product'}</h3>
                        <p className="text-sm text-gray-600">{order.product?.productCategory}</p>
                        <p className="text-sm text-gray-600">Price: {order.product?.productPrice}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/dashboard/user/track-product?orderId=${order.orderId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Track
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Repair Requests Display */}
      {activeTab === 'repairs' && (
        <>
          {repairRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🔧</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No repair request found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'Check your tracking ID and try again' : 'Enter your 6-digit tracking ID to view repair status'}
                  </p>
                  <Link href="/our-services/repair-product">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      Request CPU Repair
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {repairRequests.map((repair) => (
                <Card key={repair._id} className="hover:shadow-lg transition-shadow border-orange-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-orange-600 font-mono">
                            {repair.trackingId}
                          </span>
                          <Badge
                            className={`${
                              repair.status === 'submitted'
                                ? 'bg-blue-100 text-blue-800'
                                : repair.status === 'in-progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : repair.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {repair.status?.charAt(0).toUpperCase() + repair.status?.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Submitted: {new Date(repair.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* CPU Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">CPU Information</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Type</p>
                          <p className="font-semibold">{repair.productType}</p>
                        </div>
                        {repair.productModel && (
                          <div>
                            <p className="text-gray-600">Model</p>
                            <p className="font-semibold">{repair.productModel}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-600">Condition</p>
                          <p className="font-semibold">{repair.condition}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Usage</p>
                          <p className="font-semibold">{repair.usageMonths}</p>
                        </div>
                      </div>
                    </div>

                    {/* Problems */}
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Problems Reported</h4>
                      <div className="flex flex-wrap gap-2">
                        {repair.problems?.map((problem, idx) => (
                          <Badge key={idx} variant="secondary">
                            {problem}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Repair Timeline</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Estimated Duration</p>
                          <p className="text-2xl font-bold text-blue-600">{repair.estimatedDays}</p>
                          <p className="text-xs text-gray-600">business days</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Estimated Cost</p>
                          <p className="text-2xl font-bold text-green-600">
                            {repair.estimatedPrice?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">৳ Taka</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Completion Date</p>
                          <p className="font-semibold">{repair.estimatedCompletionDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status History */}
                    {repair.statusHistory && repair.statusHistory.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">Status Updates</h4>
                        <div className="space-y-3">
                          {repair.statusHistory.map((update, idx) => (
                            <div key={idx} className="flex gap-3">
                              <div className="w-3 h-3 rounded-full bg-green-600 mt-1.5 shrink-0" />
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {update.status?.charAt(0).toUpperCase() + update.status?.slice(1)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(update.timestamp).toLocaleString()}
                                </p>
                                {update.message && (
                                  <p className="text-sm text-gray-700 mt-1">{update.message}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserOrders;