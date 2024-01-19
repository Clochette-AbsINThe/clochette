import { StackedChart } from './stacked-chart';

import { TransactionDetail } from '@/openapi-codegen/clochetteSchemas';
import { createDateFromString } from '@/utils/date';

export function DateSaleChart() {
  const groupByCallback = (item: TransactionDetail) => new Date(item.datetime).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const sortCallback = (a: string, b: string) => createDateFromString(a).getTime() - createDateFromString(b).getTime();

  return (
    <StackedChart
      groupByCallback={groupByCallback}
      sortCallback={sortCallback}
    />
  );
}
