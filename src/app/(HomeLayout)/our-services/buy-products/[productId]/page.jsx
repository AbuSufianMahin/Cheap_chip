'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Phone, Calendar, AlertCircle, Share2, Heart } from 'lucide-react';
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productId]);

	const fetchProductDetails = async () => {
		try {
			setLoading(true);
			setError('');
			const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

			const response = await fetch(`${apiUrl}/api/product-lifecycle/${productId}`);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status} - Product not found`);
			}

			const data = await response.json();
			setProduct(data);
		} catch (err) {
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
				day: 'numeric',
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
								<Button onClick={fetchProductDetails} className="bg-red-600 hover:bg-red-700 text-white">
									Try Again
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!product) return null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 py-12 px-4">
			<div className="max-w-6xl mx-auto">
				<Link href="/our-services/buy-products" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 hover:underline">
					<ArrowLeft className="w-5 h-5" />
					Back to Products
				</Link>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="flex items-center justify-center bg-white rounded-2xl p-8 shadow-lg border border-blue-200 h-96">
						{product.productImage ? (
							<img src={product.productImage} alt={product.productName} className="w-full h-full object-cover rounded-lg" />
						) : (
							<div className="text-8xl">🔧</div>
						)}
					</div>

					<div className="space-y-6">
						<div>
							<div className="flex items-start justify-between gap-4 mb-4">
								<h1 className="text-4xl font-bold text-gray-800 leading-tight">{product.productName}</h1>
								<button
									onClick={() => setIsFavorite(!isFavorite)}
									className="p-3 rounded-full hover:bg-red-50 transition-colors"
								>
									<Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
								</button>
							</div>

							<div className="flex flex-wrap gap-2 mb-4">
								{product.productCategory && (
									<Badge variant="secondary" className="text-sm py-1 px-3">{product.productCategory}</Badge>
								)}
								{product.productCondition && (
									<Badge className={`${getConditionColor(product.productCondition)} text-sm py-1 px-3`}>
										{product.productCondition}
									</Badge>
								)}
							</div>
						</div>

						{product.productPrice && (
							<div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
								<p className="text-gray-600 text-sm mb-1">Price</p>
								<p className="text-4xl font-bold text-blue-600">{product.productPrice}</p>
							</div>
						)}

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
											<a href={`tel:${product.productContactNumber}`} className="font-semibold text-blue-600 hover:underline">
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

						<Button variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-4">
							<Share2 className="w-5 h-5 mr-2" />
							Share This Product
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProductDetails;
