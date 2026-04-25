"use client"

import axiosPublic from '@/lib/axiosPublic';
import { useQuery } from '@tanstack/react-query'

import Image from 'next/image';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import AvailableRidersDialogue from '@/components/DashboardLayout/adminRoutesUI/AvailableRidersDialogue';
import AvailableTechniciansDialogue from '@/components/DashboardLayout/adminRoutesUI/AvailableTechniciansDialogue';
import ProductLoadingSkeleton from '@/components/DashboardLayout/adminRoutesUI/ProductLoadingSkeleton';

function page() {
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);
  const { data: productData = [], isLoading, refetch: refetchProductData } = useQuery({
    queryKey: ["all-products", onlyUnassigned],
    queryFn: async () => {
      // this needs to be axiosSecure
      const result = await axiosPublic.get(`/api/products-info?unassigned=${onlyUnassigned}`);
      return result.data;
    }
  })

  console.log(productData)
  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Customer Sell Products
        </h1>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Checkbox
          id="unassigned"
          checked={onlyUnassigned}
          onCheckedChange={(checked) => setOnlyUnassigned(checked === true)}
        />
        <Label htmlFor="unassigned">Unassigned only</Label>
      </div>
      <div className="py-6 space-y-6">
        <div className="grid lg:grid-cols-2 gap-y-2 gap-x-4">

          {
            isLoading ?

              Array.from({ length: 6 }).map((_, i) => (
                <ProductLoadingSkeleton key={i} />
              ))

              :

              productData.map((product, index) => (
                <div
                  key={product._id}
                  className="rounded-lg shadow-sm p-6 sm:px-6 sm:py-2 flex flex-col sm:flex-row gap-4 sm:items-center"
                >
                  <div className="relative w-full sm:w-32 h-32"> {/* or any size */}
                    <Image
                      src={product.productImage}
                      fill
                      className="rounded-md object-cover"
                      alt={`${product.productName} image`}
                      priority={index < 3}
                    />
                  </div>

                  <div className="flex-1 flex gap-2 flex-col xl:flex-row xl:items-center justify-between">
                    <div>
                      <h2 className="font-semibold">{product.productName}</h2>
                      <p className="text-sm text-gray-500">
                        {product.productDescription}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        Asking Price:{" "}
                        <span className="font-medium">
                          {typeof product.askingPrice === "number" ? `৳${product.askingPrice}` : "Not set"}
                        </span>
                      </p>
                    </div>
                    <div className='flex gap-2 flex-wrap xl:w-fit'>
                      {
                        product.assignedDeliveryman === null &&
                        <AvailableRidersDialogue product={product} />
                      }

                      {
                        product.assignedTechnician === null &&
                        <AvailableTechniciansDialogue product={product} />
                      }
                    </div>
                  </div>
                </div>
              ))

          }
        </div>
      </div>
    </section>
  )
}

export default page