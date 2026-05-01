"use client";
import { useEffect, useState } from "react";
import GoogleLoginButton from "@/components/AuthLayout/GoogleLoginButton";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("message") === "login_required") {
      toast.warning("Login required in order to access our services");
    }
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-6 mt-5 px-4">
        <div className="text-center space-y-1">
          <h3 className="font-bold text-2xl">Welcome to Cheap Chip</h3>
          <p className="text-gray-500 text-sm">Sign in to access our services</p>
        </div>

        <GoogleLoginButton
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </>
  );
}

export default Login;
