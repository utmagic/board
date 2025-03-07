import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { loginUser, upsertSocialUser } from '@/lib/users';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await loginUser({
            email: credentials.email,
            password: credentials.password
          });

          if (!result) {
            return null;
          }

          return {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            image: result.user.image,
            token: result.token
          };
        } catch (error) {
          console.error('인증 오류:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // 초기 로그인 시 사용자 정보와 토큰을 JWT에 추가
      if (user && account) {
        // 소셜 로그인인 경우
        if (account.provider === 'google' || account.provider === 'github') {
          if (user.email) {
            const socialUser = upsertSocialUser(
              user.email,
              user.name || '',
              account.provider as 'google' | 'github',
              user.image
            );
            
            if (socialUser) {
              token.id = socialUser.id;
              token.provider = socialUser.provider;
            }
          }
        } else if (account.provider === 'credentials') {
          // 이메일/비밀번호 로그인인 경우
          token.id = user.id;
          token.accessToken = (user as any).token;
          token.provider = 'email';
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1일
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-nextauth-secret',
});

export { handler as GET, handler as POST }; 