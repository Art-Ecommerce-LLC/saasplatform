"use client";

import { useRouter } from 'next/navigation';

export default function EmailVerifiedPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/sign-in'); // Adjust this path if your sign-in route is different
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Email Verified Successfully</h1>
      <p className="text-lg text-gray-600 mb-6">Your email has been verified. You can now sign in to your account.</p>

      <button
        onClick={handleSignIn}
        className="px-6 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition"
      >
        Go to Sign In
      </button>
    </div>
  );
}
