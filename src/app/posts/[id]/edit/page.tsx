'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Post } from '@/types/post';

// 클라이언트 컴포넌트에서는 params를 직접 받지 않고 id를 prop으로 받습니다
interface EditPostPageProps {
  params: {
    id: string;
  };
  searchParams: {
    t?: string;
  };
}

export default function EditPostPage(props: EditPostPageProps) {
  // props로 받은 params와 searchParams를 직접 사용하지 않고 상태로 관리
  const router = useRouter();
  const [post, setPost] = useState({ id: '', title: '', content: '', author: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postId, setPostId] = useState('');
  const [timestamp, setTimestamp] = useState(Date.now().toString());
  
  // 컴포넌트 마운트 시 한 번만 ID와 타임스탬프를 설정합니다
  useEffect(() => {
    console.log('[EditPage] 초기화 - props:', props);
    
    // 비동기적으로 params 처리
    const initializeFromProps = async () => {
      try {
        // props.params를 Promise로 처리
        const paramsObj = await Promise.resolve(props.params);
        if (paramsObj && typeof paramsObj === 'object') {
          const id = paramsObj.id;
          if (id) {
            console.log('[EditPage] ID 설정:', id);
            setPostId(id);
          }
        }
      } catch (err) {
        console.error('[EditPage] params 처리 오류:', err);
      }
    };
    
    initializeFromProps();
    
    // 새로운 타임스탬프 생성
    setTimestamp(Date.now().toString());
  }, []);
  
  useEffect(() => {
    // postId가 설정된 후에만 데이터를 가져옴
    if (!postId) return;
    
    const fetchPost = async () => {
      try {
        console.log(`[EditPage] 게시글 수정 페이지 데이터 요청: id=${postId}, timestamp=${timestamp}`);
        
        // API를 통해 게시글 데이터 가져오기
        const response = await fetch(`/api/posts/${postId}?t=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('게시글을 찾을 수 없습니다.');
          }
          throw new Error('게시글을 불러오는 중 오류가 발생했습니다.');
        }
        
        const data = await response.json();
        console.log(`[EditPage] 게시글 데이터 수신: id=${postId}, title=${data.title}, updatedAt=${data.updatedAt}`);
        setPost(data);
      } catch (err) {
        console.error('[EditPage] 게시글 불러오기 오류:', err);
        setError(err instanceof Error ? err.message : '게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [postId, timestamp]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 현재 시간을 쿼리 파라미터로 추가하여 캐시를 무효화
      const updateTimestamp = Date.now();
      console.log(`[EditPage] 게시글 업데이트 요청: id=${postId}, title=${post.title}, timestamp=${updateTimestamp}`);
      
      const response = await fetch(`/api/posts/${postId}?t=${updateTimestamp}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify(post)
      });
      
      if (!response.ok) {
        throw new Error('게시글을 업데이트하는 중 오류가 발생했습니다.');
      }
      
      console.log(`[EditPage] 게시글 업데이트 성공: id=${postId}`);
      
      // 업데이트 후 상세 페이지로 이동 (타임스탬프 포함)
      router.push(`/posts/${postId}?t=${updateTimestamp}`);
    } catch (err) {
      console.error('[EditPage] 게시글 업데이트 오류:', err);
      setError(err instanceof Error ? err.message : '게시글을 업데이트하는 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link 
          href={`/posts/${postId}?t=${timestamp}`}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md inline-block mt-4 transition-colors"
        >
          게시글로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/posts/${postId}?t=${timestamp}`} className="text-orange-600 hover:text-orange-800 hover:underline flex items-center transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          게시글로 돌아가기
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={post.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                작성자
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={post.author}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                내용
              </label>
              <textarea
                id="content"
                name="content"
                value={post.content}
                onChange={handleChange}
                required
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 transition-colors"
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 