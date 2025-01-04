"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        if (session.user.user_metadata?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      }
    }
    checkSession()
  }, [supabase.auth, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)

    try {
      let signInResult;

      // Try admin login first
      if (usernameOrEmail === 'admin' && password === 'admin123') {
        signInResult = await supabase.auth.signInWithPassword({
          email: 'admin@habitflow.app',
          password: 'admin123',
        });
      } else {
        // Regular user login
        signInResult = await supabase.auth.signInWithPassword({
          email: usernameOrEmail,
          password,
        });
      }

      if (signInResult.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: signInResult.error.message,
        });
        return;
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      // Use window.location for a hard refresh
      window.location.href = '/dashboard';
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during login",
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
      })
      if (error) throw error
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during OAuth sign in",
      })
    }
  }

  const handleAdminLogin = () => {
    setUsernameOrEmail('admin');
    setPassword('admin123');
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" disabled={loading} />
                <Label htmlFor="remember" className="text-sm text-gray-500">Remember me</Label>
              </div>
              <Link href="/reset-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-10" disabled={loading}>
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
                <Image src="/google.svg" alt="Google" width={18} height={18} className="mr-2" />
                Google
              </Button>
              <Button 
                variant="outline" 
                className="h-10"
                onClick={() => handleOAuthSignIn('twitter')}
                disabled={loading}
              >
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">admin access</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-10"
              onClick={handleAdminLogin}
              disabled={loading}
            >
              Login as Admin
            </Button>
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
