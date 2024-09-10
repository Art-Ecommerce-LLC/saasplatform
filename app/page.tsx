// HomePage.tsx
import { buttonVariants } from '@/app/components/ui/button';
import Link from 'next/link';
import User from '@/app/components/User';
import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';
import Navbar from '@/app/components/Navbar';  // Import Navbar
import Footer from '@/app/components/Footer';

export default async function HomePage() {
  const session = await getServerSession(authOptions);  // Fetch the session here

  return (
    <div>
      <div className="h-screen bg-gray-100">
      <Navbar session={session} />  {/* Pass the session to Navbar as a prop */}
      <h1 className='text-4xl'> Welcome to the homepage</h1>
      <Link className={buttonVariants()} href='/admin'>
        Open My Admin Dashboard
      </Link>

      <h2> Client Session </h2>
      <User />
      <h2> Server Session </h2>
      {JSON.stringify(session)}  {/* Optionally, display the session */}
      </div>
      <Footer session={session}/>
    </div>
  );
}
