'use client';

import { TestConnection } from '@/components/test-connection';

export default function TestPage() {
  return (
    <div className="container max-w-2xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Connection Test</h1>
          <p className="text-gray-500">Test your Supabase connection and authentication</p>
        </div>
        <TestConnection />
      </div>
    </div>
  );
}
