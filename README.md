# 글로벌 소통 공간 게시판

Next.js 15와 SQLite를 활용한 모던 게시판 애플리케이션입니다.

## 프로젝트 소개

이 프로젝트는 Next.js 15의 App Router를 사용하여 개발된 게시판 웹 애플리케이션입니다. 사용자들이 자유롭게 의견을 나누고 정보를 공유할 수 있는 공간을 제공합니다. SQLite 데이터베이스를 활용하여 데이터를 영구적으로 저장하고, 모던한 UI/UX를 제공합니다.

## 주요 기능

### 게시판 기능
- 게시글 목록 보기
- 게시글 상세 보기
- 새 게시글 작성
- 게시글 수정 및 삭제
- 실시간 데이터 갱신 (캐시 무효화)

### 인증 기능
- 소셜 로그인 (Google, GitHub)
- 이메일/비밀번호 로그인
- 회원가입
- 사용자 프로필 관리

## 기술 스택

### 프레임워크 및 라이브러리
- **프론트엔드**:
  - Next.js 15.2.1 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS 4
  - NextAuth.js (인증)

- **백엔드**:
  - Next.js API Routes
  - SQLite (better-sqlite3)
  - UUID 라이브러리
  - bcryptjs (비밀번호 암호화)
  - jsonwebtoken (JWT 인증)

## 애플리케이션 아키텍처

### 디렉토리 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API 엔드포인트
│   │   ├── auth/          # 인증 관련 API
│   │   │   ├── [...nextauth]/  # NextAuth.js 설정
│   │   │   └── register/  # 회원가입 API
│   │   └── posts/         # 게시글 관련 API
│   │       ├── route.ts   # GET(목록), POST(생성)
│   │       └── [id]/      # 개별 게시글 API
│   │           └── route.ts
│   ├── login/             # 로그인 페이지
│   ├── register/          # 회원가입 페이지
│   ├── posts/             # 게시글 관련 페이지
│   ├── page.tsx           # 홈페이지
│   ├── layout.tsx         # 루트 레이아웃
│   └── globals.css        # 전역 스타일
├── components/            # 재사용 가능한 컴포넌트
│   ├── AuthProvider.tsx   # 인증 프로바이더
│   ├── UserMenu.tsx      # 사용자 메뉴
│   └── DeletePostButton.tsx
├── lib/                   # 유틸리티 및 데이터 액세스 레이어
│   ├── db.ts             # 데이터베이스 연결 및 초기화
│   ├── posts.ts          # 게시글 CRUD 함수
│   └── users.ts          # 사용자 관리 함수
└── types/                # 타입 정의
    ├── post.ts           # 게시글 관련 타입
    ├── user.ts          # 사용자 관련 타입
    └── next-auth.d.ts   # NextAuth 타입 확장
```

### 아키텍처 패턴

1. **클라이언트-서버 아키텍처**:
   - Next.js App Router를 활용한 서버/클라이언트 컴포넌트 분리
   - RESTful API 엔드포인트

2. **계층형 아키텍처**:
   - 프레젠테이션 레이어 (React 컴포넌트)
   - 비즈니스 로직 레이어 (/lib)
   - 데이터 액세스 레이어 (SQLite)

3. **인증 아키텍처**:
   - NextAuth.js 기반 JWT 인증
   - 다중 인증 제공자 지원
   - 세션 관리

### 데이터 흐름

1. **클라이언트 측**:
   - 사용자 인터페이스 렌더링
   - 사용자 입력 처리
   - API 요청 전송
   - 상태 관리

2. **서버 측**:
   - API 라우트 요청 처리
   - 인증/인가 검증
   - 데이터베이스 작업
   - 응답 반환

### 보안 기능

1. **인증**:
   - JWT 기반 토큰 인증
   - 소셜 로그인 (Google, GitHub)
   - 비밀번호 암호화 (bcryptjs)

2. **보안 설정**:
   - CSRF 보호
   - 환경 변수를 통한 민감 정보 관리
   - 입력값 검증

## 시작하기

### 필수 조건

- Node.js 18.17 이상
- npm 또는 yarn

### 설치 및 실행

1. 저장소 클론:
   ```bash
   git clone <repository-url>
   cd board
   ```

2. 의존성 설치:
   ```bash
   npm install
   # 또는
   yarn install
   ```

3. 환경 변수 설정:
   `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:
   ```
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth
   GOOGLE_ID=your_google_client_id
   GOOGLE_SECRET=your_google_client_secret
   
   # GitHub OAuth
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   ```

4. 개발 서버 실행:
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

5. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 배포

이 Next.js 앱을 배포하는 가장 쉬운 방법은 [Vercel Platform](https://vercel.com/new)을 사용하는 것입니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참조하세요.

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 