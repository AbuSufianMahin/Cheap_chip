import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function userGrowthGraph({ isLoading, userGrowth }) {
    const chartData = userGrowth?.map((d) => ({
        month: MONTHS[d.month - 1],
        users: d.users,
    })) ?? []

    return (
        <div className="w-full h-70">
            <h2 className="text-center">User Growth</h2>

            <div className="w-full h-full">
                {isLoading ? (

                    <div className="w-full h-full flex gap-2">
                        {/* Y-axis */}
                        <div className="flex flex-col justify-between py-1 items-end">
                            {[100, 75, 50, 25, 0].map((v) => (
                                <Skeleton key={v} className="h-2.5 w-5" />
                            ))}
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                            {/* Grid + curved line */}
                            <div className="flex-1 relative">
                                {/* Horizontal grid lines */}
                                {[0, 25, 50, 75, 100].map((v) => (
                                    <Skeleton key={v} className="absolute w-full h-px" style={{ bottom: `${v}%` }} />
                                ))}


                                {/* Dots along the curve */}
                                {[
                                    { left: "17%", bottom: "55%" },
                                    { left: "33%", bottom: "45%" },
                                    { left: "50%", bottom: "70%" },
                                    { left: "67%", bottom: "65%" },
                                    { left: "83%", bottom: "80%" },
                                    { left: "97%", bottom: "85%" },
                                ].map((pos, i) => (
                                    <Skeleton key={i} className="absolute size-2.5 rounded-full -translate-x-1/2 translate-y-1/2" style={{ left: pos.left, bottom: pos.bottom }} />
                                ))}
                            </div>

                            {/* X-axis */}
                            <div className="flex justify-around px-1">
                                {Array.from({ length: 7 }).map((_, i) => (
                                    <Skeleton key={i} className="h-2.5 w-8" />
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="flex justify-center">
                                <Skeleton className="h-3 w-14" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%" className={"-ml-6 md:ml-0"}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#85B7EB"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}

export default userGrowthGraph