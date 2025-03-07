import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 데이터베이스 디렉토리 및 파일 경로 설정
const dbDir = path.join(process.cwd(), 'data');
const DB_PATH = path.join(dbDir, 'posts.db');

// 데이터베이스 디렉토리 생성
try {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('데이터베이스 디렉토리 생성 완료');
  }
} catch (error) {
  console.error('데이터베이스 디렉토리 생성 오류:', error);
}

// 데이터베이스 연결
let db: Database.Database;

try {
  db = new Database(DB_PATH);
  
  // 외래 키 제약 조건 활성화
  db.pragma('foreign_keys = ON');
  
  // 테이블 생성
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
  
  // 초기 데이터 삽입 (데이터베이스가 비어있을 때만)
  const count = db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number };
  
  if (count.count === 0) {
    const initialPosts = [
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
    
    const insertStmt = db.prepare(`
      INSERT INTO posts (id, title, content, author, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const insertMany = db.transaction((posts) => {
      for (const post of posts) {
        insertStmt.run(
          post.id,
          post.title,
          post.content,
          post.author,
          post.createdAt,
          post.updatedAt
        );
      }
    });
    
    insertMany(initialPosts);
    console.log('데이터베이스 초기화 완료');
  }
} catch (error) {
  console.error('데이터베이스 설정 오류:', error);
  throw new Error('데이터베이스 설정 중 오류가 발생했습니다.');
}

// 애플리케이션 종료 시 데이터베이스 연결 닫기
process.on('exit', () => {
  if (db) {
    console.log('데이터베이스 연결 종료');
    db.close();
  }
});

export default db; 