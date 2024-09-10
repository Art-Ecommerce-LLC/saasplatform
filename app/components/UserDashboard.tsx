'use client';

import Link from 'next/link';
import { buttonVariants } from './ui/button';

const DashboardUser = () => {
  return (
    <nav className='flex space-x-4'>
      <Link href='/admin' className={buttonVariants()}>
        Dashboard
      </Link>
    </nav>
  );
}; 

export default DashboardUser;