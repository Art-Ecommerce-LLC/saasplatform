'use client';

import Link from 'next/link';

const UserAccountFooter = () => {
  return (
    <li className="flex items-center">
        <Link href="/admin" className="text-gray-300 hover:text-white transition duration-300">Dashboard</Link>
    </li>
  );
}; 

export default UserAccountFooter;