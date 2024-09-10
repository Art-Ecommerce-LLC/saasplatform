"use client"; // This makes the component a client component

import './styles/globals.css';  // Add your global styles here
import Navbar from './components/Navbar'; // Import the Navbar
import Footer from './components/Footer';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider
import { Toaster } from '@/app/components/ui/toaster'; // Import Toaster

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${inter.className} flex flex-col min-h-screen bg-white`}>
        {/* Wrap the whole application in SessionProvider */}
        <SessionProvider>
          <nav>
            <Navbar />
          </nav>
          <main className="flex-grow flex items-center justify-center bg-white">
            {children}
          </main>
          
          <footer className="bg-white">
            <Footer />
          </footer>
          <Toaster />
        </SessionProvider>
        
      </body>
      
    </html>
  );
}
