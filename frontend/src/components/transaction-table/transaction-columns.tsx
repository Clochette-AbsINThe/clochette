import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { DataTableRowActions } from '@/components/transaction-table/transaction-table-row-actions';
import { TradeType, Transaction } from '@/openapi-codegen/clochetteSchemas';
import { DecreasingArrowIcon, IncreaseArrowIcon } from '@/styles/utils';
import { formatPrice } from '@/utils/utils';

export const transactionColumns: ColumnDef<Transaction>[] = [
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
    id: 'datetime',
    accessorKey: 'datetime',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Date'
      />
    ),
    cell: ({ row }) => {
      const dateString = row.getValue<string>('datetime');
      const date = new Date(dateString);
      const formatted = new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium'
      }).format(date);

      return formatted;
    }
  },
  {
    id: 'time',
    accessorKey: 'datetime',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Heure'
      />
    ),
    cell: ({ row }) => {
      const dateString = row.getValue<string>('datetime');
      const date = new Date(dateString);
      const formatted = new Intl.DateTimeFormat('fr-FR', {
        timeStyle: 'short'
      }).format(date);

      return formatted;
    },
    enableSorting: false
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Moyen de paiment'
      />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const paymentMethod = row.getValue<string>('paymentMethod');

      if (type === 'tresorery') {
        return <span>(Trésorie) - {paymentMethod}</span>;
      } else {
        return paymentMethod;
      }
    },
    accessorKey: 'paymentMethod',
    enableSorting: false
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Montant'
      />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = formatPrice(amount);

      return <span className='text-lg font-bold'>{formatted}</span>;
    }
  },
  {
    id: 'trade',
    accessorKey: 'trade',
    cell: ({ row }) => {
      const trade = row.getValue<TradeType>('trade');
      return <span className='flex lg:w-16 w-6 items-center'>{trade === 'purchase' ? <DecreasingArrowIcon /> : <IncreaseArrowIcon />}</span>;
    },
    header: ({ column }) => <></>,
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
