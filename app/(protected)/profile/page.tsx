"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  IdCard,
  Fingerprint,
  Clock,
  Key,
  RefreshCw,
  MapPin,
  Signature,
} from "lucide-react";
import {
  FaDesktop,
  FaMobileAlt,
  FaChrome,
  FaFirefox,
  FaSafari,
} from "react-icons/fa";
import moment from 'moment';

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    await auth.api.signOut({ headers: await headers() });
    redirect("/auth/login");
  }

  const { user } = session;

  // get all active sessions for this user
  const allSessions = await auth.api.listSessions({
    headers: await headers(),
  });
  const userSessions = allSessions.filter(
    (s) => s.userId === user.id
  );

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
        return 'bg-gray-400';
    }
  }

 function getDeviceIcon(userAgent: string) {
  const ua = userAgent.toLowerCase();
  let icon = <FaDesktop className="text-gray-400" />;
  let label = "Unknown Device";

  if (ua.includes("mobile")) {
    icon = <FaMobileAlt className="text-blue-500" />;
    label = "Mobile Device";
  } else if (ua.includes("windows") || ua.includes("mac") || ua.includes("linux")) {
    icon = <FaDesktop className="text-gray-600" />;
    label = "Desktop Device";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center">{icon}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


  function getBrowserIcon(userAgent: string, isCurrent: boolean) {
    const ua = userAgent.toLowerCase();
    const color = isCurrent ? "text-green-500" : "text-gray-500";
    let icon;

    if (ua.includes("chrome") && !ua.includes("edge")) {
      icon = <FaChrome className={color} />;
    } else if (ua.includes("firefox")) {
      icon = <FaFirefox className={color} />;
    } else if (ua.includes("safari") && !ua.includes("chrome")) {
      icon = <FaSafari className={color} />;
    } else {
      icon = <FaDesktop className={color} />;
    }

    const tooltipContent = isCurrent ? "Current Session" : "Active Session";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center">{icon}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-10 bg-gray-100 dark:bg-gray-900/50 rounded-lg shadow-sm">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-10 flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24 rounded-full ring-1 ring-primary/40">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : (
             <AvatarImage src={`/profile.png`} alt={user.name} />
            )}
          </Avatar>
          <span className={`absolute bottom-0 right-0 block h-6 w-6 rounded-full border-2 border-white dark:border-gray-800 ${userStatusDot(session ? "online" : "offline")}`} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {user.name}
          </h1>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {user.role}
            </Badge>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Badge
            variant={user.emailVerified ? "default" : "destructive"}
            className="w-fit text-xs"
          >
            {user.emailVerified ? "Email Verified" : "Email Not Verified"}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
          <Signature className="size-6 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">User Created</p>
            <p className="text-sm font-medium">
              {moment(user.createdAt).format('MMMM Do YYYY')}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
          <Fingerprint className="size-6 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="text-sm font-medium break-all">{user.id}</p>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mt-6">
        Active Sessions ({userSessions.length})
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {userSessions.map((s) => (
          <div
            key={s.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-4"
          >
            {getDeviceIcon(s?.userAgent || "")}
            {getBrowserIcon(s?.userAgent || "", s.id === session.session.id)}
            <div>
              <p className="text-sm font-medium">Session: {s.id}</p>
              <p className="text-xs text-muted-foreground">
                {s.userAgent}
              </p>
              <p className="text-xs">
                Last updated: {moment(s.updatedAt).fromNow()} (at {new Date(s.updatedAt).toLocaleString()})
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Session Info */}
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mt-6">
        Current Session Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
          <Key className="size-6 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Token</p>
            <p className="text-sm font-medium break-all">
              {session.session.token}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
          <Clock className="size-6 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Expires At</p>
            <p className="text-sm font-medium">
              {moment(session.session.expiresAt).fromNow()} (at {new Date(session.session.expiresAt).toLocaleString()})
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
          <RefreshCw className="size-6 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="text-sm font-medium">
              {moment(session.session.updatedAt).fromNow()} (at {new Date(session.session.updatedAt).toLocaleString()})
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
          <MapPin className="size-6 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">IP Address</p>
            <p className="text-sm font-medium">
              {session.session.ipAddress || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
