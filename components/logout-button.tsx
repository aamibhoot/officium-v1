'use client';

import { handleLogout } from '@/lib/auth-actions';
import { Button } from './ui/button';

export function LogoutButton() {
  return (
    <Button
      type='button'
      variant='ghost'
      onClick={() => handleLogout()}
    >
      Logout
    </Button>
  );
}
