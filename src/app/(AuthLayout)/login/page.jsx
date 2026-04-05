"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";

function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleLogin = (data) => {
    console.log(data);
  };
  return (
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

          <Field className={"gap-1"}>
            <FieldLabel htmlFor="password" className={"font-semibold text-md"}>
              Password
            </FieldLabel>
            <div className="space-y-0.5">
              <Input
                id="password"
                type="password"
                placeholder="Enter Your Password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                    message:
                      "Minimum 6 chars, include number & special character",
                  },
                })}
              />
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
      </form>
      <p>
        Don't have an account? <Link href="register" className="underline hover:text-primary"> Register</Link> now!
      </p>
    </div>
  );
}

export default Login;
