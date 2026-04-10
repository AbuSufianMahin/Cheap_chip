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
import axiosPublic from "@/lib/axiosPublic";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

function registerPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm();

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data) => {
    try {
      setIsLoading(true);

      const { name, email, password } = data;

      const res = await axiosPublic.post("/api/authentication/register", { name, email, password});
      console.log(res.data);

    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 409) {
          // Handling your custom backend error codes
          if (data.code === "ACCOUNT_EXISTS_GOOGLE_ONLY") {
            toast.error("This email is linked to Google. Please sign in with Google.",
            );
          } else {
            toast.error(data.message || "Email already in use.");
          }

        }
        else if(status === 429){
          if (data.code === "TOO_MANY_REQUESTS"){
            toast.warning(data.message || "Too many requests. Please try again later");
          }
        
        } else {
          toast.error("Something went wrong on the server.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }

    } finally {
      setIsLoading(false);
    }
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
                placeholder="Enter your name"
                {...register("name", {
                  required: "Name is required",
                })}
                className={errors.name && "placeholder:text-red-500/70"}
                aria-invalid={errors.name ? true : false}
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
                className={errors.email && "placeholder:text-red-500/70"}
                aria-invalid={errors.email ? "true" : "false"}
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
                  className={errors.password && "placeholder:text-red-500/70"}
                  aria-invalid={errors.password ? "true" : "false"}
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
                  className={
                    errors.confirmPassword && "placeholder:text-red-500/70"
                  }
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
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
            <Button type="submit"  disabled={isLoading}>Register {isLoading && <Spinner/>} </Button>
          </Field>
        </FieldGroup>

        <FieldSeparator className={"my-3"}>Or continue with</FieldSeparator>

        <GoogleLoginButton isLoading={isLoading} setIsLoading={setIsLoading}/>
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

export default registerPage;
