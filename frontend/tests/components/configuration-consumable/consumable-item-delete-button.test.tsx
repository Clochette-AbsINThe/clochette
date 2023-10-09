import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ConsumableItemDeleteButton } from '@/components/configuration-consumable/consumable-item-delete-button';
import { ConsumableItem } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApi } from 'tests/utils';

describe('ConsumableItemDeleteButton', () => {
  const consumableItem: ConsumableItem = {
    id: 1,
    icon: 'Misc',
    name: 'Consumable Test'
  };
  it('submits data when button is clicked', async () => {
    const deleteConsumableItem = vi.fn();

    spyOnApi('useDeleteConsumableItem', deleteConsumableItem);

    render(<ConsumableItemDeleteButton consumableItem={consumableItem} />, {
      wrapper: createWrapper()
    });

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }));

    await waitFor(() => {
      expect(deleteConsumableItem).toHaveBeenCalledWith({
        pathParams: {
          consumableItemId: consumableItem.id
        }
      });
    });
  });
});
