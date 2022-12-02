import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { useEffect, useState } from 'react';
import { getTransactionItems } from '@proxies/DashboardProxies';
import { ItemTransactionResponse, TransactionType } from '@types';
import { rainbowColors, groupBy, unique } from '@utils/utils';
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
            position: 'left',
            fullSize: true
        },
        tooltip: {
            enabled: true
        }
    }
};

interface StackedChartProps<K> {
    groupByCallback: (item: TransactionType<ItemTransactionResponse>) => K;
    sortCallback: (a: K, b: K) => number;
    queryFilter: string;
}

export default function StackedCharts<K>(props: StackedChartProps<K>) {
    const { groupByCallback, sortCallback, queryFilter } = props;

    const [transactions, setTransactions] = useState<Array<TransactionType<ItemTransactionResponse>>>([]);
    const [getData, { loading }] = getTransactionItems(setTransactions);

    useEffect(() => {
        getData();
    }, []);

    const names = transactions
        .map((item) => item.items.map((item) => item.item.name))
        .flat()
        .filter(unique);

    const testDatasets = groupBy(transactions, groupByCallback, sortCallback);

    const data: ChartData<'bar'> = {
        labels: Array.from(testDatasets.keys()),
        datasets: names.sort().map((name, index) => {
            return {
                label: name,
                data: Array.from(testDatasets.values()).map((transactionArrayForAGivenFilter) =>
                    transactionArrayForAGivenFilter
                        .map((transaction) =>
                            transaction.items
                                .filter((item) => item.item.name === name)
                                .map((item) => item.quantity)
                                .reduce((a, b) => a + b, 0)
                        )
                        .reduce((a, b) => a + b, 0)
                ),
                backgroundColor: rainbowColors(names.length + 2, index)
            };
        })
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <button
                className='btn-primary max-w-max'
                onClick={getData}>
                Reload data
            </button>
            <div className='max-w-[40rem] max-h-[15rem]'>
                <Bar
                    data={data}
                    height={400}
                    width={600}
                    options={options as any}
                />
            </div>
        </>
    );
}
