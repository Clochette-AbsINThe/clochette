import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    scopes: string[];
    id: string;
    token: string;
  }
  interface User {
    sub: string;
    iat: number;
    exp: number;
    token_type: string;
    scopes?: string[];
    id: string;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends Record<string, unknown> {
    sub: string;
    iat: number;
    exp: number;
    token_type: string;
    scopes: string[];
    token: string;
  }
}
