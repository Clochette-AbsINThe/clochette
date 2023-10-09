import { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { logger } from '@/lib/logger';
import { fetchLogin } from '@/openapi-codegen/clochetteComponents';
import { pages } from '@/utils/pages';
import { parseJwt } from '@/utils/utils';

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials, req) => {
        if (credentials === undefined) {
          return null;
        }
        try {
          const token = await fetchLogin({
            body: {
              username: credentials.username,
              password: credentials.password
            }
          });
          const parsed = parseJwt(token.access_token);
          if (parsed === null) {
            return null;
          }
          return {
            id: parsed.sub,
            ...parsed,
            token: token.access_token
          };
        } catch (error) {
          logger.error(error);
          return null;
        }
      }
    })
  ],
  // pages
  pages: {
    signIn: pages.signin,
    signOut: pages.signout
  },
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error: (code, metadata) => {
      if (code === 'JWT_SESSION_ERROR') {
        const error = metadata instanceof Error ? metadata : metadata.error;
        if (error.message.includes('TokenExpiredError')) {
          // Don't log expired token errors
          return;
        }
      }
      logger.error(code, metadata);
    },
    warn: (code) => {
      logger.warn(code);
    },
    debug: (code, metadata) => {
      logger.debug(code, metadata);
    }
  },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  callbacks: {
    // Getting the JWT token from API response
    jwt: async ({ token, user, account }) => {
      const isSigningIn = user ? true : false;
      if (isSigningIn) {
        token = {
          ...user
        };
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      const parsed = parseJwt(token.token);
      const expires = parsed !== null ? new Date(parseInt(parsed.exp.toString()) * 1000).toISOString() : session.expires;

      if (new Date(expires) < new Date()) {
        logger.error('TokenExpiredError');
        throw new Error('TokenExpiredError');
      }

      const isSigningIn = token ? true : false;
      if (isSigningIn) {
        session = {
          id: token.sub,
          scopes: token.scopes,
          expires: session.expires,
          token: token.token
        };
      }
      return Promise.resolve(session);
    }
  }
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
