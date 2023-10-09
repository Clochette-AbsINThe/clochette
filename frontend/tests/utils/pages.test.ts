import { pages } from '@/utils/pages';

describe('pages', () => {
  it('should have the correct routes', () => {
    expect(pages.signin).toBe('/login');
    expect(pages.signout).toBe('/logout');
    expect(pages.signup).toBe('/register');
    expect(pages.index).toBe('/');
    expect(pages.configuration.index).toBe('/configuration');
    expect(pages.configuration.boissons.index).toBe('/configuration/boissons');
    expect(pages.configuration.boissons.create).toBe('/configuration/boissons/create');
    expect(pages.configuration.boissons.id(1)).toBe('/configuration/boissons/1');
    expect(pages.configuration.horsInventaires.index).toBe('/configuration/hors-inventaires');
    expect(pages.configuration.horsInventaires.create).toBe('/configuration/hors-inventaires/create');
    expect(pages.configuration.horsInventaires.id(2)).toBe('/configuration/hors-inventaires/2');
    expect(pages.configuration.consommables.index).toBe('/configuration/consommables');
    expect(pages.configuration.consommables.create).toBe('/configuration/consommables/create');
    expect(pages.configuration.consommables.id(3)).toBe('/configuration/consommables/3');
    expect(pages.transactionHistory).toBe('/transaction-history');
    expect(pages.transaction.achat).toBe('/transaction/achat');
    expect(pages.transaction.vente).toBe('/transaction/vente');
    expect(pages.stock).toBe('/stock');
    expect(pages.account.index).toBe('/account');
    expect(pages.account.dashboard).toBe('/account/dashboard');
    expect(pages.account.users).toBe('/account/users');
    expect(pages.account.tresory).toBe('/account/tresory');
  });
});
