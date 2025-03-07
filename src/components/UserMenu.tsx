'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (!session) {
    return null; // 로그인되지 않은 경우 아무것도 표시하지 않음
  }

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 focus:outline-none group"
      >
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full overflow-hidden bg-orange-200 border-2 border-white">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || '사용자'}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-orange-800 font-bold">
                {session.user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <span className="text-white text-sm font-medium">{session.user.name}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-white transition-transform ${
            isMenuOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span className="absolute -bottom-8 right-0 bg-white text-orange-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
          계정 관리
        </span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
            <div className="font-medium">{session.user.name}</div>
            <div className="text-gray-500 truncate">{session.user.email}</div>
          </div>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
            onClick={() => setIsMenuOpen(false)}
          >
            프로필
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
} 