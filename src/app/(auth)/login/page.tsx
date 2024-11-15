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
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URL}/auth/login`,
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Assume the response has a `token` field
      const { token } = response.data;

      // Determine where to store the token based on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);

      // Redirect to dashboard after login
      router.push("/admin/dashboard") // Ganti dengan halaman tujuan setelah login
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Login error:", error);
        alert(error.response?.data?.message || "Please try again.");
      } else {
        console.error("Unknown error:", error);
      }
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
                <Label htmlFor="email">Username or email</Label>
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
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
