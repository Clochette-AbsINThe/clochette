import { render } from '@testing-library/react';

import { barrelColumns } from '@/components/barrel-table/barrel-stock-columns';
import { DataTable } from '@/components/table/data-table';
import { BarrelDistinct } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper } from 'tests/utils';

const barrels: BarrelDistinct[] = [
  {
    name: 'Rouge',
    buyPrice: 65.0,
    sellPrice: 2.5,
    barrelSellPrice: null,
    isMounted: true,
    emptyOrSolded: false,
    drinkItemId: 1,
    id: 1,
    quantity: 5
  },
  {
    name: 'Blanche',
    buyPrice: 80.0,
    sellPrice: 2.5,
    barrelSellPrice: null,
    isMounted: false,
    emptyOrSolded: false,
    drinkItemId: 1,
    id: 2,
    quantity: 2
  }
];

describe('accountColumns', () => {
  it('should render all columns', () => {
    const result = render(
      <DataTable
        columns={barrelColumns}
        data={barrels}
      />,
      { wrapper: createWrapper() }
    );

    expect(result.container).toMatchSnapshot();
  });
});
