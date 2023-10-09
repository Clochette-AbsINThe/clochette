import { render } from '@testing-library/react';

import { findActiveLink, filterLinks, Tabs } from '@/components/account-page/account-page-tabs';

describe('findActiveLink', () => {
  it('should return the active link', () => {
    const pathname = '/account/dashboard';
    const activeLink = findActiveLink(pathname);
    expect(activeLink?.href).toBe('/account/dashboard');
  });

  it('should return undefined if no active link is found', () => {
    const pathname = '/account/settings';
    const activeLink = findActiveLink(pathname);
    expect(activeLink).toBeUndefined();
  });
});

describe('filterLinks', () => {
  it('should return all links if session is null', () => {
    const session = null;
    const filteredLinks = filterLinks(session);
    expect(filteredLinks).toEqual([]);
  });

  it('should return only links with matching scopes', () => {
    const session = {
      scopes: ['president']
    };
    const filteredLinks = filterLinks(session as any);
    expect(filteredLinks).toEqual([
      { label: 'Accueil', href: '/account', scopes: ['staff', 'treasurer', 'president'] },
      { label: 'Tableau de bord', href: '/account/dashboard', scopes: ['president', 'treasurer'] },
      { label: 'Comptes utilisateurs', href: '/account/users', scopes: ['president'] },
      { label: 'Trésorie', href: '/account/tresory', scopes: ['president', 'treasurer'] }
    ]);
  });

  it('should return an empty array if no links match the user roles', () => {
    const session = {
      scopes: ['member']
    };
    const filteredLinks = filterLinks(session as any);
    expect(filteredLinks).toEqual([]);
  });
});

describe('Tabs', () => {
  it('should render the tabs', () => {
    const { container } = render(<Tabs />);
    expect(container).toMatchSnapshot();
  });
});
