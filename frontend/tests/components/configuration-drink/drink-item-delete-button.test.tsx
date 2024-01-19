import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { DrinkItemDeleteButton } from '@/components/configuration-drink/drink-item-delete-button';
import { DrinkItem } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApi } from 'tests/utils';

describe('DrinkItemDeleteButton', () => {
  const drinkItem: DrinkItem = {
    id: 1,
    name: 'Drink Test'
  };
  it('submits data when button is clicked', async () => {
    const deleteDrinkItem = vi.fn();

    spyOnApi('useDeleteDrink', deleteDrinkItem);

    render(<DrinkItemDeleteButton drink={drinkItem} />, {
      wrapper: createWrapper()
    });

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }));

    await waitFor(() => {
      expect(deleteDrinkItem).toHaveBeenCalledWith({
        pathParams: {
          drinkId: drinkItem.id
        }
      });
    });
  });
});
