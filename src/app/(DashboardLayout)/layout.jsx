"use client"
import { AppSidebar } from "@/components/DashboardLayout/sidebarui/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";


function DashboardLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>

        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className={"bg-linear-to-br from-white via-orange-50 to-amber-50"}>
            <header className="flex h-16 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4 sm:px-8">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 sm:p-8 sm:pt-0">

              {children}

            </div>
          </SidebarInset>
        </SidebarProvider>

      </QueryClientProvider>
    </SessionProvider>
  );
}

export default DashboardLayout;
