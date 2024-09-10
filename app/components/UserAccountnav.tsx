'use client';

import { signOut } from 'next-auth/react';
import { Button } from './ui/button';

const UserAccountNav = () => {
  return (
    <nav className='flex space-x-4'>
      <Button onClick={() => signOut(
        {
            redirect: true,
            callbackUrl: `${window.location.origin}/sign-in`
        }
      )} variant='destructive'>Sign Out</Button>
    </nav>
  );
}; 

export default UserAccountNav;