import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GLOBAL Communication",
  description: "Next.js로 만든 간단한 게시판 웹사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-orange-500 text-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex justify-between items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image 
                  src="/global-logo.svg" 
                  alt="Global Logo" 
                  width={36} 
                  height={36} 
                  className="text-white"
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold leading-tight">GLOBAL</span>
                  <span className="text-sm leading-tight">한화그룹의 뿌리</span>
                </div>
              </Link>
              <div className="space-x-6">
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
              </div>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-orange-50 border-t border-orange-100 mt-8">
          <div className="container mx-auto px-4 py-6 text-center text-orange-700">
            <p>© 2024 GLOBAL Communication. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
