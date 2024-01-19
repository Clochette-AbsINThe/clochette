import { render, screen } from '@testing-library/react';

import { BarrelCard } from '@/components/barrel-card/barrel-card';
import { Barrel } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper } from 'tests/utils';

const mockBarrel: Barrel = {
  id: 1,
  name: 'Mock Barrel',
  sellPrice: 5.0
} as any;

describe('BarrelCard', () => {
  it('renders the barrel card', () => {
    const { container } = render(<BarrelCard barrel={mockBarrel} />, {
      wrapper: createWrapper()
    });
    expect(container).toMatchSnapshot();
    expect(screen.getByText('Mock Barrel')).not.toBeNull();
  });
});
