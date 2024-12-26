"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { AvatarUpload } from "../../components/ui/avatar-upload";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission including the profile image
  };

  const handleImageChange = (file: File) => {
    setProfileImage(file);
  };

  return (
    <div className="flex h-full w-full">
      {/* Left section - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-md space-y-3">
          <div className="flex flex-col items-center space-y-1">
            <AvatarUpload onImageChange={handleImageChange} />
            <div className="text-center">
              <h1 className="text-xl font-bold">Create an account</h1>
              <p className="text-gray-500 text-xs">Start your journey to better habits</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-1.5">
            <div className="space-y-0.5">
              <Label htmlFor="fullName" className="text-xs">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-8"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="username" className="text-xs">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-8"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="email" className="text-xs">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-8"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-8"
              />
            </div>

            <div className="flex items-center space-x-2 mt-1.5">
              <Checkbox id="terms" className="h-3 w-3" />
              <Label htmlFor="terms" className="text-xs text-gray-500">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full h-8 mt-1.5 text-sm">
              Create Account
            </Button>

            <div className="relative my-1.5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-8 text-xs">
                <Image src="/google.svg" alt="Google" width={16} height={16} className="mr-1.5" />
                Google
              </Button>
              <Button variant="outline" className="h-8 text-xs">
                <Image src="/twitter.svg" alt="Twitter" width={16} height={16} className="mr-1.5" />
                Twitter
              </Button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-1.5">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right section - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <Image
            src="/login-background.jpg"
            alt="Login"
            fill
            sizes="50vw"
            priority
            style={{ 
              objectFit: 'cover', 
              objectPosition: '75% center'
            }}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
