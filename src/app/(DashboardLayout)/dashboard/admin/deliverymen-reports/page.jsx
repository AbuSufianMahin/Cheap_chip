"use client"
import { useQuery } from '@tanstack/react-query';
import axiosPublic from '@/lib/axiosPublic';
import MetricCards from '@/components/DashboardLayout/adminRoutesUI/DeliverymenAnalytics/MetricCards';

import SuccessFailedDonutChart from '@/components/DashboardLayout/adminRoutesUI/DeliverymenAnalytics/SuccessFailedChart';
import TopDeliverymenBarChart from '@/components/DashboardLayout/adminRoutesUI/DeliverymenAnalytics/TopDeliverymenBarChart';
import SearchDeliverymenStats from '@/components/DashboardLayout/adminRoutesUI/DeliverymenAnalytics/SearchDeliverymenStats';

function DeliverymenReports() {
    const { data: deliverymenStats = {}, isLoading, isError, error } = useQuery({
        queryKey: ["deliverymen-stats"],
        queryFn: async () => {
            const result = await axiosPublic.get(`/api/deliverymen/statistics`);
            return result.data.data;
        }
    })
    // console.log(deliverymenStats)
    return (
        <section className='space-y-6'>
            <div>
                <h1 className='text-3xl font-bold'>Deliverymen performance</h1>
                <p className='text-sm text-muted-foreground'>Track efficiency, success rates and scores across all riders</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-3">
                <MetricCards deliverymenStats={deliverymenStats} isLoading={isLoading} isError={isError} />
            </div>

            <div className='grid lg:grid-cols-5 xl:grid-cols-8 2xl:grid-cols-7 gap-4'>
                <SuccessFailedDonutChart deliverymenStats={deliverymenStats} />
                <TopDeliverymenBarChart topDeliverymen={deliverymenStats.topDeliverymen}/>
            </div>

            <div>
                <SearchDeliverymenStats/>
            </div>

        </section>
    )
}

export default DeliverymenReports