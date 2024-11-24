"use client";

import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/helpers/checkAuth";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button as ButtonUi } from "@/components/ui/button";
import { User } from "lucide-react";

const { Header, Sider, Content } = Layout;

export default function Admin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const router = useRouter();
  const { request, error } = useApi();
  const { toast } = useToast();

  useEffect(() => {
    const validateUser = async () => {
      const isAuthenticated = await checkAuth();

      if (!isAuthenticated) {
        toast({
          title: "Unauthorized",
          description: "You are not authorized to access this page",
          variant: "destructive",
        });
        router.push("/login");
      }
    };

    validateUser();
  }, [router, toast]);

  const logout = async () => {
    await request("POST", `${process.env.NEXT_PUBLIC_BE_URL}/auth/logout`);
    if (!error) {
      router.push("/login");
    } else {
      console.log(error);
    }
  };

  const AccountDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonUi
          variant="ghost"
          className="relative h-16 w-16 rounded-full text-[#1B3A57] hover:bg-[#3498DB]/20"
        >
          <User className="h-10 w-10" />
        </ButtonUi>
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
    <div className="flex min-h-screen">
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="p-2 mx-4 my-2 h-8 flex items-center justify-center bg-[#1B3A57] rounded-full" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: "Dashboard",
                onClick: () => {
                  router.push("/admin/dashboard");
                },
              },
              {
                key: "2",
                icon: <VideoCameraOutlined />,
                label: "Office",
                onClick: () => {
                  router.push("/admin/office");
                },
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            className="flex items-center justify-between px-4"
            style={{ background: colorBgContainer, padding: 0 }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className="p-4">
              <AccountDropdown />
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
