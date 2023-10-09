import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { NonInventoriedItemHomeGrid } from '@/components/configuration-non-inventoried/non-inventoried-item-home-grid';
import { NonInventoriedItem, NonInventoriedItemCreate, NonInventoriedItemUpdate } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApi, spyOnApiCall } from 'tests/utils';

describe('NonInventoriedItemHomeGrid', () => {
  it('should render the loader when loading', () => {
    spyOnApiCall('useReadNonInventoriedItems', [], true);

    render(<NonInventoriedItemHomeGrid query='' />, {
      wrapper: createWrapper()
    });

    // Get loader by aria label
    expect(screen.getByLabelText('loader')).not.toBeNull();
  });

  it('should render the error message when error', () => {
    spyOnApiCall('useReadNonInventoriedItems', [], false, true);

    render(<NonInventoriedItemHomeGrid query='' />, {
      wrapper: createWrapper()
    });

    expect(screen.getByText('Erreur lors du chargement des produits hors inventaire')).not.toBeNull();
  });

  it('should render the empty message when no nonInventoriedItem', () => {
    spyOnApiCall('useReadNonInventoriedItems', []);

    render(<NonInventoriedItemHomeGrid query='' />, {
      wrapper: createWrapper()
    });

    expect(screen.getByText('Aucun produit hors inventaire')).not.toBeNull();
  });

  it('should render the nonInventoriedItems', () => {
    const nonInventoriedItems: NonInventoriedItem[] = [
      {
        id: 1,
        icon: 'Misc',
        name: 'NonInventoried Test',
        sellPrice: 5,
        trade: 'sale'
      },
      {
        id: 2,
        icon: 'Misc',
        name: 'NonInventoried Test 2',
        sellPrice: null,
        trade: 'purchase'
      }
    ];

    spyOnApiCall('useReadNonInventoriedItems', nonInventoriedItems);

    render(<NonInventoriedItemHomeGrid query='' />, {
      wrapper: createWrapper()
    });

    expect(screen.getByText('NonInventoried Test')).not.toBeNull();
    expect(screen.getByText('NonInventoried Test 2')).not.toBeNull();
  });
});
