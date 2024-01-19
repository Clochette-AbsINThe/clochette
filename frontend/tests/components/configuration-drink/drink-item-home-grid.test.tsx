import { render, screen } from '@testing-library/react';

import { DrinkItemHomeGrid } from '@/components/configuration-drink/drink-item-home-grid';
import { DrinkItem } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApiCall } from 'tests/utils';

describe('DrinkItemHomeGrid', () => {
  it('should render the loader when loading', () => {
    spyOnApiCall('useReadDrinks', [], true);

    render(<DrinkItemHomeGrid query='' />, {
      wrapper: createWrapper()
    });

    // Get loader by aria label
    expect(screen.getByLabelText('loader')).not.toBeNull();
  });

  it('should render the error message when error', () => {
    spyOnApiCall('useReadDrinks', [], false, true);

    render(<DrinkItemHomeGrid query='' />, {
      wrapper: createWrapper()
    });

    expect(screen.getByText('Erreur lors du chargement des boissons')).not.toBeNull();
  });

  it('should render the empty message when no drinkItem', () => {
    spyOnApiCall('useReadDrinks', []);

    render(<DrinkItemHomeGrid query='' />, {
      wrapper: createWrapper()
    });

    expect(screen.getByText('Aucune boisson')).not.toBeNull();
  });

  it('should render the drinkItems', () => {
    const drinkItems: DrinkItem[] = [
      {
        id: 1,
        name: 'Drink Test'
      }
    ];

    spyOnApiCall('useReadDrinks', drinkItems);

    render(<DrinkItemHomeGrid query='' />, {
      wrapper: createWrapper()
    });

    expect(screen.getByText('Drink Test')).not.toBeNull();
  });
});
