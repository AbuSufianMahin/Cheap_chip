import React from 'react'

function page() {
  const analyticsOverviewData = {
    totalOrders: 1240,
    revenue: 84500,
    activeRiders: 18,
    deliverySuccess: 91,
  }
  const metricCards = [
    { label: "Total orders", key: "totalOrders", format: (v) => v.toLocaleString(), trend: "+12% vs last month", up: true },
    { label: "Revenue", key: "revenue", format: (v) => `৳${v.toLocaleString()}`, trend: "+8% vs last month", up: true },
    { label: "Active riders", key: "activeRiders", format: (v) => v, trend: "of 22 total", up: null },
    { label: "Delivery success", key: "deliverySuccess", format: (v) => `${v}%`, trend: "-2% vs last month", up: false },
  ]

  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold">
          Report and analytics
        </h1>
        <p className='text-sm'>Overview of platform performance — last 30 days</p>
      </div>

      <div className='space-y-2 mt-5'>
        <p className='text-sm'>Demo Summary Data</p>
        <div className='grid grid-cols-6 gap-4'>
          {metricCards.map(({ label, key, format, trend, up }) => (
            <div key={key} className="bg-muted/50 rounded-lg p-6 shadow">
              <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
              <p className="text-2xl font-medium">{format(analyticsOverviewData[key])}</p>
              <p className={`text-xs mt-1 ${up == null ? "text-muted-foreground" : up == true ? "text-green-700" : "text-red-700"}`}>
                {trend}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}

export default page