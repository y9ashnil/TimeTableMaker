"use client";

import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Book,
  School,
  Calendar,
  Sparkles,
  ChevronLeft,
  Settings,
  CalendarPlus,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppDataProvider } from "@/context/AppDataContext";

const ADMIN_ID = "TEST_ADMIN_001";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <AppDataProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo className="size-6 text-sidebar-primary" />
              <span className="text-lg font-semibold">TimeWise</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard")}
                  tooltip="Dashboard"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/timetables")}
                  tooltip="Timetables"
                >
                  <Link href="/timetables">
                    <Calendar />
                    <span>Timetables</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu className="mt-4">
              <SidebarMenuItem>
                <span className="px-2 text-xs font-medium uppercase text-muted-foreground/80">
                  Data Management
                </span>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/classrooms")}
                  tooltip="Classrooms"
                >
                  <Link href="/classrooms">
                    <School />
                    <span>Classrooms</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/faculty")}
                  tooltip="Faculty"
                >
                  <Link href="/faculty">
                    <Users />
                    <span>Faculty</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/subjects")}
                  tooltip="Subjects"
                >
                  <Link href="/subjects">
                    <Book />
                    <span>Subjects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/batches")}
                  tooltip="Batches"
                >
                  <Link href="/batches">
                    <UsersRound />
                    <span>Batches</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/fixed-slots")}
                  tooltip="Fixed Slots"
                >
                  <Link href="/fixed-slots">
                    <CalendarPlus />
                    <span>Fixed Slots</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-auto">
                  <Avatar className="size-8">
                    <AvatarImage src={`https://i.pravatar.cc/40?u=${ADMIN_ID}`} />
                    <AvatarFallback>TA</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium">Test Admin</span>
                    <span className="text-xs text-muted-foreground">{ADMIN_ID}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AppDataProvider>
  );
}
