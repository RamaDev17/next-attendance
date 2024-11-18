"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useApi } from "@/hooks/use-api";
import { checkAuth } from "@/helpers/checkAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { request, isLoading } = useApi();

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const validateUser = async () => {
      const isAuthenticated = await checkAuth();

      if (isAuthenticated) {
        router.push("/admin/dashboard");
      }
    };

    validateUser();
  }, [router]);

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await request(
        "POST",
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/login`,
        {
          email,
          password,
          remember: rememberMe,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast({
        type: "foreground",
        duration: 2000,
        variant: "default",
        title: "Success",
        description: "Login successful.",
      });
      // Redirect to dashboard after login
      router.push("/admin/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          type: "foreground",
          duration: 5000,
          variant: "destructive",
          title: error.response?.data?.message || "Please try again.",
          description: "Please check your email and password.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        console.log("Login error:", error);
      }
      console.error("Unknown error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Purple section - hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-[#6B46C1] p-8 flex-col justify-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome back!</h1>
          <p className="text-white/90">
            You can sign in to access with your existing account.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-0 w-64 h-64 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 border border-white/20 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
      </div>

      {/* Login form section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={() => setRememberMe(!rememberMe)}
                    id="remember"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <Button
                className="w-full bg-[#6B46C1] hover:bg-[#5835A0]"
                type="submit"
              >
                {isLoading ? <LoadingSpinner /> : <span>Sign In</span>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
