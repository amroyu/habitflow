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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission with firstName and lastName instead of fullName
  };

  const handleImageChange = (file: File) => {
    setProfileImage(file);
  };

  return (
    <div className="flex h-full w-full">
      {/* Left section - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-2xl space-y-4 px-4">
          <div className="flex flex-col items-center space-y-4">
            <AvatarUpload onImageChange={handleImageChange} />
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="text-gray-500 text-sm">Start your journey to better habits</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-11 w-full text-base"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-11 w-full text-base"
                />
              </div>
            </div>

            {/* Username and Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 w-full text-base"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full text-base"
                />
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full text-base"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 w-full text-base"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" className="h-4 w-4" />
              <Label htmlFor="terms" className="text-sm text-gray-500">
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

            <Button type="submit" className="w-full h-10">
              Create Account
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
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
      
      {/* Right section - Background Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#C8E6EA]">
        <div className="relative h-full w-full p-12">
          <Image
            src="/images/auth/signup-bg.jpg"
            alt="Journey to better habits"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8E6EA]/50 via-transparent to-[#C8E6EA]/50" />
      </div>
    </div>
  );
}
