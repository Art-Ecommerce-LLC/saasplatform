import '@/app/styles/globals.css';  // Add your global styles here
import NavbarAccess from '@/app/components/NavbarAccess'; // Import the Navbar
// import FooterAccess from '@/app/components/FooterAccess';
import { Inter } from 'next/font/google';
import { Toaster } from '@/app/components/ui/toaster'; // Import Toaster
import Provider  from '@/app/components/Provider';

const inter = Inter({ subsets: ['latin'] });

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
    <main className="h-screen flex flex-col justify-center items-center">
      <NavbarAccess />
      {children}
    </main>
    <Toaster />
  </Provider>
  );
}
