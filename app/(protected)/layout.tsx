import type { Metadata } from "next"
import {checkSessionAndRedirect} from "@/lib/session"
import { Geist, Geist_Mono } from "next/font/google"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import PageTransitionProvider from "@/components/pgtranstions/page-transition-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}`,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side session check and redirect if not authenticated
  await checkSessionAndRedirect({
    loggedOut: '/auth/login',
  });
  return (
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 52)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <AppHeader />
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </SidebarInset>
        </SidebarProvider>

  )
}


