"use client";

import * as React from "react";
import {
  Home,
  Menu,
  ChevronLeft,
  User,
  Bell,
//   Search,
  Building2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/helpers/checkAuth";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

export default function Admin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = React.useState(true);
  const router = useRouter();
  const {request, error} = useApi ();
  const {toast} = useToast()

  useEffect(() => {
    const validateUser = async () => {
      const isAuthenticated = await checkAuth();

      if (!isAuthenticated) {
        toast({
          title: "Unauthorized",
          description: "You are not authorized to access this page",
          variant: "destructive",
        })
        router.push("/login");
      }
    };

    validateUser();
  }, [router]);

  const logout = async () => {
    await request("POST", `${process.env.NEXT_PUBLIC_BE_URL}/auth/logout`);
    if (!error) {
      router.push("/login");
    }else{
      console.log(error);
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const NavItem = ({
    icon: Icon,
    label,
  }: {
    icon: React.ElementType;
    label: string;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "my-1 w-full justify-start text-white hover:bg-[#3498DB] hover:text-white",
              !isOpen && "justify-center p-2"
            )}
          >
            <Icon className={cn("h-5 w-5", isOpen && "mr-2")} />
            {isOpen && <span>{label}</span>}
          </Button>
        </TooltipTrigger>
        {!isOpen && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );

  const AccountDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full text-[#1B3A57] hover:bg-[#3498DB]/20"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">John Doe</p>
            <p className="text-xs leading-none text-muted-foreground">
              john.doe@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="flex min-h-screen bg-white">
      <nav
        className={cn(
          "flex flex-col bg-[#1B3A57] text-white transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex items-center justify-between p-4">
          {isOpen && <h2 className="text-xl font-bold">Dashboard</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto text-white hover:bg-[#3498DB]"
          >
            {isOpen ? <ChevronLeft /> : <Menu />}
          </Button>
        </div>
        <div className="flex-1 space-y-4 p-2">
          <Link href="/admin/dashboard">
            <NavItem icon={Home} label="Dashboard" />
          </Link>
          <Link href="/admin/office">
            <NavItem icon={Building2} label="Office" />
          </Link>
        </div>
      </nav>
      <div className="flex flex-1 flex-col">
        <header className="flex flex-col md:flex-row items-center justify-between border-b border-[#3498DB] p-4 bg-white text-[#1B3A57] space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {/* <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#3498DB]" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-[200px] lg:w-[300px] border-[#3498DB] focus:ring-[#3498DB] focus:border-[#3498DB]"
              />
            </div> */}
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#1B3A57] hover:bg-[#3498DB]/20"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <AccountDropdown />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 bg-white">{children}</main>
      </div>
    </div>
  );
}
