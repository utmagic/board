import { Post } from '@/types/post';
import db from './db';

// 디버깅을 위한 게시글 목록 로깅
export function logPosts() {
  try {
    const posts = getAllPosts();
    console.log('현재 게시글 목록:', JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('게시글 목록 로깅 오류:', error);
  }
}

// 모든 게시글 가져오기
export function getAllPosts(): Post[] {
  console.log('getAllPosts 호출됨');
  
  try {
    const posts = db.prepare('SELECT * FROM posts ORDER BY createdAt DESC').all() as Post[];
    return posts;
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    return [];
  }
}

// 특정 게시글 가져오기
export function getPostById(id: string): Post | undefined {
  console.log(`getPostById 호출됨: id=${id}`);
  
  try {
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | undefined;
    
    if (post) {
      console.log(`찾은 게시글: id=${post.id}, title=${post.title}`);
      return post;
    }
    
    return undefined;
  } catch (error) {
    console.error(`게시글 조회 오류: id=${id}`, error);
    return undefined;
  }
}

// 새 게시글 생성
export function createPost(input: { title: string; content: string; author: string }): Post {
  console.log(`createPost 호출됨: title=${input.title}, author=${input.author}`);
  
  try {
    // 새 ID 생성 (현재 최대 ID + 1)
    const maxIdResult = db.prepare('SELECT MAX(CAST(id AS INTEGER)) as maxId FROM posts').get() as { maxId: number };
    const newId = String(maxIdResult.maxId + 1 || 1);
    
    const now = new Date().toISOString();
    
    const newPost: Post = {
      id: newId,
      title: input.title,
      content: input.content,
      author: input.author,
      createdAt: now,
      updatedAt: now
    };
    
    db.prepare(`
      INSERT INTO posts (id, title, content, author, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      newPost.id,
      newPost.title,
      newPost.content,
      newPost.author,
      newPost.createdAt,
      newPost.updatedAt
    );
    
    console.log(`게시글 생성됨: id=${newPost.id}, title=${newPost.title}`);
    
    return newPost;
  } catch (error) {
    console.error('게시글 생성 오류:', error);
    throw new Error('게시글을 생성하는 중 오류가 발생했습니다.');
  }
}

// 게시글 수정
export function updatePost(id: string, input: { title?: string; content?: string; author?: string }): Post | undefined {
  console.log(`updatePost 호출됨: id=${id}`);
  
  try {
    // 기존 게시글 조회
    const post = getPostById(id);
    
    if (!post) {
      console.log(`게시글을 찾을 수 없음: id=${id}`);
      return undefined;
    }
    
    // 업데이트할 필드 설정
    const updatedPost = {
      ...post,
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.author !== undefined && { author: input.author }),
      updatedAt: new Date().toISOString()
    };
    
    // 데이터베이스 업데이트
    db.prepare(`
      UPDATE posts
      SET title = ?, content = ?, author = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      updatedPost.title,
      updatedPost.content,
      updatedPost.author,
      updatedPost.updatedAt,
      id
    );
    
    console.log(`게시글 업데이트됨: id=${updatedPost.id}, title=${updatedPost.title}`);
    
    return updatedPost;
  } catch (error) {
    console.error(`게시글 수정 오류: id=${id}`, error);
    return undefined;
  }
}

// 게시글 삭제
export function deletePost(id: string): boolean {
  console.log(`deletePost 호출됨: id=${id}`);
  
  try {
    // 게시글 존재 여부 확인
    const post = getPostById(id);
    
    if (!post) {
      console.log(`게시글을 찾을 수 없음: id=${id}`);
      return false;
    }
    
    // 데이터베이스에서 삭제
    const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
    
    if (result.changes > 0) {
      console.log(`게시글 삭제됨: id=${id}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`게시글 삭제 오류: id=${id}`, error);
    return false;
  }
}
