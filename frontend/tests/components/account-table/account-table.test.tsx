import { render, waitFor } from '@testing-library/react';

import { accountColumns } from '@/components/account-table/account-columns';
import { DataTable } from '@/components/table/data-table';
import { Account } from '@/openapi-codegen/clochetteSchemas';

const accounts: Account[] = [
  {
    username: 'admin',
    lastName: 'Admin',
    firstName: 'Admin',
    promotionYear: 2020,
    id: 1,
    scope: 'president',
    isActive: true
  },
  {
    username: 'test',
    lastName: 'Test',
    firstName: 'Test',
    promotionYear: 2026,
    id: 2,
    scope: 'staff',
    isActive: false
  }
];

describe('accountColumns', () => {
  it('should render all columns', () => {
    const result = render(
      <DataTable
        columns={accountColumns}
        data={accounts}
      />
    );

    expect(result.container).toMatchSnapshot();
  });
});
