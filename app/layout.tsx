import './styles/globals.css';  // Add your global styles here
import Navbar from './components/Navbar'; // Import the Navbar
import Footer from './components/Footer';
import { Inter } from 'next/font/google';
import { Toaster } from '@/app/components/ui/toaster'; // Import Toaster
import Provider  from './components/Provider'; // Import Provider

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${inter.className} flex flex-col min-h-screen bg-white`}>
        {/* Wrap the whole application in SessionProvider */}
        <Provider>
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
        </Provider>
        
      </body>
      
    </html>
  );
}
