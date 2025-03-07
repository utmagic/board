'use client';

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import UserMenu from "@/components/UserMenu";

export default function Navigation() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="bg-orange-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/global-logo.svg" 
              alt="Global Logo" 
              width={36} 
              height={36} 
              className="text-white"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight">GLOBAL Community</span>
              <span className="text-sm leading-tight">(주)한화 글로벌</span>
            </div>
          </Link>
          <div className="flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link
                        href="/"
                        className="hover:text-orange-200 transition-colors relative group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="sr-only">홈</span>
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-orange-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                          홈으로 이동
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/posts"
                        className="hover:text-orange-200 transition-colors relative group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="sr-only">게시글 목록</span>
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-orange-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                          게시글 목록 보기
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/posts/new"
                        className="hover:text-orange-200 transition-colors relative group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="sr-only">글쓰기</span>
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-orange-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                          새 글 작성하기
                        </span>
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/"
                        className="hover:text-orange-200 transition-colors relative group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="sr-only">홈</span>
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-orange-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                          홈으로 이동
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/login"
                        className="hover:text-orange-200 transition-colors relative group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span className="sr-only">로그인</span>
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-orange-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                          로그인하기
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/register"
                        className="hover:text-orange-200 transition-colors relative group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span className="sr-only">회원가입</span>
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-orange-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                          회원가입하기
                        </span>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
} 