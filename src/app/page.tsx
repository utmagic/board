'use client';

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl w-full text-center my-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-orange-700">
          🗣️ 행복한 소통의 공간, 글로벌 소통 공간에 오신 것을 환영합니다! 💬
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          자유롭게 의견을 나누고 정보를 공유하는 공간입니다.
        </p>
        
        <div className="flex justify-center gap-4 mt-8">
          <Link 
            href="/posts" 
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            게시글 보기
          </Link>
          <Link 
            href="/posts/new" 
            className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            새 글 작성하기
          </Link>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-orange-700">게시판 이용 안내</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>모든 사용자는 자유롭게 글을 작성할 수 있습니다.</li>
          <li>타인을 존중하고 예의를 지켜주세요.</li>
          <li>유용한 정보와 경험을 공유해 주세요.</li>
          <li>부적절한 콘텐츠는 관리자에 의해 삭제될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
