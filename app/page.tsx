import Link from 'next/link';
import { buttonVariants } from '@/app/components/ui/button';

export default function HomePage() {
  return (
    <div>
      <h1 className='text-4xl'> Welcome to the homepage</h1>
      <Link className={buttonVariants()} href='/admin' >
        Open My Admin Dashboard
      </Link>
    </div>
  );
}
