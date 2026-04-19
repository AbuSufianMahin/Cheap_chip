import { useCallback } from "react"
import debounce from "lodash/debounce"

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import axiosPublic from '@/lib/axiosPublic'
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import DeliverymanStatsSkeleton from './DeliverymanStatsSkeleton';
import { Loader2, SearchX } from 'lucide-react';

function SearchDeliverymenStats() {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const [searchQuery, setSearchQuery] = useState("")

    const { data: deliverymenData = [], isLoading } = useQuery({
        queryKey: ["deliveryman-search", searchQuery],
        queryFn: async () => {
            const result = await axiosPublic.get(`/api/deliverymen/statistics/${encodeURIComponent(searchQuery)}`)
            return result.data.data;
        },
        enabled: searchQuery.trim().length >= 3
    })

    const handleSearch = useCallback(
        debounce((data) => {
            setSearchQuery(data.queryParameter.trim())
        }, 300),
        []
    )
    console.log(deliverymenData)

    return (
        <section className='space-y-4'>
            <h1 className='font-semibold text-lg mb-2'>Search Deliverymen</h1>

            <form onChange={handleSubmit(handleSearch)}>
                <Field orientation="horizontal">
                    <Input
                        type={"text"}
                        placeholder="Search deliveryman by name or email"
                        className="w-full md:w-2/3 xl:w-1/3 text-xs md:text-sm lg:text-base"
                        {...register("queryParameter", {
                            minLength: {
                                value: 3,
                                message: "Enter at least 3 characters",
                            },
                        })}
                    />
                    {
                        isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    }
                </Field>
                {errors.queryParameter && (
                    <p className="text-xs text-red-500 mt-1 ml-2">{errors.queryParameter.message}</p>
                )}
            </form>

            <div className='rounded-xl xl:w-6/7 min-h-30'>

                {isLoading ?
                    <DeliverymanStatsSkeleton />
                    :
                    searchQuery.length < 3 ?
                        null :
                        deliverymenData.length == 0 ?
                            <div className='border rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-center'>
                                <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center'>
                                    <SearchX className='w-5 h-5 text-muted-foreground' />
                                </div>
                                <p className='text-sm font-medium'>No deliveryman found</p>
                                <p className='text-xs text-muted-foreground'>No results for <span className='font-medium text-foreground'>"{searchQuery}"</span>. Try a different name or email.</p>
                            </div>
                            :
                            <div className={`rounded-xl divide-y ${deliverymenData.length > 0 && "border"}`}>
                                {
                                    deliverymenData.map((deliveryman) => (
                                        <div key={deliveryman._id} className='flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-4 hover:bg-muted/50 transition-colors'>

                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 rounded-full flex items-center justify-center text-teal-700 font-medium text-sm shrink-0'>
                                                    {deliveryman.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className='flex items-center gap-2'>
                                                        <p className='text-sm font-medium'>{deliveryman.name}</p>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${deliveryman.isActive
                                                            ? "bg-teal-50 text-teal-700"
                                                            : "bg-amber-50 text-amber-700"
                                                            }`}>
                                                            {deliveryman.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </div>
                                                    <p className='text-xs text-muted-foreground'>{deliveryman.email}</p>
                                                    <p className='text-xs text-muted-foreground'>{deliveryman.phone}</p>
                                                </div>
                                            </div>

                                            <div className='grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-6 text-center'>
                                                <div>
                                                    <p className='text-xs text-muted-foreground mb-0.5'>Deliveries</p>
                                                    <p className='text-sm font-medium'>{deliveryman.stats.totalCompleted}</p>
                                                </div>
                                                <div>
                                                    <p className='text-xs text-muted-foreground mb-0.5'>Cancelled</p>
                                                    <p className='text-sm font-medium'>{deliveryman.stats.totalCancelled}</p>
                                                </div>
                                                <div>
                                                    <p className='text-xs text-muted-foreground mb-0.5'>Avg time</p>
                                                    <p className='text-sm font-medium'>{deliveryman.stats.averageDeliveryTime} min</p>
                                                </div>
                                                <div>
                                                    <p className='text-xs text-muted-foreground mb-0.5'>Success rate</p>
                                                    <p className='text-sm font-medium'>{deliveryman.stats.successRate}%</p>
                                                </div>
                                                <div>
                                                    <p className='text-xs text-muted-foreground mb-0.5'>Efficiency</p>
                                                    <p className={`text-sm font-medium ${deliveryman.stats.efficiencyScore >= 80 ? "text-green-700" :
                                                        deliveryman.stats.efficiencyScore >= 60 ? "text-amber-700" :
                                                            "text-red-700"
                                                        }`}>{deliveryman.stats.efficiencyScore}/100</p>
                                                </div>
                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                }

            </div>
        </section>
    )
}

export default SearchDeliverymenStats