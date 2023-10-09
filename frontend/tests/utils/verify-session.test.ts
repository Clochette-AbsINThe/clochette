import { getServerSession } from 'next-auth';
import { Mock } from 'vitest';

import { pages } from '@/utils/pages';
import { verifySession, verifyScopes } from '@/utils/verify-session';

vi.mock('next-auth');

describe('verifySession', () => {

  it('should return unauthenticated status if session is not found', async () => {
    (getServerSession as Mock).mockReturnValueOnce(Promise.resolve(null));

    const result = await verifySession({} as any);
    expect(result.status).toBe('unauthenticated');
    expect(
      result.status === 'unauthenticated' &&
      result.redirection.redirect.destination).toBe(pages.signin + '?callbackUrl=' + pages.index);
  });

  it('should return authenticated status if session is found', async () => {
    (getServerSession as Mock).mockReturnValueOnce(Promise.resolve({
      user: {
        name: 'John Doe'
      }
    }));

    const result = await verifySession({} as any);
    expect(result.status).toBe('authenticated');
    expect(
      result.status === 'authenticated' &&
      result.session.user?.name).toBe('John Doe');
  });
});

describe('verifyScopes', () => {
  it('should return authorized status if user has required scopes', () => {
    const currentUrl = pages.account.users;
    const session = {
      scopes: ['president']
    };
    const result = verifyScopes(currentUrl, session as any);
    expect(result.status).toBe('authorized');
  });

  it('should return unauthorized status if user does not have required scopes', () => {
    const currentUrl = pages.account.users;
    const session = {
      scopes: ['staff']
    };
    const result = verifyScopes(currentUrl, session as any);
    expect(result.status).toBe('unauthorized');
    expect(
      result.status === 'unauthorized' &&
      result.redirection.redirect.destination).toBe(pages.account.index);
  });
});