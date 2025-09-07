import type { LucideIcon } from "lucide-react"
import {
  Home,
  BarChart,
  Settings,
  ShieldUser,
  DollarSign,
  LayoutDashboard,
  User,
  AppWindowMac,
} from "lucide-react"

/**
 * Sitemap and Navigation Configuration
 *
 * Groups are defined once in `sidebarGroups` and linked via `groupId` in NavItem.
 * Roles:
 * - OFFICER = Regular User
 * - BATMAN = Admin
 * - SUPERMAN = Super Admin
 */

export type GroupId =
  | "general"
  | "analytics"
  | "actions"
  | "admin"
  | "conversations"

export interface NavItem {
  name: string
  href: string
  dir: string
  protected: boolean
  roles?: string[] // allowed roles
  icon?: LucideIcon
  groupId?: GroupId
  type?: "primary" | "secondary"
  children?: NavItem[]
}

export interface SidebarGroup {
  id: GroupId
  name: string
  icon: LucideIcon
}

export const sidebarGroups: SidebarGroup[] = [
  { id: "general", name: "General", icon: Home },
  { id: "analytics", name: "Analytics", icon: BarChart },
  { id: "actions", name: "Actions", icon: Settings },
  { id: "admin", name: "Admin", icon: ShieldUser },
  { id: "conversations", name: "Conversations", icon: DollarSign },
]

export const sidebarGroupMap: Record<GroupId, SidebarGroup> =
  sidebarGroups.reduce((acc, group) => {
    acc[group.id] = group
    return acc
  }, {} as Record<GroupId, SidebarGroup>)

// ✅ sitemap items now reference groupId and proper roles
export const sitemap: NavItem[] = [
  {
    name: "Home",
    href: "/",
    dir: "app",
    protected: false,
    icon: Home,
    groupId: "general",
    type: "primary",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    dir: "app/(protected)/dashboard",
    protected: true,
    icon: LayoutDashboard,
    roles: ["OFFICER", "BATMAN", "SUPERMAN"],
    groupId: "general",
    type: "primary",
  },
  {
    name: "Admin Console",
    href: "/admin",
    dir: "app/(protected)/admin",
    protected: true,
    icon: AppWindowMac,
    roles: ["BATMAN", "SUPERMAN"], // Only admin & super admin
    groupId: "admin",
    type: "primary",
  },
  {
    name: "Convertions",
    href: "/convertions",
    dir: "app/(protected)/convertions",
    protected: true,
    icon: DollarSign,
    roles: ["OFFICER", "BATMAN", "SUPERMAN"],
    groupId: "general",
    type: "primary",
  },
  {
    name: "Profile",
    href: "/profile",
    dir: "app/(protected)/profile",
    protected: true,
    icon: User,
    roles: ["OFFICER", "BATMAN", "SUPERMAN"],
    groupId: "actions",
    type: "secondary",
  },
  {
    name: "Settings",
    href: "/settings",
    dir: "app/(protected)/settings",
    protected: true,
    icon: Settings,
    roles: ["SUPERMAN"], // Only Super Admin can access
    groupId: "actions",
    type: "secondary",
  },
  {
    name: "Login",
    href: "/auth/login",
    dir: "app/auth/login",
    protected: false,
  },
  {
    name: "Sign Up",
    href: "/auth/signup",
    dir: "app/auth/signup",
    protected: false,
  },
]
