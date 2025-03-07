import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 필수 필드 검증
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { message: '이름, 이메일, 비밀번호는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: '유효한 이메일 주소를 입력해주세요.' },
        { status: 400 }
      );
    }
    
    // 비밀번호 길이 검증
    if (body.password.length < 6) {
      return NextResponse.json(
        { message: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }
    
    // 사용자 등록
    const user = await registerUser({
      name: body.name,
      email: body.email,
      password: body.password
    });
    
    if (!user) {
      return NextResponse.json(
        { message: '이미 등록된 이메일입니다.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { message: '회원가입이 완료되었습니다.', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json(
      { message: '회원가입 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 