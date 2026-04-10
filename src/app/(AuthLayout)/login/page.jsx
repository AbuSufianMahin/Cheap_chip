"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import GoogleLoginButton from "@/components/AuthLayout/GoogleLoginButton";
import LinkAccountDialog from "@/components/shared/LinkAccountDialog";

function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (data) => {
    console.log(data);
  };

  return (
    <>
      <div className="space-y-4 mt-5">
        <div className="text-center">
          <h3 className="font-bold text-2xl">Login to your account</h3>
          <p>Enter Credentials to Log in to your account</p>
        </div>
        <form onSubmit={handleSubmit(handleLogin)}>
          <FieldGroup className="gap-3">
            <Field className={"gap-1"}>
              <FieldLabel htmlFor="email" className={"font-semibold text-md"}>
                Email
              </FieldLabel>
              <div className="space-y-0.5">
                <Input
                  id="email"
                  placeholder="m@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Please enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs ml-1 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </Field>

            <Field className={"gap-1"}>
              <FieldLabel
                htmlFor="password"
                className={"font-semibold text-md"}
              >
                Password
              </FieldLabel>
              <div className="space-y-0.5">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter Your Password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <Button
                    className={
                      "absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                    }
                    variant="outline"
                    type="button"
                    size="sm"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <FaRegEyeSlash size={14} />
                    ) : (
                      <FaRegEye size={14} />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs ml-1 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </Field>
            <Field>
              <Button type="submit">Login</Button>
            </Field>
          </FieldGroup>

          <FieldSeparator className={"my-3"}>Or continue with</FieldSeparator>

          <GoogleLoginButton
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </form>
        <p className="text-sm md:text-md">
          Don't have an account?{" "}
          <Link href="register" className="underline hover:text-primary">
            {" "}
            Register
          </Link>{" "}
          now!
        </p>
      </div>
      <LinkAccountDialog/>
    </>
  );
}

export default Login;
