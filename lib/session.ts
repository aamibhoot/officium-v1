'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

interface Redirects {
  loggedOut: string;
}

/**
 * Checks for a user session and redirects based on the authentication status.
 * This is a server-side utility function.
 * @param redirects - An object containing the paths to redirect to.
 * @param redirects.loggedOut - The path to redirect to if the user is not logged in.
 */
export async function checkSessionAndRedirect(redirects: Redirects) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(redirects.loggedOut);
  }
}
