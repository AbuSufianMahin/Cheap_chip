
import DeliverymenMetricCardSkeleton from './DeliverymenMetricCardSkeleton'

function MetricCards({ deliverymenStats, isLoading }) {

    const metricCards = [
        { label: "Total riders", key: "totalRiders", format: (v) => v, badge: `${deliverymenStats.activeRiders} active`, up: null },
        { label: "Total deliveries", key: "totalDeliveries", format: (v) => v.toLocaleString(), sub: "till now", up: null },
        { label: "Total cancelled", key: "totalCancelled", format: (v) => v, sub: "failed deliveries", up: null },
        { label: "Avg delivery time", key: "avgDeliveryTime", format: (v) => `${v} min`, sub: "target 20 min", up: false },
        { label: "Avg success rate", key: "avgSuccessRate", format: (v) => `${v}%`, sub: "overall", up: true },
        { label: "Avg efficiency score", key: "avgEfficiencyScore", format: (v) => v, sub: "out of 100", up: true },
    ]

    const accentColors = ["#B4B2A9", "#85B7EB", "#F0997B", "#AFA9EC", "#5DCAA5", "#5DCAA5"]
    return (

        <>
            {isLoading && <DeliverymenMetricCardSkeleton />}
            {!isLoading && metricCards.map(({ label, key, format, sub, badge, up }, i) => (
                <div key={key} className="relative bg-white dark:bg-neutral-900 border border-border/40 rounded-xl p-4 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: accentColors[i] }} />
                    <p className="text-xs text-muted-foreground mb-1.5 tracking-wide">{label}</p>
                    <p className="text-2xl font-medium leading-tight mb-1.5">{format(deliverymenStats[key])}</p>
                    {badge && (
                        <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {badge}
                        </span>
                    )}
                    {sub && (
                        <p className={`text-xs flex items-center gap-1 ${up === true ? "text-emerald-600" : up === false ? "text-orange-500" : "text-muted-foreground"
                            }`}>
                            {up !== null && <span className={`w-1.5 h-1.5 rounded-full inline-block ${up ? "bg-emerald-500" : "bg-orange-400"}`} />}
                            {sub}
                        </p>
                    )}
                </div>
            ))}
        </>
    )
}

export default MetricCards