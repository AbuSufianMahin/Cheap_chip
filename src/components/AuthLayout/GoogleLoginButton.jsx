import React from "react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

function GoogleLoginButton({ isLoading, setIsLoading }) {
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const result = await signIn("google", {
      callbackUrl: "/home",
      redirect: true,
    });

    if (result?.error) {
      toast.error("Google login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={() => handleGoogleLogin()}
      disabled={isLoading}
    >
      <FcGoogle />
      Continue with Google
    </Button>
  );
}

export default GoogleLoginButton;
