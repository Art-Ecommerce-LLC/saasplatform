import { FC, ReactNode } from 'react';
import NavbarAccess from '@/app/components/NavbarAccess'; // Import the Navbar
import { Toaster } from '@/app/components/ui/toaster'; // Import Toaster
import Provider  from '@/app/components/Provider';


interface AuthLayoutProps {
  children: ReactNode;
}
const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className='bg-slate-200 p-10 rounded-md'>    
      <Provider>
      <main className="h-screen flex flex-col justify-center items-center">
        <NavbarAccess />
        {children}
      </main>
      <Toaster />
    </Provider>
  </div>
  );
}

export default AuthLayout;