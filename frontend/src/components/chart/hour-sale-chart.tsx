import { StackedChart } from './stacked-chart';

import { TransactionDetail } from '@/openapi-codegen/clochetteSchemas';
import { createSliceOf30Minutes } from '@/utils/date';

export function HourSaleChart() {
  const groupByCallback = (item: TransactionDetail) => createSliceOf30Minutes(item);
  const sortCallback = (a: string, b: string) => (a > b ? 1 : -1);

  return (
    <StackedChart
      groupByCallback={groupByCallback}
      sortCallback={sortCallback}
    />
  );
}
