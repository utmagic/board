import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/posts';
import { CreatePostInput } from '@/types/post';

// 캐시 무효화 헤더 설정 함수
function getCacheHeaders() {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  return headers;
}

// GET /api/posts - 모든 게시글 가져오기
export async function GET(request: NextRequest) {
  try {
    console.log('[API] GET /api/posts 요청 받음');
    
    const posts = getAllPosts();
    console.log(`[API] 게시글 목록 조회 성공: ${posts.length}개의 게시글`);
    
    return NextResponse.json(posts, { headers: getCacheHeaders() });
  } catch (error) {
    console.error('[API] 게시글 목록 조회 오류:', error);
    return NextResponse.json(
      { message: '게시글 목록을 조회하는 중 오류가 발생했습니다.' },
      { status: 500, headers: getCacheHeaders() }
    );
  }
}

// POST /api/posts - 새 게시글 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[API] POST /api/posts 요청 받음', body);
    
    // 필수 필드 검증
    if (!body.title || !body.content || !body.author) {
      console.log('[API] 필수 필드 누락');
      return NextResponse.json(
        { message: '제목, 내용, 작성자는 필수 항목입니다.' },
        { status: 400, headers: getCacheHeaders() }
      );
    }
    
    const postInput: CreatePostInput = {
      title: body.title,
      content: body.content,
      author: body.author,
    };
    
    const newPost = createPost(postInput);
    console.log(`[API] 게시글 생성 성공: id=${newPost.id}`);
    
    return NextResponse.json(newPost, { 
      status: 201,
      headers: getCacheHeaders()
    });
  } catch (error) {
    console.error('[API] 게시글 생성 오류:', error);
    return NextResponse.json(
      { message: '게시글을 생성하는 중 오류가 발생했습니다.' },
      { status: 500, headers: getCacheHeaders() }
    );
  }
} 