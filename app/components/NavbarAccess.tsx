import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { HandMetal } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { signOut } from 'next-auth/react';
import { Button } from '@/app/components/ui/button';

const Navbar = async () => {

    const session = await getServerSession(authOptions);

    return (
    <div className=' bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
        <div className='container flex items-center justify-between'>
        <Link href='/'>
            <HandMetal />
        </Link>
        {session?.user ? (
            <Button onClick={() => signOut()} variant="destructive">Sign out</Button>
        ) : (
            <Link className={buttonVariants()} href='/sign-in'>
                Sign in
            </Link>
        )}
        <Link className={buttonVariants()} href='/sign-in'>
            Sign in
        </Link>
        </div>
    </div>
    );
};

export default Navbar;