"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookIcon,
  BookOpen,
  Bot,
  Calendar,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  LogOut,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
  User2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import fetchGlobal from "@/lib/fetch-data";

// This is sample data.
const data = {
  user: {
    name: "reign",
    email: "reign@example.com",
    avatar: "/avatars/reign.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Home",
      url: "/",
      icon: Home,
    },
    {
      name: "Models",
      url: "/models",
      icon: User,
    },
    {
      name: "Booking",
      url: "/booking",
      icon: Calendar,
    },
    {
      name: "Users",
      url: "/user",
      icon: User2,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const user = localStorage.getItem("user");
  const theUser = JSON.parse(user);

  const handleLogout = async () => {
    try {
      await fetchGlobal("/v1/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    sessionStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <NavUser user={theUser} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={data.projects} />
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <Separator />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleLogout}>
                <div className="flex gap-4 items-center text-destructive hover:text-destructive ">
                  <LogOut size={14} />
                  Logout
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}

      <SidebarRail />
    </Sidebar>
  );
}
