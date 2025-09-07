"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
          <p className="text-muted-foreground mt-2">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
