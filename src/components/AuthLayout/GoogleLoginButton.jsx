import React from "react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

function GoogleLoginButton({isLoading}) {
  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/home" });
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
