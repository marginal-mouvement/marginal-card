import { use } from "react";
import { BookCopyIcon, Key, Settings } from "lucide-react";
import { Link, useLocation } from "react-router";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { ReaderContext } from "@/core/reader/reader.context.tsx";

export const Menu = () => {
  const { readerList } = use(ReaderContext);

  const location = useLocation();

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/station/settings">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Key className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Marginal Key</span>
                  <span className="truncate text-xs">Station</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarGroupLabel>Readers</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            {readerList.length === 0 && (
              <div className="mt-2 ml-2 text-muted-foreground text-xs flex flex-1 gap-2">
                <Spinner /> No readers connected
              </div>
            )}
            {readerList.map((reader) => (
              <SidebarMenuItem key={reader.id}>
                <Link to={`/reader/${reader.id}`}>
                  <SidebarMenuButton
                    isActive={location.pathname === `/reader/${reader.id}`}
                  >
                    <BookCopyIcon />
                    <span className="truncate">{reader.name}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Station</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <Link to="/station/settings">
                <SidebarMenuButton
                  isActive={location.pathname === "/station/settings"}
                >
                  <Settings /> Settings
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
};
