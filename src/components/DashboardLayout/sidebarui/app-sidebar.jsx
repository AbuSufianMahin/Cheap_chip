"use client";
import { LifeBuoy, Shield, Truck, User, Wrench } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Logo from "@/components/shared/Logo";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import SidebarSkeleton from "./SidebarSkeleton";


const navMain = [
  // ================= USER =================
  {
    title: "User Panel",
    icon: User,
    items: [
      {
        title: "My Peripherals",
        url: "/user/peripherals",
      },
      {
        title: "Track Products",
        url: "/user/orders",
      },
      {
        title: "Request Repair",
        url: "/user/request-repair",
      },
      {
        title: "Sell Item",
        url: "/user/sell",
      },
      {
        title: "Payment History",
        url: "/user/payments",
      },
    ],
  },

  // ================= TECHNICIAN =================
  {
    title: "Technician Panel",
    icon: Wrench,
    items: [
      {
        title: "Assigned Products",
        url: "/technician/assigned",
      },
      {
        title: "In Progress",
        url: "/technician/in-progress",
      },
      {
        title: "Completed Jobs",
        url: "/technician/completed",
      },
      {
        title: "Report Issue",
        url: "/technician/report",
      },
    ],
  },

  // ================= DELIVERY =================
  {
    title: "Delivery Panel",
    icon: Truck,
    items: [
      {
        title: "Assigned Deliveries",
        url: "/delivery/assigned",
      },
      {
        title: "All Deliveries",
        url: "/delivery/all",
      },
      {
        title: "Delivery Status Update",
        url: "/delivery/status",
      },
    ],
  },

  // ================= ADMIN =================
  {
    title: "Admin Panel",
    icon: Shield,
    items: [
      {
        title: "Manage Users",
        url: "/admin/users",
      },
      {
        title: "Manage Deliveryman",
        url: "/admin/manage-deliveryman",
      },
      {
        title: "Manage Technicians",
        url: "/admin/manage-technicians",
      },
      {
        title: "Track Products",
        url: "/admin/track-products",
      },
      {
        title: "Reports & Analytics",
        url: "/admin/reports-and-analytics",
      },
    ],
  },

  // ================= COMMON =================
  {
    title: "Support",
    icon: LifeBuoy,
    items: [
      {
        title: "Help Center",
        url: "/help",
      },
      {
        title: "Contact Support",
        url: "/contact",
      },
      {
        title: "FAQs",
        url: "/faq",
      },
    ],
  },
];

export function AppSidebar({ ...props }) {
  const { data, status } = useSession();
  console.log("Status", status);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Separator className={"my-2"} />

      {status === "loading" ? (
        <SidebarSkeleton/>
      ) : (
        <>
          <SidebarContent>
            <NavMain navItems={navMain} />
          </SidebarContent>

          <SidebarFooter className={"border-t"}>
            <NavUser user={data.user} />
          </SidebarFooter>
        </>
      )}
    </Sidebar>
  );
}
