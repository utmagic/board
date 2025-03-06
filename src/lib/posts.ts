import { Post } from '@/types/post';
import fs from 'fs';
import path from 'path';

// 데이터 파일 경로
const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');

// 초기 데이터
const initialPosts: Post[] = [
  {
    id: '1',
    title: '첫 번째 게시글입니다',
    content: '게시판의 첫 번째 게시글 내용입니다. 환영합니다!',
    author: '관리자',
    createdAt: '2024-02-29T15:00:00.000Z',
    updatedAt: '2024-02-29T15:00:00.000Z'
  },
  {
    id: '2',
    title: '게시판 이용 방법',
    content: '이 게시판은 Next.js로 만들어진 간단한 커뮤니티 게시판입니다. 자유롭게 글을 작성하고 의견을 나눠보세요.',
    author: '관리자',
    createdAt: '2024-03-01T15:00:00.000Z',
    updatedAt: '2024-03-01T15:00:00.000Z'
  },
  {
    id: '3',
    title: '오늘의 날씨',
    content: '오늘은 화창한 날씨입니다. 모두 좋은 하루 되세요!',
    author: '날씨맨',
    createdAt: '2024-03-02T15:00:00.000Z',
    updatedAt: '2024-03-02T15:00:00.000Z'
  }
];

// 데이터 디렉토리 생성
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// 데이터 파일 초기화
function initDataFile() {
  ensureDataDirectory();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialPosts, null, 2));
    console.log('데이터 파일 초기화 완료');
  }
}

// 데이터 파일에서 게시글 읽기
function readPostsFromFile(): Post[] {
  try {
    initDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('데이터 파일 읽기 오류:', error);
    return initialPosts;
  }
}

// 데이터 파일에 게시글 쓰기
function writePostsToFile(posts: Post[]) {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
    console.log('데이터 파일 쓰기 완료');
  } catch (error) {
    console.error('데이터 파일 쓰기 오류:', error);
  }
}

// 디버깅을 위한 게시글 목록 로깅
export function logPosts() {
  const posts = readPostsFromFile();
  console.log('현재 게시글 목록:', JSON.stringify(posts, null, 2));
}

// 모든 게시글 가져오기
export function getAllPosts(): Post[] {
  console.log('getAllPosts 호출됨');
  
  const posts = readPostsFromFile();
  
  // 최신 글이 위로 오도록 정렬
  return posts.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

// 특정 게시글 가져오기
export function getPostById(id: string): Post | undefined {
  console.log('getPostById 호출됨: id=' + id);
  
  const posts = readPostsFromFile();
  const post = posts.find(post => post.id === id);
  
  if (post) {
    console.log('찾은 게시글:', post);
    return { ...post };
  }
  
  return undefined;
}

// 새 게시글 생성
export function createPost(input: { title: string; content: string; author: string }): Post {
  console.log('createPost 호출됨: input=', input);
  
  const posts = readPostsFromFile();
  
  const newPost: Post = {
    id: String(posts.length + 1),
    title: input.title,
    content: input.content,
    author: input.author,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  posts.push(newPost);
  writePostsToFile(posts);
  
  console.log('게시글 생성됨:', newPost);
  logPosts();
  
  return { ...newPost };
}

// 게시글 수정
export function updatePost(id: string, input: { title?: string; content?: string; author?: string }): Post | undefined {
  console.log('updatePost 호출됨: id=' + id + ', input=', input);
  
  const posts = readPostsFromFile();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    console.log('게시글을 찾을 수 없음: id=' + id);
    return undefined;
  }
  
  console.log('게시글 인덱스: ' + index);
  console.log('기존 게시글:', posts[index]);
  
  // 기존 게시글 복사 후 업데이트
  const updatedPost = {
    ...posts[index],
    ...(input.title !== undefined && { title: input.title }),
    ...(input.content !== undefined && { content: input.content }),
    ...(input.author !== undefined && { author: input.author }),
    updatedAt: new Date().toISOString()
  };
  
  // 배열 업데이트
  posts[index] = updatedPost;
  writePostsToFile(posts);
  
  console.log('게시글 업데이트됨:', updatedPost);
  logPosts();
  
  return { ...updatedPost };
}

// 게시글 삭제
export function deletePost(id: string): boolean {
  console.log('deletePost 호출됨: id=' + id);
  
  const posts = readPostsFromFile();
  const initialLength = posts.length;
  const filteredPosts = posts.filter(post => post.id !== id);
  
  if (filteredPosts.length < initialLength) {
    writePostsToFile(filteredPosts);
    console.log('게시글 삭제됨: id=' + id);
    logPosts();
    return true;
  }
  
  console.log('게시글을 찾을 수 없음: id=' + id);
  return false;
} 