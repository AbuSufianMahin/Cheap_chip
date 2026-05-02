'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, AlertCircle, CheckCircle, DollarSign, Clock } from 'lucide-react';
import axiosPublic from '@/lib/axiosPublic';

const PRODUCT_TYPES = [
  'CPU Processor (Intel/AMD)',
  'CPU Processor (Old Legacy)',
  'Server CPU',
  'ARM Processor',
];

const USAGE_OPTIONS = [
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '9m', label: '9 Months' },
  { value: '12m', label: '1 Year' },
  { value: '2y', label: '2 Years+' },
  { value: '3y', label: '3 Years+' },
];

const RELEASE_YEARS = Array.from({ length: 12 }, (_, i) => 2015 + i); // 2015-2026

const CONDITIONS = [
  { value: 'poor', label: 'Poor - Multiple issues', damagePercent: 70 },
  { value: 'fair', label: 'Fair - Some issues', damagePercent: 50 },
  { value: 'good', label: 'Good - Minor issues', damagePercent: 30 },
  { value: 'excellent', label: 'Excellent - Like new', damagePercent: 10 },
];

const PROBLEM_OPTIONS = [
  { id: 'cores_failure', label: '🔴 Core Failure (One or more cores dead)', baseDays: 5, basePrice: 2500 },
  { id: 'thermal', label: '🔥 Thermal Issues (Overheating/Poor contact)', baseDays: 3, basePrice: 1500 },
  { id: 'voltage_unstable', label: '⚡ Unstable Voltage (Crashes/Freezes)', baseDays: 4, basePrice: 2000 },
  { id: 'cache_fault', label: '💾 Cache Memory Fault', baseDays: 5, basePrice: 2800 },
  { id: 'low_performance', label: '⏱️ Low Performance (Below specs)', baseDays: 3, basePrice: 1800 },
  { id: 'not_detected', label: '❌ Not Detected by System', baseDays: 4, basePrice: 2200 },
  { id: 'socket_damage', label: '🔗 Socket/Pin Damage', baseDays: 6, basePrice: 3500 },
  { id: 'corrupted_microcode', label: '📝 Corrupted Microcode', baseDays: 4, basePrice: 2000 },
  { id: 'bent_pins', label: '📌 Bent/Broken Pins', baseDays: 6, basePrice: 3800 },
  { id: 'power_delivery_issue', label: '⚙️ Power Delivery Issue', baseDays: 5, basePrice: 2600 },
];

export default function RepairProduct() {
  const [step, setStep] = useState('details'); // 'details', 'problems', 'quote', 'confirmation'

  // Form data
  const [productType, setProductType] = useState('');
  const [productModel, setProductModel] = useState('');
  const [condition, setCondition] = useState('good');
  const [usageMonths, setUsageMonths] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [description, setDescription] = useState('');

  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState(null);

  const toggleProblem = (problemId) => {
    setSelectedProblems((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId]
    );
  };

  const calculateQuote = () => {
    if (!productType || !condition || selectedProblems.length === 0) {
      setError('Please select product type, condition, and at least one problem');
      return;
    }

    setError('');

    // Get condition damage multiplier
    const conditionData = CONDITIONS.find((c) => c.value === condition);
    const conditionMultiplier = 1 + conditionData.damagePercent / 100;

    // Calculate base time and price from selected problems
    let totalBaseDays = 0;
    let totalBasePrice = 0;

    selectedProblems.forEach((problemId) => {
      const problem = PROBLEM_OPTIONS.find((p) => p.id === problemId);
      if (problem) {
        totalBaseDays += problem.baseDays;
        totalBasePrice += problem.basePrice;
      }
    });

    // Apply condition multiplier
    const estimatedDays = Math.ceil(totalBaseDays * conditionMultiplier);
    const estimatedPrice = Math.ceil(totalBasePrice * conditionMultiplier);

    // Age factor (if release year provided)
    let ageMultiplier = 1;
    if (releaseYear) {
      const releaseYr = parseInt(releaseYear);
      const currentYear = new Date().getFullYear();
      const ageYears = currentYear - releaseYr;

      if (ageYears > 8) {
        ageMultiplier = 1.5;
      } else if (ageYears > 5) {
        ageMultiplier = 1.3;
      } else if (ageYears > 3) {
        ageMultiplier = 1.15;
      }
    }

    const finalDays = Math.ceil(estimatedDays * ageMultiplier);
    const finalPrice = Math.ceil(estimatedPrice * ageMultiplier);

    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + finalDays);

    setQuote({
      productType,
      productModel,
      condition: conditionData.label,
      problems: selectedProblems.map(
        (id) => PROBLEM_OPTIONS.find((p) => p.id === id).label
      ),
      estimatedDays: finalDays,
      estimatedPrice: finalPrice,
      completionDate: completionDate.toLocaleDateString(),
      conditionMultiplier: conditionMultiplier.toFixed(2),
      ageMultiplier: ageMultiplier.toFixed(2),
    });

    setStep('quote');
  };

  const handleReset = () => {
    setStep('details');
    setProductType('');
    setProductModel('');
    setCondition('good');
    setUsageMonths('');
    setReleaseYear('');
    setSelectedProblems([]);
    setDescription('');
    setQuote(null);
    setError('');
    setTrackingId(null);
  };

  const handleRequestRepair = async () => {
    setLoading(true);
    setError('');

    try {
      const repairData = {
        productType,
        productModel,
        condition,
        usageMonths,
        releaseYear,
        problems: selectedProblems.map(
          (id) => PROBLEM_OPTIONS.find((p) => p.id === id).label
        ),
        estimatedDays: quote.estimatedDays,
        estimatedPrice: quote.estimatedPrice,
        estimatedCompletionDate: quote.completionDate,
        additionalDetails: description,
      };

      const response = await axiosPublic.post('/api/repair-requests', repairData);
      const data = response.data;
  

      if (!data.success) {
        throw new Error(data.message || 'Failed to submit repair request');
      }

      setTrackingId(data.trackingId);
      setStep('confirmation');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to submit repair request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Wrench className="w-4 h-4" />
            CPU Repair Estimation
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            CPU Repair Quote
          </h1>
          <p className="text-xl text-gray-600 max-w-xl mx-auto">
            Get instant repair time & price estimate for your CPU processor
          </p>
        </div>

        {/* Step 1: Product Details */}
        {step === 'details' && (
          <Card className="mb-8 shadow-lg border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⚙️</span>
                CPU Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Type */}
              <div>
                <Label className="text-lg font-semibold">CPU Type *</Label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select CPU type</option>
                  {PRODUCT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* CPU Model */}
              <div>
                <Label className="text-lg font-semibold">CPU Model</Label>
                <Input
                  placeholder="e.g., Intel i9-13900K, AMD Ryzen 7 5800X3D, Intel Pentium 4..."
                  value={productModel}
                  onChange={(e) => setProductModel(e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Physical Condition */}
              <div>
                <Label className="text-lg font-semibold">Physical Condition *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond.value}
                      onClick={() => setCondition(cond.value)}
                      className={`p-3 border-2 rounded-lg transition ${condition === cond.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                        }`}
                    >
                      <p className="font-semibold text-sm">{cond.label}</p>
                      <p className="text-xs text-gray-500">+{cond.damagePercent}% cost</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Usage Duration */}
              <div>
                <Label className="text-lg font-semibold">Approximate Usage Duration *</Label>
                <select
                  value={usageMonths}
                  onChange={(e) => setUsageMonths(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select usage duration</option>
                  {USAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Release Year */}
              <div>
                <Label className="text-lg font-semibold">CPU Release Year *</Label>
                <select
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select release year</option>
                  {RELEASE_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={() => setStep('problems')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg"
              >
                Next: Select Problems →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Problem Selection */}
        {step === 'problems' && (
          <Card className="mb-8 shadow-lg border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🔍</span>
                What Problems Does It Have? *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                {PROBLEM_OPTIONS.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => toggleProblem(problem.id)}
                    className={`p-4 border-2 rounded-lg text-left transition ${selectedProblems.includes(problem.id)
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{problem.label}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          ~{problem.baseDays} days | {problem.basePrice.toLocaleString()} ৳
                        </p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${selectedProblems.includes(problem.id)
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-300'
                          }`}
                      >
                        {selectedProblems.includes(problem.id) && (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Additional Details */}
              <div>
                <Label className="text-lg font-semibold">Additional Details (Optional)</Label>
                <textarea
                  placeholder="Describe any other issues or concerns..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
                />
              </div>

              {error && (
                <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep('details')}
                  variant="outline"
                  className="flex-1 py-6"
                >
                  ← Back
                </Button>
                <Button
                  onClick={calculateQuote}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg"
                >
                  Get Quote →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Quote Result */}
        {step === 'quote' && quote && (
          <Card className="mb-8 shadow-lg border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Your Repair Quote
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Summary */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Device Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-semibold">{quote.productType}</span>
                  </div>
                  {productModel && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-semibold">{productModel}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Condition:</span>
                    <span className="font-semibold">{quote.condition}</span>
                  </div>
                </div>
              </div>

              {/* Problems */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-gray-800 mb-3">Issues Found</h4>
                <div className="space-y-2">
                  {quote.problems.map((problem, idx) => (
                    <Badge key={idx} variant="secondary" className="mr-2 mb-2">
                      {problem}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Estimate */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Estimated Time</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{quote.estimatedDays}</p>
                  <p className="text-sm text-gray-600">business days</p>
                  <p className="text-xs text-gray-500 mt-2">Ready by: {quote.completionDate}</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">Repair Cost</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{quote.estimatedPrice.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">৳ Taka</p>
                </div>
              </div>

              {/* Multipliers Info */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
                <p className="text-gray-600 mb-2">
                  <strong>💡 How We Calculate:</strong>
                </p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Base cost: {selectedProblems.length} problem(s) from 500-3,800 ৳ each</li>
                  <li>• CPU condition: +{(quote.conditionMultiplier - 1) * 100}% adjustment</li>
                  <li>• CPU age: {quote.ageMultiplier > 1 ? `+${(quote.ageMultiplier - 1) * 100}%` : 'standard'} adjustment</li>
                  <li>• Price range: 500 ৳ (battery) to 10,000+ ৳ (multiple issues)</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 py-6"
                >
                  Get Another Quote
                </Button>
                <Button
                  onClick={handleRequestRepair}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6"
                >
                  {loading ? 'Submitting...' : 'Request Repair 🔧'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation with Tracking ID */}
        {step === 'confirmation' && trackingId && (
          <Card className="mb-8 shadow-lg border-green-300 bg-linear-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 text-center justify-center">
                <CheckCircle className="w-6 h-6" />
                Repair Request Submitted ✓
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Your repair tracking number is:</p>
                <div className="bg-white border-4 border-green-600 rounded-lg p-6 mb-4">
                  <p className="text-5xl font-bold text-green-600 font-mono tracking-widest">
                    {trackingId}
                  </p>
                </div>
                <p className="text-gray-600 text-sm">Save this number to track your repair</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="font-semibold text-gray-800 mb-3">📋 Repair Summary</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>CPU:</strong> {productType} {productModel ? `(${productModel})` : ''}</p>
                  <p><strong>Estimated Cost:</strong> {quote.estimatedPrice.toLocaleString()} ৳</p>
                  <p><strong>Estimated Duration:</strong> {quote.estimatedDays} business days</p>
                  <p><strong>Ready by:</strong> {quote.completionDate}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-800 mb-2">🔗 Track Your Repair</p>
                <p className="text-sm text-gray-700 mb-4">
                  Go to the "Track Order" page and enter your tracking ID above to monitor real-time repair status
                </p>
                <Link href="/our-services/track-product">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
                    Go to Track Order Page →
                  </Button>
                </Link>
              </div>

              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full py-6"
              >
                Start New Quote
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
