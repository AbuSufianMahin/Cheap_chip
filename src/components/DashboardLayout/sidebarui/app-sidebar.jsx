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
    roles: ["user", "technician", "deliveryman", "admin"],
    items: [
      {
        title: "My Peripherals",
        url: "/dashboard/user/peripherals",
      },
      {
        title: "Track Products",
        url: "/dashboard/user/orders",
      },
      {
        title: "Payment History",
        url: "/dashboard/user/payments",
      },
    ],
  },

  // ================= TECHNICIAN =================
  {
    title: "Technician Panel",
    icon: Wrench,
    roles: ["technician"],
    items: [
      {
        title: "Assigned Products",
        url: "/dashboard/technician/assigned",
      },
      {
        title: "In Progress",
        url: "/dashboard/technician/in-progress",
      },
      {
        title: "Completed Jobs",
        url: "/dashboard/technician/completed",
      },
      {
        title: "Report Issue",
        url: "/dashboard/technician/report",
      },
    ],
  },

  // ================= DELIVERY =================
  {
    title: "Delivery Panel",
    icon: Truck,
    roles:["deliveryman"],
    items: [
      {
        title: "Assigned Deliveries",
        url: "/dashboard/delivery/assigned",
      },
      {
        title: "All Deliveries",
        url: "/dashboard/delivery/all",
      },
      {
        title: "Delivery Status Update",
        url: "/dashboard/delivery/status",
      },
    ],
  },

  // ================= ADMIN =================
  {
    title: "Admin Panel",
    icon: Shield,
    roles: ["admin"],
    items: [
      {
        title: "Reports & Analytics",
        url: "/dashboard/admin/reports-and-analytics",
      },
      {
        title: "Applications Review",
        url: "/dashboard/admin/applications",
      },
      {
        title: "User management",
        url: "/dashboard/admin/user-management",
      },
      {
        title: "Manage Deliveryman",
        url: "/dashboard/admin/manage-deliveryman",
      },
      {
        title: "Manage Technicians",
        url: "/dashboard/admin/manage-technicians",
      },
      {
        title: "Product Management",
        url: "/dashboard/admin/product-management",
      },
      {
        title: "Pay Salary",
        url: "/dashboard/admin/pay-salary",
      },
    ],
  },

  // ================= COMMON =================
  {
    title: "Support",
    icon: LifeBuoy,
    roles: ["user", "technician", "delivery", "admin"],
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
  const userRole = data?.user?.role;

  const visibleNavItems = navMain.filter((section) =>
    section.roles.includes(userRole)
  );

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
        <SidebarSkeleton />
      ) : (
        <>
          <SidebarContent>
            <NavMain navItems={visibleNavItems} />
          </SidebarContent>

          <SidebarFooter className={"border-t"}>
            {data?.user ? <NavUser user={data.user} /> : null}
          </SidebarFooter>
        </>
      )}
    </Sidebar>
  );
}
