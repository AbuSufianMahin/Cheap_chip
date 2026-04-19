import { Skeleton } from '@/components/ui/skeleton'

function DeliverymanStatsSkeleton() {
    return (
        <div className='border rounded-xl divide-y'>
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className='flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-4'>

                    <div className='flex items-center gap-3'>
                        <Skeleton className='w-10 h-10 rounded-full shrink-0' />
                        <div className='space-y-2'>
                            <Skeleton className='h-3 w-32' />
                            <Skeleton className='h-3 w-44' />
                            <Skeleton className='h-3 w-24' />
                        </div>
                    </div>

                    <div className='grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-6 text-center'>
                        {Array.from({ length: 5 }).map((_, j) => (
                            <div key={j} className='flex flex-col items-center gap-1.5'>
                                <Skeleton className='h-3 w-14' />
                                <Skeleton className='h-4 w-10' />
                            </div>
                        ))}
                    </div>

                </div>
            ))}
        </div>
    )
}

export default DeliverymanStatsSkeleton