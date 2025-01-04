"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-full w-full">
      {/* Left section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-[120px]">
              <Image
                src="/logos/logo-light.svg"
                alt="HabitFlow"
                width={120}
                height={30}
                priority
                className="dark:hidden"
              />
              <Image
                src="/logos/logo-dark.svg"
                alt="HabitFlow"
                width={120}
                height={30}
                priority
                className="hidden dark:block"
              />
            </div>
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold">Welcome back!</h1>
              <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="usernameOrEmail" className="text-sm">Username or Email</Label>
              <Input
                id="usernameOrEmail"
                type="text"
                placeholder="Username or email"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-gray-500">Remember me</Label>
              </div>
              <Link href="/reset-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-10">
              Sign in
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-10">
                <Image src="/google.svg" alt="Google" width={18} height={18} className="mr-2" />
                Google
              </Button>
              <Button variant="outline" className="h-10">
                <Image src="/twitter.svg" alt="Twitter" width={18} height={18} className="mr-2" />
                Twitter
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right section - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-[calc(100vh-64px)]">
            <Image
              src="/login-background.jpg"
              alt="Login"
              fill
              sizes="50vw"
              priority
              style={{ 
                objectFit: 'cover', 
                objectPosition: '75% center',
                maxHeight: 'calc(100vh - 64px)' 
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
