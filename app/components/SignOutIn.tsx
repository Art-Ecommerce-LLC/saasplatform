import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import UserAccountNav from './UserAccountnav';

const SignOutIn = async () => {

    const session = await getServerSession(authOptions);
    return (
        <div>
            {session?.user ? (
                <UserAccountNav />
            ) : (
                <Link className={buttonVariants()} href='/sign-in'>
                    Sign in
                </Link>
            )}
        </div>
    );
};

export default SignOutIn;