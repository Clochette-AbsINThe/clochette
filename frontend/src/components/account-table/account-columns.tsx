import { ColumnDef } from '@tanstack/react-table';

import { DataTableRowActions } from './account-table-row-actions';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Account } from '@/openapi-codegen/clochetteSchemas';

export const accountColumns: ColumnDef<Account>[] = [
  {
    id: 'id',
    accessorKey: 'id'
  },
  {
    id: 'actionsMobile',
    cell: ({ row }) => (
      <div className='sm:hidden flex items-center'>
        <DataTableRowActions row={row} />
      </div>
    )
  },
  {
    id: 'firstName',
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Nom'
      />
    )
  },
  {
    id: 'lastName',
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Prénom'
      />
    )
  },
  {
    id: 'username',
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Nom d'utilisateur"
      />
    )
  },
  {
    id: 'scope',
    accessorKey: 'scope',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Rôle'
      />
    )
  },
  {
    accessorKey: 'isActive',
    id: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Actif'
      />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue<boolean>('isActive');

      if (isActive) {
        return <span className='text-primary font-bold'>✓</span>;
      } else {
        return <span className='text-destructive font-bold'>✗</span>;
      }
    },
    enableSorting: false
  },
  {
    id: 'actionsDesktop',
    cell: ({ row }) => (
      <div className='hidden sm:flex items-center'>
        <DataTableRowActions row={row} />
      </div>
    )
  }
];
