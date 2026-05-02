import { Skeleton } from '@/components/ui/skeleton'
function SalaryCardSkeleton() {
    return (
        <section className="space-y-4">
            <div className="grid md:grid-cols-2 gap-x-2 gap-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white shadow-md rounded-2xl border p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <Skeleton className="h-3.5 w-28" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <div className="space-y-2 flex flex-col items-end">
                                <Skeleton className="h-3.5 w-14" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Skeleton className="h-9 w-22" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default SalaryCardSkeleton