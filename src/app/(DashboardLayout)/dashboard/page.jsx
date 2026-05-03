"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export default function DashboardPage() {
  const { data, status } = useSession();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const name = data?.user?.name?.split(" ")[0] ?? "there";

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="animate-pulse text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[75vh] items-center overflow-hidden px-6 md:px-16">
      {/* Subtle glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full opacity-25"
        style={{
          background: "radial-gradient(ellipse at center, #4ab450 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
        {/* Left — text */}
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600">
            {greeting}
          </p>
          <h1 className="text-5xl font-black tracking-tight text-foreground md:text-7xl">
            Hello,{" "}
            <span className="text-green-500">{name}.</span>
          </h1>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
            Welcome to your Cheap Chip dashboard. Manage repairs, track
            recycling jobs, and keep things running smoothly.
          </p>
        </div>

        {/* Right — illustration */}
        <div className="flex items-center justify-center">
          <Image
            src="/images/cheap_chip_3Dlogo.webp"
            alt="Cheap Chip Logo"
            width={140}
            height={140}
            priority
            className="absolute z-10 drop-shadow-lg"
          />
          <svg
            viewBox="0 0 420 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-md"
            aria-hidden="true"
          >
            {/* Glowing base circle */}
            <circle cx="210" cy="200" r="150" fill="#4ab450" fillOpacity="0.06" />
            <circle cx="210" cy="200" r="110" fill="#4ab450" fillOpacity="0.06" />


            {/* Orbit dots */}
            <circle cx="210" cy="52" r="5" fill="#4ab450" fillOpacity="0.5" />
            <circle cx="348" cy="200" r="4" fill="#4ab450" fillOpacity="0.35" />
            <circle cx="72" cy="200" r="4" fill="#4ab450" fillOpacity="0.35" />
            <circle cx="210" cy="348" r="5" fill="#4ab450" fillOpacity="0.5" />

            {/* Sparkles */}
            <circle cx="290" cy="80" r="2.5" fill="#4ab450" fillOpacity="0.6" />
            <circle cx="140" cy="310" r="2" fill="#4ab450" fillOpacity="0.5" />
            <circle cx="350" cy="300" r="2" fill="#4ab450" fillOpacity="0.4" />
            <circle cx="80" cy="90" r="2.5" fill="#4ab450" fillOpacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}