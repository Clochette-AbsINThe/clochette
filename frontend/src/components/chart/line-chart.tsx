import { Line } from 'react-chartjs-2';

import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, ChartData, PointElement } from 'chart.js';
import type { ChartOptions } from 'chart.js';

import { useReadTransactions } from '@/openapi-codegen/clochetteComponents';
import { Transaction } from '@/openapi-codegen/clochetteSchemas';
import { createDateFromString } from '@/utils/date';
import { groupBy } from '@/utils/utils';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const options: ChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    y: {
      type: 'linear',
      ticks: {
        color: '#6e6b7b'
      },
      position: 'left',
      title: {
        display: true,
        text: 'Montant (€)',
        color: '#6e6b7b'
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true
    }
  }
};

function groupByCallback(item: Transaction) {
  return new Date(item.datetime).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function sortCallback(a: string, b: string) {
  return createDateFromString(a).getTime() - createDateFromString(b).getTime();
}

interface LineChartProps {
  type: 'cash' | 'account';
}

export default function LineChart({ type }: LineChartProps) {
  const filterMethod = (transacion: Transaction) => {
    if (type === 'cash') {
      return transacion.paymentMethod === 'Espèces';
    }
    return transacion.paymentMethod !== 'Espèces';
  };
  const lineColor = type === 'cash' ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)';
  const title = type === 'cash' ? "Montant d'espèces en € :" : 'Montant du compte en € :';

  const { data: transactions } = useReadTransactions({});

  const dataset = groupBy(transactions ?? [], groupByCallback, sortCallback);

  const data = Array.from(dataset.values()).map((transactions) => transactions.filter(filterMethod).reduce((acc, transaction) => (transaction.amount ?? 0) + acc, 0));
  const labels = Array.from(dataset.keys());

  const charData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: `Montant ${type === 'cash' ? "d'espèces" : 'du compte'}`,
        data: data.map((val, idx, arr) => (idx === 0 ? val : arr.slice(0, idx).reduce((a, b) => a + b, 0) + val)),
        borderColor: lineColor,
        animation: {
          duration: 500,
          easing: 'easeOutQuart'
        },
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0.4
      }
    ]
  };

  return (
    <div className='max-w-full'>
      <h1 className='text-lg mb-2 font-semibold'>{title}</h1>
      <div className='overflow-auto'>
        <div className='w-[38rem] h-[20rem] m-4'>
          <Line
            height={800}
            data={charData}
            options={options as any}
          />
        </div>
      </div>
    </div>
  );
}
