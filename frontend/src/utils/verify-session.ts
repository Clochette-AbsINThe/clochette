import { GetServerSidePropsContext, Redirect } from 'next';
import { getServerSession, Session } from 'next-auth';

import { links } from '@/components/account-page/account-page-tabs';
import { options } from '@/pages/api/auth/[...nextauth]';
import { pages } from '@/utils/pages';

type VerifySessionReturn =
  | {
      status: 'authenticated';
      session: Session;
    }
  | {
      status: 'unauthenticated';
      redirection: {
        redirect: Redirect;
      };
    };

/**
 * Verifies the user session on the server side.
 * @param context - The server-side props context.
 * @param callbackUrl - The URL to redirect to if session verification failes.
 * @returns A promise that resolves to an object containing the session status and session data (if authenticated).
 */
export async function verifySession(context: GetServerSidePropsContext, callbackUrl: string = pages.index): Promise<VerifySessionReturn> {
  const session = await getServerSession(context.req, context.res, options);

  if (!session)
    return {
      status: 'unauthenticated',
      redirection: {
        redirect: {
          destination: pages.signin + '?callbackUrl=' + callbackUrl,
          permanent: false
        }
      }
    };

  return {
    status: 'authenticated',
    session
  };
}

type VerifyScopesReturn =
  | {
      status: 'authorized';
    }
  | {
      status: 'unauthorized';
      redirection: {
        redirect: Redirect;
      };
    };

/**
 * Verifies if the current session has the required scopes to access the current URL.
 * @param currentUrl - The URL to verify the scopes against.
 * @param session - The current user session.
 * @returns An object with the status of the verification and a redirection object if the user is unauthorized.
 */
export function verifyScopes(currentUrl: string, session: Session): VerifyScopesReturn {
  const requiredScopes = links.find((value) => value.href === currentUrl)!.scopes;
  for (const scope of session.scopes) {
    const findedScope = requiredScopes.find((value) => value === scope);
    if (findedScope === undefined) {
      return {
        status: 'unauthorized',
        redirection: {
          redirect: {
            destination: pages.account.index,
            permanent: false
          }
        }
      };
    }
  }
  return {
    status: 'authorized'
  };
}
