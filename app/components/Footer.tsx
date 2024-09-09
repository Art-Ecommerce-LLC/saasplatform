import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 py-6">
            <div className="container mx-auto text-center">
                <nav className="mb-4">
                    {/* Modify flex-direction for 420px */}
                    <ul className="flex flex-col custom-520:flex-row justify-center items-center space-y-4 custom-520:space-y-0 custom-520:space-x-4">
                        <li className="flex items-center">
                            <Link href="/" className="text-gray-300 hover:text-white transition duration-300">
                                Home
                            </Link>
                        </li>
                        <li className="text-gray-500 mx-2 hidden custom-520:inline">|</li>
                        <li className="flex items-center">
                            <Link href="/about" className="text-gray-300 hover:text-white transition duration-300">
                                About
                            </Link>
                        </li>
                        <li className="text-gray-500 mx-2 hidden custom-520:inline">|</li>
                        <li className="flex items-center">
                            <Link href="/pricing" className="text-gray-300 hover:text-white transition duration-300">
                                Pricing
                            </Link>
                        </li>
                        <li className="text-gray-500 mx-2 hidden custom-520:inline">|</li>
                        <li className="flex items-center">
                            <Link href="/signin" className="text-gray-300 hover:text-white transition duration-300">
                                Sign-In
                            </Link>
                        </li>
                    </ul>
                </nav>
                <p className="text-gray-500">&copy; 2024 Art Ecommerce, LLC.</p>
            </div>
        </footer>
    );
};

export default Footer;
