import { render } from '@testing-library/react';

import { barrelColumns } from '@/components/barrel-table/barrel-admin-columns';
import { DataTable } from '@/components/table/data-table';
import { Barrel } from '@/openapi-codegen/clochetteSchemas';
import { createWrapper, spyOnApiCall } from 'tests/utils';

const barrels: Barrel[] = [
  {
    name: 'Rouge',
    buyPrice: 65.0,
    sellPrice: 2.5,
    barrelSellPrice: null,
    isMounted: true,
    emptyOrSolded: true,
    drinkItemId: 1,
    id: 1
  },
  {
    name: 'Blanche',
    buyPrice: 80.0,
    sellPrice: 2.5,
    barrelSellPrice: null,
    isMounted: false,
    emptyOrSolded: false,
    drinkItemId: 1,
    id: 2
  }
];

describe('accountColumns', () => {
  it('should render all columns', () => {
    spyOnApiCall('useReadGlasses', [
      {
        sellPrice: 2.5
      }
    ]);

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
