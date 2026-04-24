"use client"
import OrderDeliveryTrendGraph from '@/components/DashboardLayout/adminRoutesUI/ReportAndAnalytics/OrderDeliveryTrendGraph'
import UserGrowthGraph from '@/components/DashboardLayout/adminRoutesUI/ReportAndAnalytics/UserGrowthGraph'
import { Skeleton } from '@/components/ui/skeleton'
import axiosPublic from '@/lib/axiosPublic'
import { useQuery } from '@tanstack/react-query'
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
  // {
  //   title: "Order & delivery trends",
  //   description: "Daily/weekly volume, peak hours, failed deliveries",
  //   icon: <TrendingUp size={24} />,
  //   href: "/dashboard/admin/reports-and-analytics/orders",
  //   color: "text-blue-700 bg-blue-50",
  // },
  // {
  //   title: "Product & inventory",
  //   description: "Top products, stock levels, and category performance",
  //   icon: <Monitor size={24} />,
  //   href: "/dashboard/admin/reports-and-analytics/products",
  //   color: "text-amber-700 bg-amber-50",
  // },
  // {
  //   title: "User growth",
  //   description: "New signups, retention, and active users over time",
  //   icon: <UsersRound size={24} />,
  //   href: "/dashboard/admin/reports-and-analytics/users",
  //   color: "text-rose-700 bg-rose-50",
  // },
]

function page() {
  const { data: websiteData = {}, isLoading } = useQuery({
    queryKey: ["website-analytics-data"],
    queryFn: async () => {
      const result = await axiosPublic.get("/api/statistics/overview");
      return result.data.data;
    }
  })

  const metricCards = [
    {
      label: "Total orders",
      getValue: (d) => d.orderCounts.totalOrders,
      getTrend: (d) =>
        d.orderCounts.growthDirection === "neutral" ?
          "0% vs last month"
          :
          `${d.orderCounts.growthDirection === "up" ? "+" : "-"}${d.orderCounts.growthAmount}% vs last month`,

      getUp: (d) =>
        d.orderCounts.growthDirection === "neutral"
          ? null
          : d.orderCounts.growthDirection === "up",
    },
    {
      label: "Revenue",
      getValue: (d) => d.revenue,
      unit: "৳",
      getTrend: () => "Total earned",
      getUp: () => null,
    },
    {
      label: "Active riders",
      getValue: (d) => d.riderCounts.active,
      getTrend: (d) => `of ${d.riderCounts.total} total`,
      getUp: () => null,
    },
    {
      label: "Delivery success",
      getValue: (d) => d.deliverySuccessRate,
      unit: "%",
      getTrend: () => "Success rate",
      getUp: () => null,
    },
  ];

  const accentColors = ["#85B7EB", "#5DCAA5", "#F0997B", "#AFA9EC"]


  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold">
          Report and analytics
        </h1>
        <p className='text-sm text-muted-foreground'>Overview of platform performance</p>
      </div>
      <div className='space-y-2 mt-5'>
        <p className='text-sm text-muted-foreground'>Summary Data</p>

        <div className='grid grid-cols-2 xl:grid-cols-6 gap-2 lg:gap-4'>
          {
            isLoading ?
              <>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="relative bg-muted/50 rounded-lg p-3 md:p-4 lg:p-6 shadow">
                    <Skeleton className="absolute top-0 left-0 right-0 h-1 rounded-none" />
                    <Skeleton className="h-3.5 w-24 mb-1.5" />
                    <Skeleton className="h-8 w-24 mt-2" />
                    <Skeleton className="h-3.5 w-28 mt-2" />
                  </div>
                ))}
              </>
              :

              <>
                {metricCards.map(({ label, unit, getValue, getTrend, getUp }, i) => {
                  const d = websiteData;
                  const value = getValue(d);
                  const trend = getTrend(d);
                  const up = getUp(d);
                  return (
                    <div key={label} className="relative bg-muted/50 rounded-lg p-3 md:p-4 lg:p-6 shadow overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-sm" style={{ background: accentColors[i] }} />
                      <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                        {unit && unit !== "%" && <span>{unit}</span>}
                        <CountUp end={value} duration={5} />
                        {unit === "%" && <span>{unit}</span>}
                      </p>
                      <p className={`text-xs mt-1 ${up == null
                        ? "text-muted-foreground"
                        : up === true
                          ? "text-green-700"
                          : "text-red-700"
                        } ${up == null && getTrend(d) === "0% vs last month" ? "text-yellow-600" : ""}`}>
                        {trend}
                      </p>
                    </div>
                  );
                })}

              </>

          }

        </div>

      </div>


      <div className='flex flex-col-reverse md:flex-col'>
        <div className='space-y-4 mt-8'>
          <h1 className='text-2xl'>Analytics modules</h1>
          <div className='grid xl:grid-cols-3 gap-8'>
            <UserGrowthGraph isLoading={isLoading} userGrowth={websiteData?.userGrowth} />
            <OrderDeliveryTrendGraph isLoading={isLoading} orderAndDeliveryTrends={websiteData?.orderAndDeliveryTrends} />
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-14'>
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