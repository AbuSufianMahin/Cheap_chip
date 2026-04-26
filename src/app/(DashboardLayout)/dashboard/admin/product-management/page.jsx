"use client"

import axiosPublic from '@/lib/axiosPublic';
import { useQuery } from '@tanstack/react-query'

import Image from 'next/image';
import { useCallback, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import AvailableRidersDialogue from '@/components/DashboardLayout/adminRoutesUI/AvailableRidersDialogue';
import AvailableTechniciansDialogue from '@/components/DashboardLayout/adminRoutesUI/AvailableTechniciansDialogue';
import ProductLoadingSkeleton from '@/components/DashboardLayout/adminRoutesUI/ProductLoadingSkeleton';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { debounce } from 'lodash';
import ProductDetailsDialogue from '@/components/DashboardLayout/adminRoutesUI/ProductManagement/ProductDetailsDialogue';
import { Button } from '@/components/ui/button';

function page() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [onlyUnassigned, setOnlyUnassigned] = useState(false);
  const [productName, setProductName] = useState('');

  const [productObjToShow, setProductObjToshow] = useState(null);

  const { data: productData = [], isLoading, refetch: refetchProductData } = useQuery({
    queryKey: ["all-products", onlyUnassigned, productName],
    queryFn: async () => {
      // this needs to be axiosSecure
      const result = await axiosPublic.get(`/api/products-info?unassigned=${onlyUnassigned}&productName=${productName}`);
      return result.data;
    }
  })

  const handleSearch = useCallback(
    debounce((data) => {
      setProductName(data.productName.trim())
    }, 500),
    []
  )

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Customer Sell Products
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mt-4 sm:mt-8">
        <form className='sm:w-2/3 md:w-3/5 lg:w-3/7 xl:w-2/7' onChange={handleSubmit(handleSearch)}>
          <Input
            placeholder="Search by product name"
            {...register('productName', {
              minLength: {
                value: 3,
                message: 'At least 3 characters required'
              }
            })}
          />
          {errors.productName && (
            <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>
          )}
        </form>
        <div className='flex items-center gap-2'>
          <Checkbox
            id="unassigned"
            checked={onlyUnassigned}
            onCheckedChange={(checked) => setOnlyUnassigned(checked === true)}
          />
          <Label htmlFor="unassigned">Unassigned deliveryman only</Label>
        </div>
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
                  <div className="relative w-full sm:w-32 h-32">
                    <Image
                      src={
                        product.productImage ||
                        "https://res.cloudinary.com/dsos8ty6s/image/upload/q_auto/f_auto/v1777143751/no-image-icon-23485_im59ix.png"
                      }
                      sizes="(max-width: 640px) 100vw, 128px"
                      fill
                      className="rounded-md object-cover"
                      alt={`${product.productName} image`}
                      priority={index < 3 || !product.productImage}
                    />
                  </div>

                  <div className="flex-1 flex gap-2 flex-col xl:flex-row xl:items-center justify-between">
                    <div>
                      <h2 className="font-semibold cursor-pointer hover:text-secondary" onClick={() => setProductObjToshow(product)}>{product.productName}</h2>
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
                    <div className='flex flex-col gap-2'>

                      {
                        product.assignedDeliveryman === null ?
                          <AvailableRidersDialogue product={product} />
                          :
                          <Button disabled className="bg-gray-400">Deliveryman assigned</Button>
                      }

                      {
                        product.assignedTechnician === null ?
                          <AvailableTechniciansDialogue product={product} />
                          :
                          <Button disabled className="bg-gray-400" >Technician assigned</Button>
                      }

                    </div>
                  </div>
                </div>
              ))

          }
        </div>
      </div>

      <ProductDetailsDialogue productObjToShow={productObjToShow} setProductObjToshow={setProductObjToshow} />
    </section>
  )
}

export default page