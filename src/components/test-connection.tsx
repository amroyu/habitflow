'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

export function TestConnection() {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'error'>('untested');
  const [authStatus, setAuthStatus] = useState<'untested' | 'success' | 'error'>('untested');
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // Test database connection
  const testConnection = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (error) throw error;

      setConnectionStatus('success');
      toast({
        title: 'Connection Success',
        description: 'Successfully connected to Supabase database',
      });
    } catch (error: any) {
      setConnectionStatus('error');
      toast({
        title: 'Connection Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test authentication
  const testAuth = async () => {
    setIsLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (session) {
        setAuthStatus('success');
        toast({
          title: 'Authentication Success',
          description: `Logged in as: ${session.user.email}`,
        });
      } else {
        setAuthStatus('error');
        toast({
          title: 'Authentication Status',
          description: 'No active session found',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      setAuthStatus('error');
      toast({
        title: 'Authentication Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 border rounded-lg">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Connection Test</h2>
        <p className="text-sm text-gray-500">Test your Supabase connection and authentication status</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Database Connection</h3>
            <p className="text-sm text-gray-500">Test connection to Supabase database</p>
          </div>
          <div className="flex items-center gap-3">
            {connectionStatus !== 'untested' && (
              <span className={`text-sm ${connectionStatus === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {connectionStatus === 'success' ? '✓ Connected' : '✗ Failed'}
              </span>
            )}
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              variant={connectionStatus === 'success' ? 'outline' : 'default'}
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Authentication Status</h3>
            <p className="text-sm text-gray-500">Check if you're authenticated</p>
          </div>
          <div className="flex items-center gap-3">
            {authStatus !== 'untested' && (
              <span className={`text-sm ${authStatus === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {authStatus === 'success' ? '✓ Authenticated' : '✗ Not Authenticated'}
              </span>
            )}
            <Button 
              onClick={testAuth} 
              disabled={isLoading}
              variant={authStatus === 'success' ? 'outline' : 'default'}
            >
              {isLoading ? 'Testing...' : 'Test Auth'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
