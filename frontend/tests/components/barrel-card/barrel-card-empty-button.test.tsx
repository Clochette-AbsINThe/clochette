import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { EmptyBarrelButton } from '@/components/barrel-card/barrel-card-empty-button';
import { Barrel } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApi } from 'tests/utils';

const barrel: Barrel = {
  id: 1,
  name: 'Barrel 1',
  sellPrice: 5.0
} as any;

describe('EmptyBarrelButton', () => {
  it('should render a button with the text "Fût vide"', () => {
    render(<EmptyBarrelButton barrel={barrel} />, {
      wrapper: createWrapper()
    });

    const button = screen.getByRole('button', { name: 'Fût vide' });
    expect(button).not.toBeNull();
  });

  it('should open a confirmation dialog when clicked', async () => {
    render(<EmptyBarrelButton barrel={barrel} />, {
      wrapper: createWrapper()
    });

    const button = screen.getByRole('button', { name: 'Fût vide' });
    fireEvent.click(button);

    const dialogTitle = await screen.findByText('Vider le fût');
    expect(dialogTitle).not.toBeNull();
  });

  it('should call the API to empty the barrel when confirmed', async () => {
    const mutate = vi.fn();
    spyOnApi('useUpdateBarrel', mutate);

    render(<EmptyBarrelButton barrel={barrel} />, {
      wrapper: createWrapper()
    });

    const button = screen.getByRole('button', { name: 'Fût vide' });
    fireEvent.click(button);

    const confirmButton = await screen.findByRole('button', { name: 'Vider' });
    fireEvent.click(confirmButton);

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith({
        pathParams: {
          barrelId: 1
        },
        body: {
          isMounted: false,
          emptyOrSolded: true
        }
      })
    );
  });
});
