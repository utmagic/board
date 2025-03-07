# 글로벌 소통 공간 게시판

Next.js 15와 SQLite를 활용한 모던 게시판 애플리케이션입니다.

## 프로젝트 소개

이 프로젝트는 Next.js 15의 App Router를 사용하여 개발된 게시판 웹 애플리케이션입니다. 사용자들이 자유롭게 의견을 나누고 정보를 공유할 수 있는 공간을 제공합니다. SQLite 데이터베이스를 활용하여 데이터를 영구적으로 저장하고, 모던한 UI/UX를 제공합니다.

## 주요 기능

- 게시글 목록 보기
- 게시글 상세 보기
- 새 게시글 작성
- 게시글 수정 및 삭제
- 실시간 데이터 갱신 (캐시 무효화)

## 기술 스택

- **프론트엔드**:
  - Next.js 15.2.1 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS 4

- **백엔드**:
  - Next.js API Routes
  - SQLite (better-sqlite3)
  - UUID 라이브러리

## 애플리케이션 아키텍처

### 디렉토리 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API 엔드포인트
│   │   └── posts/          # 게시글 관련 API
│   │       ├── route.ts    # GET(목록), POST(생성)
│   │       └── [id]/       # 개별 게시글 API
│   │           └── route.ts # GET(조회), PUT(수정), DELETE(삭제)
│   ├── posts/              # 게시글 관련 페이지
│   │   ├── page.tsx        # 게시글 목록 페이지
│   │   ├── new/            # 새 게시글 작성 페이지
│   │   │   └── page.tsx
│   │   └── [id]/           # 게시글 상세 페이지
│   │       ├── page.tsx    # 게시글 조회
│   │       └── edit/       # 게시글 수정
│   │           └── page.tsx
│   ├── page.tsx            # 홈페이지
│   ├── layout.tsx          # 루트 레이아웃
│   └── globals.css         # 전역 스타일
├── components/             # 재사용 가능한 컴포넌트
│   └── DeletePostButton.tsx # 게시글 삭제 버튼 컴포넌트
├── lib/                    # 유틸리티 및 데이터 액세스 레이어
│   ├── db.ts               # 데이터베이스 연결 및 초기화
│   └── posts.ts            # 게시글 CRUD 함수
└── types/                  # 타입 정의
    └── post.ts             # 게시글 관련 타입 정의
```

### 데이터 흐름

1. **클라이언트 컴포넌트**:
   - 사용자 인터페이스 렌더링
   - 사용자 입력 처리
   - API 요청 전송 (fetch)
   - 상태 관리 (useState, useEffect)

2. **API 라우트**:
   - 클라이언트 요청 처리
   - 데이터 유효성 검사
   - 데이터 액세스 레이어 호출
   - 응답 반환 및 캐시 제어

3. **데이터 액세스 레이어**:
   - SQLite 데이터베이스 연결 관리
   - CRUD 작업 수행
   - 에러 처리 및 로깅

### 주요 기술적 특징

1. **클라이언트/서버 컴포넌트 분리**:
   - 서버 컴포넌트: 초기 데이터 로딩
   - 클라이언트 컴포넌트: 사용자 상호작용 및 상태 관리

2. **캐시 무효화 전략**:
   - 타임스탬프 쿼리 파라미터 활용
   - 캐시 제어 헤더 설정

3. **데이터 영속성**:
   - SQLite 데이터베이스 활용
   - 트랜잭션 처리

4. **반응형 디자인**:
   - Tailwind CSS를 활용한 모바일 친화적 UI
   - 주황색 계열의 일관된 디자인 시스템

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

3. 개발 서버 실행:
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 배포

이 Next.js 앱을 배포하는 가장 쉬운 방법은 [Vercel Platform](https://vercel.com/new)을 사용하는 것입니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참조하세요.

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 