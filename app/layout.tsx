import './styles/globals.css';  // Add your global styles here
import { Inter } from 'next/font/google';
import Provider  from '@/app/components/Provider';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider>
        {children}
        </Provider>
      </body>
    </html>
  );
}
