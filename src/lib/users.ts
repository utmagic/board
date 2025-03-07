import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, RegisterUserInput, LoginUserInput } from '@/types/user';
import db from './db';

// JWT 시크릿 키 (실제 프로덕션에서는 환경 변수로 관리해야 합니다)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 모든 사용자 가져오기
export function getAllUsers(): User[] {
  try {
    const users = db.prepare('SELECT id, name, email, image, provider, createdAt, updatedAt FROM users').all() as User[];
    return users;
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    return [];
  }
}

// 특정 사용자 가져오기
export function getUserById(id: string): User | undefined {
  try {
    const user = db.prepare('SELECT id, name, email, image, provider, createdAt, updatedAt FROM users WHERE id = ?').get(id) as User | undefined;
    return user;
  } catch (error) {
    console.error(`사용자 조회 오류: id=${id}`, error);
    return undefined;
  }
}

// 이메일로 사용자 가져오기
export function getUserByEmail(email: string): User | undefined {
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
    return user;
  } catch (error) {
    console.error(`사용자 조회 오류: email=${email}`, error);
    return undefined;
  }
}

// 새 사용자 등록 (이메일/비밀번호)
export async function registerUser(input: RegisterUserInput): Promise<User | null> {
  try {
    // 이메일 중복 확인
    const existingUser = getUserByEmail(input.email);
    if (existingUser) {
      console.error(`이미 등록된 이메일입니다: ${input.email}`);
      return null;
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(input.password, 10);
    
    const newUser: User = {
      id: uuidv4(),
      name: input.name,
      email: input.email,
      password: hashedPassword,
      provider: 'email',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.prepare(`
      INSERT INTO users (id, name, email, password, provider, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      newUser.id,
      newUser.name,
      newUser.email,
      newUser.password,
      newUser.provider,
      newUser.createdAt,
      newUser.updatedAt
    );
    
    // 비밀번호 필드 제외하고 반환
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('사용자 등록 오류:', error);
    return null;
  }
}

// 사용자 로그인 (이메일/비밀번호)
export async function loginUser(input: LoginUserInput): Promise<{ user: User; token: string } | null> {
  try {
    // 사용자 조회
    const user = getUserByEmail(input.email);
    if (!user || !user.password) {
      console.error(`사용자를 찾을 수 없거나 소셜 로그인 사용자입니다: ${input.email}`);
      return null;
    }
    
    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      console.error(`비밀번호가 일치하지 않습니다: ${input.email}`);
      return null;
    }
    
    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // 비밀번호 필드 제외하고 반환
    const { password, ...userWithoutPassword } = user;
    return { 
      user: userWithoutPassword as User,
      token
    };
  } catch (error) {
    console.error('로그인 오류:', error);
    return null;
  }
}

// 소셜 로그인 사용자 생성 또는 업데이트
export function upsertSocialUser(
  email: string,
  name: string,
  provider: 'google' | 'github',
  image?: string
): User | null {
  try {
    // 기존 사용자 확인
    const existingUser = getUserByEmail(email);
    
    if (existingUser) {
      // 기존 사용자 업데이트
      db.prepare(`
        UPDATE users
        SET name = ?, provider = ?, image = ?, updatedAt = ?
        WHERE email = ?
      `).run(
        name,
        provider,
        image || existingUser.image,
        new Date().toISOString(),
        email
      );
      
      return {
        ...existingUser,
        name,
        provider,
        image: image || existingUser.image,
        updatedAt: new Date().toISOString()
      };
    } else {
      // 새 사용자 생성
      const newUser: User = {
        id: uuidv4(),
        name,
        email,
        image,
        provider,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      db.prepare(`
        INSERT INTO users (id, name, email, image, provider, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.image,
        newUser.provider,
        newUser.createdAt,
        newUser.updatedAt
      );
      
      return newUser;
    }
  } catch (error) {
    console.error('소셜 로그인 사용자 처리 오류:', error);
    return null;
  }
}

// JWT 토큰 검증
export function verifyToken(token: string): { id: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    return decoded;
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    return null;
  }
} 