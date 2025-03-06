import Link from 'next/link';
import { use } from 'react';
import DeletePostButton from '@/components/DeletePostButton';
import { getPostById } from '@/lib/posts';
import { Post } from '@/types/post';

interface PostPageProps {
  params: {
    id: string;
  };
  searchParams: {
    t?: string;
  };
}

export default function PostPage(props: PostPageProps) {
  // React.use()를 사용하여 params와 searchParams 처리
  const params = use(Promise.resolve(props.params));
  const searchParams = use(Promise.resolve(props.searchParams));
  const postId = params.id;
  
  // 타임스탬프 파라미터 처리
  const timestamp = searchParams.t || Date.now().toString();
  console.log(`[ServerPage] 게시글 상세 페이지 데이터 요청: id=${postId}, timestamp=${timestamp}`);
  
  // 서버 컴포넌트에서 직접 데이터 가져오기
  const post = getPostById(postId);
  
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          게시글을 찾을 수 없습니다.
        </div>
        <Link 
          href={`/posts?t=${timestamp}`}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md inline-block mt-4 transition-colors"
        >
          게시글 목록으로 돌아가기
        </Link>
      </div>
    );
  }
  
  // 줄바꿈을 처리하기 위한 함수
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">{paragraph}</p>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={`/posts?t=${timestamp}`} className="text-orange-600 hover:text-orange-800 hover:underline flex items-center transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          목록으로 돌아가기
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-orange-700">{post.title}</h1>
          
          <div className="flex justify-between items-center text-sm text-gray-600 mb-8 pb-4 border-b border-orange-100">
            <div>
              <span className="font-medium">작성자: {post.author}</span>
            </div>
            <div>
              <span>작성일: {new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
              {post.updatedAt !== post.createdAt && (
                <span className="ml-2">
                  (수정일: {new Date(post.updatedAt).toLocaleDateString('ko-KR')})
                </span>
              )}
            </div>
          </div>
          
          <div className="min-h-[300px] bg-orange-50 p-6 rounded-lg mb-4">
            <div className="text-lg leading-relaxed">
              {formatContent(post.content)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Link 
          href={`/posts/${post.id}/edit?t=${timestamp}`} 
          className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-md transition-colors"
        >
          수정하기
        </Link>
        <DeletePostButton postId={post.id} />
      </div>
    </div>
  );
} 