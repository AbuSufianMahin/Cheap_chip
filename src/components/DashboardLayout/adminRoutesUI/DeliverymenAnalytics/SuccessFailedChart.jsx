import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

function SuccessFailedDonutChart({ deliverymenStats }) {
    const data = [
        { name: "Successful", value: deliverymenStats.totalDeliveries, color: "#1D9E75" },
        { name: "Ongoing", value: deliverymenStats.totalOngoing, color: "#EF9F27" },
        { name: "Cancelled", value: deliverymenStats.totalCancelled, color: "#E24B4A" },
    ]

    const total = data.reduce((sum, d) => sum + d.value, 0)

    return (
        <div className="rounded-xl p-5 w-full shadow lg:col-span-2 xl:col-span-3 2xl:col-span-2">
            <p className="font-semibold text-lg mb-0.5">Success vs failed</p>
            <p className="text-xs mb-4">All riders combined</p>

            <div className="flex items-center gap-4 mb-4">
                {data.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: entry.color }} />
                        <span className="text-xs">
                            {entry.name} {Math.round((entry.value / total) * 100)}%
                        </span>
                    </div>
                ))}
            </div>

            <div className="w-full aspect-square max-h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={105}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                            animationDuration={1000}
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.color} stroke="transparent" />
                            ))}
                        </Pie>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null
                                const { name, value } = payload[0].payload
                                return (
                                    <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white">
                                        {name}: <span className="font-medium">{value} deliveries</span>
                                    </div>
                                )
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
export default SuccessFailedDonutChart