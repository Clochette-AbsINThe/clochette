import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';

import { BarrelsTableMountAction } from '@/components/barrel-table/barrel-table-mount-action';
import { BarrelDistinct } from '@/openapi-codegen/clochetteSchemas';
import { createDialogWrapper, spyOnApi, spyOnApiCall } from 'tests/utils';

const barrel: BarrelDistinct = {
  name: 'Rouge',
  buyPrice: 65.0,
  sellPrice: 2.5,
  barrelSellPrice: null,
  isMounted: false,
  emptyOrSolded: false,
  drinkItemId: 1,
  id: 1,
  quantity: 5
};

describe('BarrelsTableMountAction', () => {
  it('submits data when button is clicked', async () => {
    const updateBarrel = vi.fn();

    spyOnApi('useUpdateBarrel', updateBarrel);
    spyOnApiCall('useReadBarrels', []);

    render(<BarrelsTableMountAction barrel={barrel} />, {
      wrapper: createDialogWrapper()
    });

    fireEvent.click(screen.getByRole('button', { name: 'Monter' }));

    await waitFor(() => {
      expect(updateBarrel).toHaveBeenCalledWith({
        body: {
          isMounted: true
        },
        pathParams: {
          barrelId: barrel.id
        }
      });
    });
  });
});
