import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Skeleton } from '@/components/ui/skeleton'

function OrderDeliveryTrendGraph({ isLoading, orderAndDeliveryTrends }) {
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const chartData =
        orderAndDeliveryTrends?.map((item) => ({
            month: `${monthNames[item.month - 1]} ${item.year}`,
            ordered: item.ordered,
            delivered: item.delivered,

        })) || [];

    return (
        <div className="w-full h-70">
            <h2 className="text-center">Orders and Deliveries</h2>

            {
                isLoading ?
                    <div className="w-full h-full flex gap-2 py-3 px-4">
                        {/* Y-axis labels */}
                        <div className="flex flex-col justify-between items-end h-[90%]">
                            {[100, 75, 50, 25, 0].map((v) => (
                                <Skeleton key={v} className="h-2.5 w-5" />
                            ))}
                        </div>

                        {/* Main chart */}
                        <div className="flex-1 flex flex-col gap-2">
                            {/* Grid + bars */}
                            <div className="flex-1 relative">
                                {/* Horizontal grid lines */}
                                {[0, 25, 50, 75, 100].map((v) => (
                                    <Skeleton
                                        key={v}
                                        className="absolute w-full h-px"
                                        style={{ bottom: `${v}%` }}
                                    />
                                ))}

                                {/* Bars */}
                                <div className="absolute inset-0 flex items-end gap-5 md:gap-10 lg:gap-25 px-1">
                                    {[65, 50, 70, 55].map((h, i) => (
                                        <div key={i} className={`flex-1 flex items-end gap-0.5 h-full ${i > 1 ? "hidden md:flex" : "flex"}`}>
                                            <Skeleton className="flex-1 rounded-t-sm rounded-b-none" style={{ height: `${h}%` }} />
                                            <Skeleton className="flex-1 rounded-t-sm rounded-b-none" style={{ height: `${h * 0.75}%` }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* X-axis labels */}
                            <div className="flex justify-around px-1">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-2.5 w-8" />
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="flex justify-center gap-4">
                                <Skeleton className="h-3 w-14" />
                                <Skeleton className="h-3 w-14" />
                            </div>
                        </div>
                    </div>
                    :

                    <ResponsiveContainer width="100%" height="100%" className={"-ml-6 md:ml-0"}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />

                            <Bar dataKey="ordered" fill="#3b82f6" radius={4} barSize={60} />
                            <Bar dataKey="delivered" fill="#22c55e" radius={4} barSize={60} />
                        </BarChart>
                    </ResponsiveContainer>
            }
        </div>
    );
}

export default OrderDeliveryTrendGraph;