import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ConsumableItemHomeGrid } from '@/components/configuration-consumable/consumable-item-home-grid';
import { ConsumableItem, ConsumableItemCreate, ConsumableItemUpdate } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApi, spyOnApiCall } from 'tests/utils';

describe('ConsumableItemHomeGrid', () => {
  it('should render the loader when loading', () => {
    spyOnApiCall('useReadConsumableItems', [], true);

    render(<ConsumableItemHomeGrid query='' />, {
      wrapper: createWrapper()
    });

    // Get loader by aria label
    expect(screen.getByLabelText('loader')).not.toBeNull();
  });

  it('should render the error message when error', () => {
    spyOnApiCall('useReadConsumableItems', [], false, true);

    render(<ConsumableItemHomeGrid query='' />, {
      wrapper: createWrapper()
    });

    expect(screen.getByText('Erreur lors du chargement des consommables')).not.toBeNull();
  });

  it('should render the empty message when no consumableItem', () => {
    spyOnApiCall('useReadConsumableItems', []);

    render(<ConsumableItemHomeGrid query='' />, {
      wrapper: createWrapper()
    });

    expect(screen.getByText('Aucun consommable')).not.toBeNull();
  });

  it('should render the consumableItems', () => {
    const consumableItems: ConsumableItem[] = [
      {
        id: 1,
        icon: 'Misc',
        name: 'Consumable Test'
      }
    ];

    spyOnApiCall('useReadConsumableItems', consumableItems);

    render(<ConsumableItemHomeGrid query='' />, {
      wrapper: createWrapper()
    });

    expect(screen.getByText('Consumable Test')).not.toBeNull();
  });
});
