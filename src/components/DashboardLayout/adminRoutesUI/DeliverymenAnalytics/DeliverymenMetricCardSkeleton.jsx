import { Skeleton } from '@/components/ui/skeleton';

function DeliverymenMetricCardSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="relative bg-white dark:bg-neutral-900 border border-border/40 rounded-xl p-4 overflow-hidden">
                    <Skeleton className="absolute top-0 left-0 right-0 h-1 rounded-none" />
                    <Skeleton className="h-3 w-24 mb-3 mt-1" />
                    <Skeleton className="h-7 w-16 mb-2" />
                    <Skeleton className="h-3 w-20" />
                </div>
            ))}
        </>
    )
}

export default DeliverymenMetricCardSkeleton