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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import GoogleLoginButton from "@/components/AuthLayout/GoogleLoginButton";

function page() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleRegister = async (data) => {
    console.log(data);
  };

  return (
    <div className="space-y-4 mt-5">
      <div className="text-center">
        <h3 className="font-bold text-2xl">Create your account</h3>
        <p>Enter your details to register a new account</p>
      </div>

      <form onSubmit={handleSubmit(handleRegister)}>
        <FieldGroup className="gap-3">
          {/* Name */}
          <Field className={"gap-1"}>
            <FieldLabel htmlFor="name" className={"font-semibold text-md"}>
              Name
            </FieldLabel>
            <div className="space-y-0.5">
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs ml-1 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </Field>

          {/* Email */}
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
                    message: "Enter a valid email",
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

          {/* Password */}
          <Field className={"gap-1"}>
            <FieldLabel htmlFor="password" className={"font-semibold text-md"}>
              Password
            </FieldLabel>
            <div className="space-y-0.5">
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                      message:
                        "Minimum 6 chars, include number & special character",
                    },
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
                    <FaRegEyeSlash size={12} />
                  ) : (
                    <FaRegEye size={12} />
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

          {/* Confirm Password */}
          <Field className={"gap-1"}>
            <FieldLabel
              htmlFor="confirmPassword"
              className={"font-semibold text-md"}
            >
              Confirm Password
            </FieldLabel>
            <div className="space-y-0.5">
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Re-enter your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                <Button
                  className={
                    "absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                  }
                  variant="outline"
                  type="button"
                  size="sm"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? (
                    <FaRegEyeSlash size={12} />
                  ) : (
                    <FaRegEye size={12} />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs ml-1 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </Field>

          {/* Submit */}
          <Field>
            <Button type="submit">Register</Button>
          </Field>
        </FieldGroup>

        <FieldSeparator className={"my-3"}>Or continue with</FieldSeparator>

        <GoogleLoginButton />
      </form>

      <p className="text-sm md:text-md">
        Already have an account?{" "}
        <Link href="login" className="underline hover:text-primary">
          Login
        </Link>{" "}
        here!
      </p>
    </div>
  );
}

export default page;
