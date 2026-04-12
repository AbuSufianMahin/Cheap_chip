"use client"
import Lottie from "lottie-react"
import maintenanceAnimation from "../../../public/lottie-animation/under-construction.json" 

function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Lottie animationData={maintenanceAnimation} className="h-2/3"/>
    </div>
  )
}

export default DashboardNotFound