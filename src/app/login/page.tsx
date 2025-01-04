"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import { adminLogin } from './actions';

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: usernameOrEmail,
        password,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have been signed in successfully.",
      });

      router.refresh();
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'twitter') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAdminLogin = async () => {
    setLoading(true);

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@habitflow.app',
        password: 'admin123',
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (!signInData?.user) {
        throw new Error('No user data received');
      }

      toast({
        title: "Success",
        description: "Logged in as admin successfully.",
      });

      router.refresh();
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: "Error",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Left section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-[120px] h-[30px] relative">
              <Image
                src="/logos/logo-light.svg"
                alt="HabitFlow"
                fill
                className="dark:hidden"
                unoptimized
              />
              <Image
                src="/logos/logo-dark.svg"
                alt="HabitFlow"
                fill
                className="hidden dark:block"
                unoptimized
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

            <Button 
              type="submit" 
              className="w-full h-10"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
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
              <Button 
                variant="outline" 
                className="h-10"
                onClick={() => handleOAuthSignIn('google')}
                disabled={loading}
              >
                <div className="relative w-[18px] h-[18px] mr-2">
                  <Image
                    src="/google.svg"
                    alt="Google"
                    fill
                    className="mr-2"
                    unoptimized
                  />
                </div>
                Google
              </Button>
              <Button 
                variant="outline" 
                className="h-10"
                onClick={() => handleOAuthSignIn('twitter')}
                disabled={loading}
              >
                <div className="relative w-[18px] h-[18px] mr-2">
                  <Image
                    src="/twitter.svg"
                    alt="Twitter"
                    fill
                    className="mr-2"
                    unoptimized
                  />
                </div>
                Twitter
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">Quick Access</span>
              </div>
            </div>

            <Button 
              variant="secondary"
              className="w-full h-10"
              onClick={handleAdminLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login as Admin"}
            </Button>

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
            style={{ 
              objectFit: 'cover', 
              objectPosition: '75% center',
            }}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
