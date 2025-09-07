"use client";

import { ChevronRight, PlusCircle } from "lucide-react";
import { sidebarGroupMap, type GroupId, type NavItem } from "@/lib/sitemap";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import React from "react";

export function NavMain({
  items,
  currentUserRole,
}: {
  items: NavItem[];
  currentUserRole?: string;
}) {
  const pathname = usePathname();

  // Filter by role
 const filteredItems = items.filter(
  (item) =>
    !item.roles || item.roles.length === 0 || item.roles.includes(currentUserRole || "")
);


  // Group items
  const groupedItems = filteredItems.reduce((acc, item) => {
    const group = item.groupId || "general";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<GroupId, NavItem[]>);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        {/* Quick create button */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground min-w-8 duration-200 ease-linear opacity-50 cursor-not-allowed pointer-events-none h-8 text-xs"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Ticket</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Collapsible Groups */}
        {Object.entries(groupedItems).map(([groupId, groupItems]) => {
          const groupObject = sidebarGroupMap[groupId as GroupId];
          if (!groupObject) return null;
          const GroupIcon = groupObject.icon;
          const groupName = groupObject.name;

          return (
            <SidebarMenu key={groupId}>
              <Collapsible asChild defaultOpen className="group/collapsible">
                <SidebarMenuItem className="has-data-[state=open]/collapsible:ring-1 has-data-[state=open]/collapsible:ring-sidebar-ring has-data-[state=open]/collapsible:bg-sidebar-accent/20 rounded-md">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-8 text-xs">
                      {GroupIcon && <GroupIcon className="h-3.5 w-3.5" />}
                      <span className="font-medium">{groupName}</span>
                      <ChevronRight className="ml-auto h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {/* Group Items */}
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-3 border-l-2 border-dotted border-white/50 pl-2 space-y-1">
                      {groupItems.map((item) => {
                        const isActive = pathname === item.href;
                        const ItemIcon = item.icon;
                        return (
                          <SidebarMenuSubItem key={item.name}>
                            <SidebarMenuSubButton asChild isActive={isActive} className="h-7 text-xs">
                              <Link href={item.href as Route} className="flex items-center gap-2">
                                {ItemIcon && <ItemIcon className="h-3.5 w-3.5" />}
                                <span>{item.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          );
        })}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
