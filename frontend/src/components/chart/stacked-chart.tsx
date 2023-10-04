import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import type { DateRange } from 'react-day-picker';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { addDays, subMonths } from 'date-fns';

import { DatePickerWithRange } from './date-picker';

import { useReadTransactionsDetails } from '@/hooks/useReadTransansactionsDetails';
import { Consumable, Glass, NonInventoried, TransactionDetail } from '@/openapi-codegen/clochetteSchemas';
import { groupBy, rainbowColors, unique } from '@/utils/utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options: ChartOptions = {
  maintainAspectRatio: false,
  scales: {
    y: {
      stacked: true,
      ticks: {
        color: '#6e6b7b'
      }
    },
    x: {
      stacked: true,
      ticks: {
        color: '#6e6b7b',
        stepSize: 100
      }
    }
  },
  plugins: {
    legend: {
      position: 'right'
    },
    tooltip: {
      enabled: true
    }
  }
};

type Item = Consumable | Glass | NonInventoried;

export function extractItemsFromTransaction(transaction: TransactionDetail | undefined): Item[] {
  if (!transaction) return [];

  const items: Item[] = [...transaction.consumablesSale, ...transaction.glasses, ...transaction.nonInventorieds.filter((nonInventoried) => nonInventoried.trade === 'sale')];

  return items;
}

interface StackedChartProps<K> {
  groupByCallback: (item: TransactionDetail) => K;
  sortCallback: (a: K, b: K) => number;
}

export function StackedChart<K>({ groupByCallback, sortCallback }: StackedChartProps<K>) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: addDays(new Date(), 1)
  });

  const datetime__gt = date?.from ?? subMonths(new Date(), 1);
  const datetime__lt = date?.to ?? addDays(new Date(), 1);

  datetime__gt.setHours(0, 0, 0, 0);
  datetime__lt.setHours(23, 59, 59, 999);

  const { transactions } = useReadTransactionsDetails({
    datetime__gt,
    datetime__lt
  });

  const dataset: Map<K, Item[]> = new Map();
  groupBy(transactions, groupByCallback, sortCallback).forEach((transactions, key) => {
    dataset.set(
      key,
      transactions.flatMap((transaction) => extractItemsFromTransaction(transaction))
    );
  });

  const names = Array.from(dataset.values())
    .flatMap((items) => items.map((item) => item.name))
    .filter(unique);

  const chartData: ChartData<'bar'> = {
    labels: Array.from(dataset.keys()),
    datasets: names.sort().map((name, index) => {
      return {
        label: name,
        data: Array.from(dataset.values()).map((itemsForAKey) => itemsForAKey.filter((item) => item.name === name).length),
        backgroundColor: rainbowColors(names.length + 2, index),
        borderRadius: 10,
        animation: {
          duration: 500,
          easing: 'easeOutQuart'
        },
        maxBarThickness: 15
      };
    })
  };

  return (
    <>
      <DatePickerWithRange
        date={date}
        setDate={setDate}
      />
      <div className='overflow-auto'>
        <div className='w-[38rem] h-[20rem] m-4'>
          <Bar
            height={800}
            data={chartData}
            options={options as any}
          />
        </div>
      </div>
    </>
  );
}
