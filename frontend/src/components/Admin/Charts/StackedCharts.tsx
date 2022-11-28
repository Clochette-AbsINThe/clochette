import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { useEffect, useState } from 'react';
import { getTransactionItems } from '@proxies/DashboardProxies';
import { ItemTransactionResponse, TransactionType } from '@types';
import { unique } from '@utils/utils';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options: ChartOptions = {
    maintainAspectRatio: false,
    scales: {
        y: {
            stacked: true
        },
        x: {
            stacked: true
        }
    },
    plugins: {
        legend: {
            position: 'left'
        }
    }
};

export default function StackedCharts() {
    const [transactions, setTransactions] = useState<Array<TransactionType<ItemTransactionResponse>>>([]);
    const [getData, { loading }] = getTransactionItems(setTransactions);

    useEffect(() => {
        getData();
    }, []);

    const names = transactions
        .map((item) => item.items.map((item) => item.item.name))
        .flat()
        .filter(unique);

    const data: ChartData<'bar'> = {
        labels: transactions.map((item) => new Date(item.datetime).getMinutes()),
        datasets: names.map((name) => {
            return {
                label: name,
                data: transactions.map((item) => item.items.find((item) => item.item.name === name)?.quantity || 0),
                backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`
            };
        })
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Bar
            data={data}
            height={400}
            width={600}
            options={options as any}
        />
    );
}
