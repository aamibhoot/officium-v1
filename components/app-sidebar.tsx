"use client"

import type { Route } from "next"
import Image from "next/image"
import { sitemap, type NavItem } from "@/lib/sitemap"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"

// helper → normalize sitemap items into NavMain/NavSecondary items
function normalizeNavItems(items: NavItem[]) {
  return items
    .filter(
      (item): item is NavItem & { icon: NonNullable<NavItem["icon"]> } =>
        !!item.icon
    )
    .map((item) => ({
      title: item.name,
      url: item.href as Route,
      icon: item.icon,
    }))
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, open } = useSidebar()
  const { data: session } = useSession()

  // ✅ filter + normalize items
  const navMainItems = sitemap.filter((item) => item.type === "primary" && item.protected)
  const navSecondaryItems = normalizeNavItems(
    sitemap.filter((item) => item.type === "secondary" && item.protected)
  )

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} {...props}>
      {/* Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              {open ? (
                <Image
                  src="/officium_logo.svg"
                  alt="Logo"
                  width={120}
                  height={32}
                />
              ) : (
                <Image
                  src="/officium.png"
                  alt="Compact Logo"
                  width={32}
                  height={32}
                />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <NavMain items={navMainItems} currentUserRole={session?.user.role} />
      </SidebarContent>

      {/* User */}
      <SidebarFooter>
        <NavSecondary items={navSecondaryItems} />
        <NavUser
          user={
            session
              ? {
                  name: session.user.name || "No Name",
                  email: session.user.email || "No Email",
                  avatar: session.user.image || "/profile.png",
                  role: session.user.role || "user",
                  status: "online",
                }
              : {
                  name: "Guest User",
                  email: "guest@example.com",
                  avatar: "/profile.png",
                  role: "guest",
                  status: "offline",
                }
          }
        />
      </SidebarFooter>
    </Sidebar>
  )
}
