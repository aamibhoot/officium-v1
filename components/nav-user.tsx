"use client";

import { useRouter } from "next/navigation";
import {
  CreditCard,
  LogOut,
  Bell,
  UserCircle,
  ChevronsUpDown,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { handleLogout } from "@/lib/auth-actions";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
    role: string;
    status?: string; // Added status prop
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  // Correct way to handle logout with a server action
  const onLogout = async () => {
    await handleLogout();
    router.push("/auth/login");
    router.refresh(); // Ensures the session state is cleared on the client
  };

  // Function to determine status dot color
  function userStatusDot(status: string) {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-400';
      case 'busy':
        return 'bg-yellow-400';
      case 'inactive':
        return 'bg-gray-400';
      default:
        return '';
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="
                data-[state=open]:bg-sidebar-accent/50
                data-[state=open]:text-sidebar-accent-foreground
                h-18
                group
              "
            >
              <div className="relative"> {/* Added relative div */}
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {/* Status dot */}
                {user.status && (
                  <span
                    className={`
                      absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white
                      ${userStatusDot(user.status)}
                    `}
                    title={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  />
                )}
              </div>
              <div className="flex-1 flex flex-col text-left leading-tight">
                <span className="truncate text-sm font-medium">
                  {user.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {user.email}
                </span>
                <span className="truncate text-xs font-mono uppercase text-sidebar-foreground/50">
                  {user.role}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 shrink-0 text-sidebar-foreground/50 transition-transform group-data-[state=open]:rotate-90" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-xl shadow-lg border-border bg-popover/95 p-1 backdrop-blur-sm"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <UserCircle className="mr-2 size-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/billing")}>
                <CreditCard className="mr-2 size-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/notifications")}>
                <Bell className="mr-2 size-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:bg-red-500/10 focus:text-red-500">
              <LogOut className="mr-2 size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
