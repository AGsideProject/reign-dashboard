"use client";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import clsx from "clsx";

export function NavProjects({ projects }) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <Separator />
      <SidebarMenu className="mt-5">
        {projects.map((item) => {
          const isActive = pathname.substring(1) === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a
                  href={`/${item.url}`}
                  className={clsx(
                    "flex items-center gap-2 p-2 rounded-md",
                    isActive
                      ? "bg-primary text-white hover:bg-primary hover:text-white"
                      : "hover:bg-gray-300"
                  )}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
