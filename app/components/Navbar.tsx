"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import UserDashboard from './UserDashboard';

const Navbar: React.FC<{ session: any }> = ({ session }) => {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="flex items-center justify-between bg-white p-4 shadow relative z-20">
            <div className="flex items-center z-30">
                <Link href="/">
                    <span className="text-2xl font-bold text-gray-800">SaaS</span>
                </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden custom-md:flex items-center space-x-4 custom-md:space-x-8 mr-8">
                <Link
                    href="/"
                    className="text-gray-800 hover:bg-[var(--nav-bg-color)] hover:text-[var(--hover-text-color)] transition-colors duration-300 ease-in-out px-4 py-2 rounded-md"
                >
                    Home
                </Link>
                <Link
                    href="/about"
                    className="text-gray-800 hover:bg-[var(--nav-bg-color)] hover:text-[var(--hover-text-color)] transition-colors duration-300 ease-in-out px-4 py-2 rounded-md"
                >
                    About
                </Link>
                <Link
                    href="/pricing"
                    className="text-gray-800 hover:bg-[var(--nav-bg-color)] hover:text-[var(--hover-text-color)] transition-colors duration-300 ease-in-out px-4 py-2 rounded-md"
                >
                    Pricing
                </Link>
                {session?.user ? (
                        <UserDashboard />
                    ) : (
                        <Link className={buttonVariants()} href='/sign-in'>
                            Sign in
                        </Link>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="custom-md:hidden flex items-center z-30">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-gray-800 focus:outline-none"
                >
                    <div className="relative w-8 h-6 flex items-center justify-center">
                        <div
                            className={`absolute h-0.5 w-6 bg-gray-800 transform transition-transform duration-300 ease-in-out ${
                                isMobileMenuOpen ? 'rotate-45' : '-translate-y-2'
                            }`}
                        />
                        <div
                            className={`absolute h-0.5 w-6 bg-gray-800 transform transition-opacity duration-300 ease-in-out ${
                                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                            }`}
                        />
                        <div
                            className={`absolute h-0.5 w-6 bg-gray-800 transform transition-transform duration-300 ease-in-out ${
                                isMobileMenuOpen ? '-rotate-45' : 'translate-y-2'
                            }`}
                        />
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 top-[70px] w-full h-[calc(100%-70px)] bg-[var(--navbar-color)] z-999 flex flex-col justify-center items-center overflow-hidden custom-md:hidden">
                    <Link
                        href="/"
                        className="w-full text-center text-[var(--navbar-text-color)] text-xl py-4 border-b border-black last:border-none hover:bg-[var(--navbar-hover-background-color)] hover:text-white transition-colors duration-300 ease-in-out"
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className="w-full text-center text-[var(--navbar-text-color)] text-xl py-4 border-b border-black last:border-none hover:bg-[var(--navbar-hover-background-color)] hover:text-white transition-colors duration-300 ease-in-out"
                    >
                        About
                    </Link>
                    <Link
                        href="/pricing"
                        className="w-full text-center text-[var(--navbar-text-color)] text-xl py-4 border-b border-black last:border-none hover:bg-[var(--navbar-hover-background-color)] hover:text-white transition-colors duration-300 ease-in-out"
                    >
                        Pricing
                    </Link>
                    {session?.user ? (
                    <div className="align-center pt-4"
                    >
                        <UserDashboard />
                    </div>
                    ) : (
                    <div className="align-center">
                        <Link className={buttonVariants()} href='/sign-in'>
                            Sign in
                        </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
