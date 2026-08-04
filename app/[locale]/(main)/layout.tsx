import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { http } from "@/lib/http";
import { User } from "@/types/shared";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { navigation } from "@/constants/dashboard-layout";
import SidebarLogo from "@/components/dashboard-layout/sidebar-logo";
import { PermissionsProvider } from "@/providers/permission-providers";
import SidebarNavLink from "@/components/dashboard-layout/sidebar-nav-link";
import DashboardHeader from "@/components/dashboard-layout/dashboard-header";
import SidebarNavSection from "@/components/dashboard-layout/sidebar-nav-section";
import SidebarToggleControl from "@/components/dashboard-layout/sidebar-toggle-control";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  // Fetch user data to get permissions
  const { data, ok } = await http.get<{
    data: User;
  }>("/api/v1/admin/me");

  if (!ok) {
    redirect("/login");
  }

  return (
    <PermissionsProvider user={data.data}>
      <SidebarProvider defaultOpen>
        <Sidebar
          side={locale === "ar" ? "right" : "left"}
          collapsible="icon"
          className="border-e border-border"
        >
          <SidebarContent className="bg-white">
            <SidebarGroup className="p-0">
              <SidebarLogo />
              <SidebarMenu className="p-2">
                {navigation(data.data.permissions)
                  .filter((item) => item.enabled)
                  .map((item) => (
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
    </PermissionsProvider>
  );
}
