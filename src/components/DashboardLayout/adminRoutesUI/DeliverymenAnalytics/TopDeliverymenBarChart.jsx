
import React from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function TopDeliverymenBarChart({ topDeliverymen }) {
    return (
        <div className="rounded-xl p-5 w-full shadow lg:col-span-3 xl:col-span-4 2xl:col-span-3">
            <p className="font-semibold text-lg mb-0.5">Deliveries per deliverymen</p>
            <p className="text-xs mb-4">Top 5 deliverymen</p>
            <div className="w-full aspect-square max-h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        accessibilityLayer
                        data={topDeliverymen}
                        layout="vertical"
                        margin={{ right: 32 }}
                    >
                        <CartesianGrid horizontal={false} />
                        <XAxis type="number" dataKey="totalCompleted" hide />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            width={100}
                            hide
                        />
                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null
                                const rider = payload[0].payload
                                return (
                                    <div className="bg-background border border-border rounded-lg p-3 text-sm shadow-sm">
                                        <p className="font-medium mb-1">{rider.name}</p>
                                        <p className="text-muted-foreground text-xs">{rider.email}</p>
                                        <p className="mt-2 text-xs">Deliveries: <span className="font-medium">{rider.totalCompleted}</span></p>
                                    </div>
                                )
                            }}
                        />
                        <Bar dataKey="totalCompleted" radius={4} fill="#1D9E75" animationDuration={1000}>
                            <LabelList
                                dataKey="name"
                                position="insideLeft"
                                offset={12}
                                style={{ fill: "white" }}
                                fontSize={12}
                            />
                            <LabelList
                                dataKey="totalCompleted"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />

                        </Bar>

                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default TopDeliverymenBarChart