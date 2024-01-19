import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { NonInventoriedItemDeleteButton } from '@/components/configuration-non-inventoried/non-inventoried-item-delete-button';
import { NonInventoriedItem } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApi } from 'tests/utils';

describe('NonInventoriedItemDeleteButton', () => {
  const nonInventoriedItem: NonInventoriedItem = {
    id: 1,
    icon: 'Misc',
    name: 'NonInventoried Test',
    trade: 'purchase',
    sellPrice: null
  };
  it('submits data when button is clicked', async () => {
    const deleteNonInventoriedItem = vi.fn();

    spyOnApi('useDeleteNonInventoriedItem', deleteNonInventoriedItem);

    render(<NonInventoriedItemDeleteButton nonInventoriedItem={nonInventoriedItem} />, {
      wrapper: createWrapper()
    });

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }));

    await waitFor(() => {
      expect(deleteNonInventoriedItem).toHaveBeenCalledWith({
        pathParams: {
          nonInventoriedItemId: nonInventoriedItem.id
        }
      });
    });
  });
});
