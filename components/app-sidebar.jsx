"use client";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar,
  Command,
  GalleryVerticalEnd,
  Home,
  LogOut,
  Palette,
  Settings2,
  SquareTerminal,
  Users,
} from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import fetchGlobal from "@/lib/fetch-data";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      icon: Palette,
    },
    {
      name: "Booking",
      url: "/booking",
      icon: Calendar,
    },
    {
      name: "Users",
      url: "/user",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const router = useRouter();

  const [theUser, setTheUser] = useState({
    full_name: "",
    email: "",
    role: "",
  });

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

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    const temp = JSON.parse(user);

    setTheUser(temp);
    if (!accessToken) router.push("/login");
  }, []);

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
