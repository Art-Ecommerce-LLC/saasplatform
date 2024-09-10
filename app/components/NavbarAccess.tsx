import Link from 'next/link';
import { HandMetal } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import SignOutIn from './SignOutIn';

const NavbarAcess = async () => {

    const session = await getServerSession(authOptions);

    return (
    <div className=' bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
        <div className='container flex items-center justify-between'>
        <Link href='/'>
            <HandMetal />
        </Link>
        <SignOutIn />
        </div>
    </div>
    );
};

export default NavbarAcess;