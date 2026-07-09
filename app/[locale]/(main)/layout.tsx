import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { navigation } from "@/constants/dashboard-layout";
import SidebarLogo from "@/components/dashboard-layout/sidebar-logo";
import SidebarNavLink from "@/components/dashboard-layout/sidebar-nav-link";
import DashboardHeader from "@/components/dashboard-layout/dashboard-header";
import SidebarNavSection from "@/components/dashboard-layout/sidebar-nav-section";
import SidebarToggleControl from "@/components/dashboard-layout/sidebar-toggle-control";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        side="left"
        collapsible="icon"
        className="relative border-e border-border bg-white"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarLogo />

              {navigation.map((item) => (
                <SidebarMenuItem key={item.label}>
                  {item.type === "link" ? (
                    <SidebarNavLink item={item} />
                  ) : (
                    <SidebarNavSection label={item.label} />
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarToggleControl />
      </Sidebar>

      <SidebarInset className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="p-4 sm:p-6">
          <div>{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
