import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { useCallback, useEffect, useState } from 'react';
import { getTransactionItems } from '@proxies/DashboardProxies';
import { ItemTransactionResponse, TransactionType } from '@types';
import { rainbowColors, groupBy, unique } from '@utils/utils';
import Loader from '@components/Loader';
import ReloadButton from './ReloadButton';
import { useDataCaching } from '@components/Admin/Dashboard/Container';
import DateRangePicker from '../Dashboard/DateRangePicker';

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
            position: 'left',
            fullSize: true
        },
        tooltip: {
            enabled: true
        }
    }
};

const date = new Date();
date.setMonth(date.getMonth() - 1);

interface StackedChartProps<K> {
    groupByCallback: (item: TransactionType<ItemTransactionResponse>) => K;
    sortCallback: (a: K, b: K) => number;
}

export default function StackedCharts<K>(props: StackedChartProps<K>) {
    const { groupByCallback, sortCallback } = props;

    const { transactionsCache, setTransactionsCache } = useDataCaching();

    const [transactions, setTransactions] = useState<Array<TransactionType<ItemTransactionResponse>>>(transactionsCache);
    const [getData, { loading }] = getTransactionItems(setTransactions);

    const [dateRange, setDateRange] = useState<[Date, Date]>([date, new Date()]);

    const makeApiCall = useCallback(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        if (transactionsCache.length > 0) return;
        makeApiCall();
    }, []);

    useEffect(() => {
        setTransactionsCache(transactions);
    }, [transactions]);

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

    //if (loading) return <Loader />;

    return (
        <div>
            <div className='flex justify-between'>
                <ReloadButton onClick={getData} />
                <DateRangePicker
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    setDateRange={setDateRange} />
            </div>
            {loading ?
                <Loader />
                :
                <div className='overflow-x-scroll hide-scroll-bar'>
                    <div className='w-[40rem] h-[20rem] m-4 md:mx-12'>
                        <Bar
                            height={800}
                            data={data}
                            options={options as any}
                        />
                    </div>
                </div>
            }
        </div>
    );
}
