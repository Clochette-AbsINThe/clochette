import { ColumnDef } from '@tanstack/react-table';

import { DataTableRowActions } from '@/components/consumable-table/consumable-table-row-actions';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { ConsumableDistinct, IconName } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';
import { formatPrice } from '@/utils/utils';

export const consumbaleColumns: ColumnDef<ConsumableDistinct>[] = [
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
    id: 'icon',
    accessorKey: 'icon',
    header: ({ column }) => <></>,
    cell: ({ row }) => {
      const icon = row.getValue<IconName>('icon');
      return <span className='flex items-center'>{getIcon(icon, 'w-8 h-8')}</span>;
    }
  },
  {
    id: 'quantity',
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Quantité'
      />
    ),
    cell: ({ row }) => {
      const amount = parseInt(row.getValue('quantity'));

      return amount;
    },
    enableSorting: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Nom'
      />
    )
  },
  {
    id: 'sellPrice',
    accessorKey: 'sellPrice',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Prix de vente'
      />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('sellPrice'));
      const formatted = formatPrice(amount);

      return formatted;
    }
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
