import { NextRequest, NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost, logPosts } from '@/lib/posts';
import { UpdatePostInput } from '@/types/post';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/posts/[id] - 특정 게시글 가져오기
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // params를 비동기적으로 처리
    const resolvedParams = await Promise.resolve(context.params);
    const id = resolvedParams.id;
    
    console.log(`[API] GET /api/posts/${id} 요청 받음`);
    
    // 캐시 무효화를 위한 헤더 설정
    const headers = new Headers();
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    
    const post = getPostById(id);
    
    if (!post) {
      console.log(`[API] 게시글을 찾을 수 없음: id=${id}`);
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404, headers }
      );
    }
    
    console.log(`[API] 게시글 조회 성공: id=${id}`);
    return NextResponse.json(post, { headers });
  } catch (error) {
    console.error('[API] 게시글 조회 오류:', error);
    return NextResponse.json(
      { message: '게시글을 조회하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - 게시글 수정
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // params를 비동기적으로 처리
    const resolvedParams = await Promise.resolve(context.params);
    const id = resolvedParams.id;
    
    const body = await request.json();
    console.log(`[API] PUT /api/posts/${id} 요청 받음`, body);
    
    // 캐시 무효화를 위한 헤더 설정
    const headers = new Headers();
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    
    console.log(`[API] 게시글 수정 시도: id=${id}, input=`, body);
    
    const updatedPost = updatePost(id, body);
    
    if (!updatedPost) {
      console.log(`[API] 게시글을 찾을 수 없음: id=${id}`);
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404, headers }
      );
    }
    
    console.log(`[API] 게시글 수정 성공: id=${id}`);
    logPosts(); // 전체 게시글 목록 로깅
    
    return NextResponse.json(updatedPost, { headers });
  } catch (error) {
    console.error('[API] 게시글 수정 오류:', error);
    return NextResponse.json(
      { message: '게시글을 수정하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - 게시글 삭제
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // params를 비동기적으로 처리
    const resolvedParams = await Promise.resolve(context.params);
    const id = resolvedParams.id;
    
    console.log(`[API] DELETE /api/posts/${id} 요청 받음`);
    
    // 캐시 무효화를 위한 헤더 설정
    const headers = new Headers();
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
    
    const success = deletePost(id);
    
    if (!success) {
      console.log(`[API] 게시글을 찾을 수 없음: id=${id}`);
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404, headers }
      );
    }
    
    console.log(`[API] 게시글 삭제 성공: id=${id}`);
    return NextResponse.json({ message: '게시글이 삭제되었습니다.' }, { headers });
  } catch (error) {
    console.error('[API] 게시글 삭제 오류:', error);
    return NextResponse.json(
      { message: '게시글을 삭제하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 