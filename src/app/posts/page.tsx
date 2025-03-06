import Link from 'next/link';
import { use } from 'react';
import { getAllPosts } from '@/lib/posts';
import { Post } from '@/types/post';

interface PostsPageProps {
  searchParams: {
    t?: string;
  };
}

export default function PostsPage(props: PostsPageProps) {
  // React.use()를 사용하여 searchParams 처리
  const searchParams = use(Promise.resolve(props.searchParams));
  
  // 타임스탬프 파라미터 처리
  const timestamp = searchParams.t || Date.now().toString();
  console.log(`[ServerPage] 게시글 목록 페이지 데이터 요청: timestamp=${timestamp}`);
  
  // 서버 컴포넌트에서 직접 데이터 가져오기
  const posts = getAllPosts();
  console.log(`[ServerPage] 게시글 목록 데이터 수신: ${posts.length}개의 게시글`);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">게시글 목록</h1>
        <Link 
          href={`/posts/new?t=${timestamp}`}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          새 게시글 작성
        </Link>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-8 bg-orange-50 rounded-lg">
          <p className="text-orange-700">게시글이 없습니다. 첫 번째 게시글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-orange-100">
            <thead className="bg-orange-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                  제목
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                  작성자
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">
                  작성일
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-orange-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-orange-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/posts/${post.id}?t=${timestamp}`}
                      className="text-orange-600 hover:text-orange-800 hover:underline font-medium"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 