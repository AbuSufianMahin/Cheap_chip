"use client"
import { Monitor, TrendingUp, Users, UsersRound, Wrench } from 'lucide-react'
import Link from 'next/link'
import CountUp from 'react-countup'

const analyticsModules = [
  {
    title: "Rider performance",
    description: "Avg delivery time, success rate, efficiency scores per rider",
    icon: <Users size={24} />,
    href: "/dashboard/admin/deliverymen-reports",
    color: "text-teal-700 bg-teal-50",
  },
  {
    title: "Technician performance",
    description: "Job completion rate, ratings, and resolution time",
    icon: <Wrench size={24} />,
    href: "/dashboard/admin/reports-and-analytics/technician-performance",
    color: "text-purple-700 bg-purple-50",
  },
  {
    title: "Order & delivery trends",
    description: "Daily/weekly volume, peak hours, failed deliveries",
    icon: <TrendingUp size={24} />,
    href: "/dashboard/admin/reports-and-analytics/orders",
    color: "text-blue-700 bg-blue-50",
  },
  {
    title: "Product & inventory",
    description: "Top products, stock levels, and category performance",
    icon: <Monitor size={24} />,
    href: "/dashboard/admin/reports-and-analytics/products",
    color: "text-amber-700 bg-amber-50",
  },
  {
    title: "User growth",
    description: "New signups, retention, and active users over time",
    icon: <UsersRound size={24} />,
    href: "/dashboard/admin/reports-and-analytics/users",
    color: "text-rose-700 bg-rose-50",
  },
]

function page() {
  const analyticsOverviewData = {
    totalOrders: 1240,
    revenue: 84500,
    activeRiders: 5,
    deliverySuccess: 91,
  }
  const metricCards = [
    { label: "Total orders", key: "totalOrders", unit: null, trend: "+12% vs last month", up: true },
    { label: "Revenue", key: "revenue", unit: "৳", trend: "+8% vs last month", up: true },
    { label: "Active riders", key: "activeRiders", unit: null, trend: "of 6 total", up: null },
    { label: "Delivery success", key: "deliverySuccess", unit: null, trend: "-2% vs last month", up: false },
  ]

  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold">
          Report and analytics
        </h1>
        <p className='text-sm text-muted-foreground'>Overview of platform performance</p>
      </div>

      <div className='space-y-2 mt-5'>
        <p className='text-sm text-muted-foreground'>Demo Summary Data</p>
        <div className='grid grid-cols-2 xl:grid-cols-6 gap-2 lg:gap-4'>
          {metricCards.map(({ label, key, format, trend, up }) => (
            <div key={key} className="bg-muted/50 rounded-sm p-3 md:p-4 lg:p-6 shadow">
              <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                <CountUp end={analyticsOverviewData[key]} duration={5} />
              </p>
              <p className={`text-xs mt-1 ${up == null ? "text-muted-foreground" : up == true ? "text-green-700" : "text-red-700"}`}>
                {trend}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='space-y-4 mt-8'>
        <h1 className='text-2xl'>Analytics modules</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
          {analyticsModules.map(({ title, description, icon, href, color }) => (
            <Link
              key={title}
              href={href}
              className="bg-background border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-foreground/30 transition-colors"
            >
              <div className={`${color}  w-16 h-16 rounded-lg flex items-center justify-center`}>
                {icon}
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
              </div>
              <p className="text-xs text-blue-600 mt-auto">View module →</p>
            </Link>
          ))}
        </div>
      </div>


    </section>
  )
}

export default page