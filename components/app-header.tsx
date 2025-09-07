"use client";

import { usePathname, useRouter } from "next/navigation";
import { sitemap } from "@/lib/sitemap";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import OutlookButton from "./open-outlook";
import { IconArrowLeft } from "@tabler/icons-react";
import { CurrentBCRateCompoment } from "@/components/current-bcrate";

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const currentPage = sitemap.find((item) => item.href === pathname);
  const pageTitle = currentPage ? currentPage.name : "Dashboard"; // Default title

  return (
    <header className="flex h-(--header-height) bg-white shrink-0 items-center gap-2 border-b border-gray-200 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) shadow-md z-10 lg:rounded-t-lg">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-2">
        <SidebarTrigger className="-ml-1" />
        <Button variant="ghost" size="icon" className="size-7" onClick={() => router.back()}>
          <IconArrowLeft />
          <span className="sr-only">Back</span>
        </Button>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <CurrentBCRateCompoment rate={1.00} type="usd" />
          <OutlookButton />
        </div>
      </div>
    </header>
  );
}
