"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { checkAuth } from "@/helpers/checkAuth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const validateUser = async (router: AppRouterInstance | string[]) => {
  const isAuthenticated = await checkAuth();
  
  if (isAuthenticated) {
    
    router.push("/admin/dashboard");
  }else{
    console.log('disinikah?');
    router.push("/login")
  }
};

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    validateUser(router);
  }, [router]);

  return(
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
    </div>
  )
}
