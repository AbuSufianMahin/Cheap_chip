import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function ProductLoadingSkeleton() {
    return (
        <div className="border rounded-xl px-6 py-4 flex gap-4 items-center">
            <Skeleton className="w-30 h-30 rounded-md shrink-0" />
            <div className="flex-1 flex gap-2 flex-col xl:flex-row items-center justify-between w-full">
                <div className="w-full space-y-4">
                    <Skeleton className="h-4 w-2/5 " />
                    <Skeleton className="h-3 w-4/5" />
                    <div className='flex gap-2'>
                        <Skeleton className="h-3 w-1/5" />
                        <Skeleton className="h-3 w-2/5" />
                    </div>
                </div>
                <div className="xl:w-fit w-full">
                    <Skeleton className="h-9 w-40 rounded-lg" />
                </div>
            </div>
        </div>
    )
}

export default ProductLoadingSkeleton