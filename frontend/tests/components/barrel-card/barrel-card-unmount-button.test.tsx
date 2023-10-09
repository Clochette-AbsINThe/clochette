import { render, screen, fireEvent } from '@testing-library/react';

import { UnmountBarrelButton } from '@/components/barrel-card/barrel-card-unmount-button';
import { Barrel } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApi } from 'tests/utils';

const barrel: Barrel = {
  id: 1,
  name: 'Mock Barrel',
  sellPrice: 5.0,
  isMounted: true
} as any;

describe('UnmountBarrelButton', () => {
  it('should render the button with the correct text', () => {
    render(<UnmountBarrelButton barrel={barrel} />, {
      wrapper: createWrapper()
    });

    const button = screen.getByRole('button', { name: /unmount/i });
    expect(button).not.toBeNull();
  });

  it('should call the modifyBarrel function when clicked', () => {
    const mutate = vi.fn();
    spyOnApi('useUpdateBarrel', mutate);

    render(<UnmountBarrelButton barrel={barrel} />, {
      wrapper: createWrapper()
    });

    const button = screen.getByRole('button', { name: /unmount/i });
    fireEvent.click(button);

    expect(mutate).toHaveBeenCalledWith({
      pathParams: {
        barrelId: 1
      },
      body: {
        isMounted: false
      }
    });
  });
});
