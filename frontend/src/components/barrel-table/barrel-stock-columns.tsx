import { ColumnDef } from '@tanstack/react-table';

import { BarrelsTableMountAction } from '@/components/barrel-table/barrel-table-mount-action';
import { DataTableRowActions } from '@/components/barrel-table/barrel-table-row-actions';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { BarrelDistinct } from '@/openapi-codegen/clochetteSchemas';
import { getIcon } from '@/styles/utils';
import { formatPrice } from '@/utils/utils';

export const barrelColumns: ColumnDef<BarrelDistinct>[] = [
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
    header: ({ column }) => <></>,
    cell: ({ row }) => {
      return <span className='flex items-center'>{getIcon('Barrel', 'w-8 h-8')}</span>;
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
        title='Prix de vente du verre'
      />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('sellPrice'));
      const formatted = formatPrice(amount);

      return formatted;
    }
  },
  {
    id: 'mount',
    accessorKey: 'mount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Monter un fût'
      />
    ),
    cell: ({ row }) => {
      return <BarrelsTableMountAction barrel={row.original} />;
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
