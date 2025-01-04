"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHabits: 0,
    activeUsers: 0,
  });
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAdminSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      if (!session.user.user_metadata?.role || session.user.user_metadata.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      // Load admin dashboard data
      try {
        const [
          { count: totalUsers },
          { count: totalHabits },
          { count: activeUsers }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact' }),
          supabase.from('habits').select('*', { count: 'exact' }),
          supabase.from('profiles')
            .select('*', { count: 'exact' })
            .gt('last_sign_in', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        setStats({
          totalUsers: totalUsers || 0,
          totalHabits: totalHabits || 0,
          activeUsers: activeUsers || 0,
        });
      } catch (error) {
        console.error('Error loading admin stats:', error);
      }

      setLoading(false);
    };

    checkAdminSession();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Number of registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Habits</CardTitle>
            <CardDescription>Number of habits created</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalHabits}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Users active in last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeUsers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add more admin features here */}
    </div>
  );
}
