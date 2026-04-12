"use client"
import Lottie from "lottie-react"
import global404 from "../../public/lottie-animation/global404.json"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function Global404() {
  return (
    <div className="max-h-screen flex flex-col items-center">
      <div className="w-3/5">
        <Lottie animationData={global404} className="h-full w-full" />
      </div>
      <Link href="/home">
        <Button size="lg">Go back Home</Button>
      </Link>
    </div>
  )
}

export default Global404