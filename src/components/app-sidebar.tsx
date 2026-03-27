import profile from "@/assets/profile.png";
import useAuth from "@/context/useAuth";
import {
  FolderPlus,
  FolderTree,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  PlusCircle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const menuGroups = [
  {
    label: "Panel Principal",
    items: [{ title: "Dashboard", url: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Gestión",
    items: [
      { title: "Productos", url: "/admin/products", icon: PackageSearch },
      { title: "Categorías", url: "/admin/categories", icon: FolderTree },
    ],
  },
  {
    label: "Accesos Rápidos",
    items: [
      { title: "Nuevo Producto", url: "/admin/products/new", icon: PlusCircle },
      {
        title: "Nueva Categoría",
        url: "/admin/categories/new",
        icon: FolderPlus,
      },
    ],
  },
];

export const AppSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Sesión cerrada");
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center transition-all duration-300">
          <Avatar className="size-11 group-data-[collapsible=icon]:size-8 transition-all duration-300">
            <AvatarImage src={profile} className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
              Lía
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-lg leading-tight text-primary">
              Aylis Scrap
            </span>
            <span className="text-xs text-primary/70 font-semibold tracking-wide uppercase">
              Admin Panel
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Link to={item.url} className="w-full">
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isActive}
                          className={
                            isActive
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : "hover:bg-muted"
                          }
                        >
                          <item.icon className="size-4 text-primary" />
                          <span className="font-medium">{item.title}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              <span className="group-data-[collapsible=icon]:hidden">
                Cerrar Sesión
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
