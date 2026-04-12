"use client"

import axiosPublic from '@/lib/axiosPublic';
import { useQuery } from '@tanstack/react-query'

import Image from 'next/image';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import AvailableRidersDialogue from '@/components/DashboardLayout/adminRoutesUI/AvailableRidersDialogue';

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

  return (
    <section>
      {
        isLoading ?
          <p>loading....</p> :
          <div className="p-6 space-y-6">
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
            {/* Product List (Infinite Scroll Container) */}
            <div className="grid lg:grid-cols-2 gap-y-2 gap-x-4">

              {/* Replace this map with real data */}
              {productData.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-xl px-6 py-2 flex gap-4 items-center"
                >
                  <Image
                    src={product.image}
                    className="rounded-md object-cover"
                    width={128}
                    height={128}
                    alt={`${product.name} image`}
                    priority
                  />

                  <div className="flex-1 flex gap-2 flex-col xl:flex-row items-center justify-between">
                    <div>
                      <h2 className="font-semibold">{product.name}</h2>
                      <p className="text-sm text-gray-500">
                        {product.description}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        Price (customer):{" "}
                        <span className="font-medium">
                          {typeof product.askingPrice === "number" ? `৳${product.askingPrice}` : "Not set"}
                        </span>
                      </p>
                    </div>
                    {
                      product.assignedDeliveryman === null &&
                      <div className='xl:w-fit'>
                        <AvailableRidersDialogue product={product} />
                      </div>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
      }
    </section>
  )
}

export default page