import { ColumnDef, Row } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { useReadGlasses } from '@/openapi-codegen/clochetteComponents';
import { Barrel } from '@/openapi-codegen/clochetteSchemas';
import { DecreasingArrowIcon, IncreaseArrowIcon } from '@/styles/utils';
import { formatPrice } from '@/utils/utils';

export const barrelColumns: ColumnDef<Barrel>[] = [
  {
    id: 'id',
    accessorKey: 'id'
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Nom'
      />
    ),
    cell: ({ row }) => {
      const name = row.getValue<string>('name');

      if (row.original.emptyOrSolded) {
        return <span className='line-through'>{name}</span>;
      } else {
        return <span>{name}</span>;
      }
    }
  },
  {
    id: 'isMounted',
    accessorKey: 'isMounted',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Etat'
      />
    ),
    cell: ({ row }) => {
      const isMounted = row.getValue<boolean>('isMounted');

      return isMounted ? 'Monté sur une tireuse' : 'Vide';
    },
    enableSorting: false
  },
  {
    id: 'buyPrice',
    accessorKey: 'buyPrice',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Prix d'achat"
      />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('buyPrice'));
      const formatted = formatPrice(amount);

      return formatted;
    }
  },
  {
    id: 'totalGlassSold',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Nombre de verres vendus'
      />
    ),
    cell: ({ row }) => <TotalGlassSoldCell row={row} />
  },
  {
    id: 'totalSellPrice',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Prix total de vente'
      />
    ),
    cell: ({ row }) => <TotalSellPriceCell row={row} />
  },
  {
    id: 'profit',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Bilan'
      />
    ),
    cell: ({ row }) => <ProfitCell row={row} />
  }
];

export function TotalGlassSoldCell({ row }: Readonly<{ row: Row<Barrel> }>) {
  const { data } = useReadGlasses({
    queryParams: {
      barrel_id: row.getValue<number>('id')
    }
  });

  return <span>{data?.length ?? 0}</span>;
}

export function TotalSellPriceCell({ row }: Readonly<{ row: Row<Barrel> }>) {
  const { data } = useReadGlasses({
    queryParams: {
      barrel_id: row.getValue<number>('id')
    }
  });

  const totalSellPrice = data?.reduce((acc, glass) => {
    return acc + glass.sellPrice;
  }, 0);

  return <span>{formatPrice(totalSellPrice ?? 0)}</span>;
}

export function ProfitCell({ row }: Readonly<{ row: Row<Barrel> }>) {
  const { data } = useReadGlasses({
    queryParams: {
      barrel_id: row.getValue<number>('id')
    }
  });

  const totalSellPrice =
    data?.reduce((acc, glass) => {
      return acc + glass.sellPrice;
    }, 0) ?? 0;

  const profit = totalSellPrice - row.getValue<number>('buyPrice');

  return (
    <div className='flex justify-between'>
      <span className='mr-2'>{formatPrice(profit)}</span>
      {profit > 0 ? <IncreaseArrowIcon /> : <DecreasingArrowIcon />}
    </div>
  );
}
