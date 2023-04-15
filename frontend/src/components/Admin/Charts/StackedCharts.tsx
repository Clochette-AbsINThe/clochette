import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { useCallback, useEffect, useState } from 'react';
import { getTransactionItem, getTransactionItems, getTransactions } from '@proxies/DashboardProxies';
import { ItemTransactionResponse, ITransactionType, TransactionType } from '@types';
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
            position: 'right'
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

    const [transactions, setTransactions] = useState<Array<TransactionType<ItemTransactionResponse>>>([]);
    const setter = (item: TransactionType<ItemTransactionResponse>) => {
        if (!transactionsCache.has(item.id!)) {
            setTransactionsCache((old) => {
                const newMap = new Map(old);
                newMap.set(item.id!, item);
                return newMap;
            });
        }
        if (transactions.some((transaction) => transaction.id === item.id)) return;
        if (item.sale === false) return;
        setTransactions((old) => [...old, item]);
    };
    const [getTransactionData] = getTransactionItem(setter);

    // Those data are the list of all the transactions without the detail of the items
    const [allTransactions, setAllTransactions] = useState<ITransactionType[]>([]);
    const [getAllTransactionsData] = getTransactions(setAllTransactions);

    const [names, setNames] = useState<string[]>([]);
    const [dataset, setDataset] = useState<Map<K, Array<TransactionType<ItemTransactionResponse>>>>(new Map());

    useEffect(() => {
        setNames(
            transactions
                .map((item) => item.items.map((item) => item.item.name))
                .flat()
                .filter(unique)
        );

        setDataset(groupBy(transactions, groupByCallback, sortCallback));
    }, [transactions]);

    const [dateRange, setDateRange] = useState<[Date, Date]>([date, new Date()]);

    const makeApiCall = useCallback(() => {
        const startDate = new Date(dateRange[0].toISOString());
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateRange[1].toISOString());
        endDate.setHours(23, 59, 59, 999);
        getAllTransactionsData({ datetime__gt: startDate.toISOString(), datetime__lt: endDate.toISOString() });
    }, [getAllTransactionsData]);

    useEffect(() => {
        setTransactions([]);
        allTransactions.forEach((transaction) => {
            if (transaction.sale === false) return;
            if (transactionsCache.has(transaction.id!)) {
                setTransactions((old) => [...old, transactionsCache.get(transaction.id!)!]);
            } else {
                // Need to refresh the cache
                getTransactionData(transaction.id!);
            }
        });
    }, [allTransactions]);

    useEffect(() => {
        makeApiCall();
    }, [dateRange]);

    const data: ChartData<'bar'> = {
        labels: Array.from(dataset.keys()),
        datasets: names.sort().map((name, index) => {
            return {
                label: name,
                data: Array.from(dataset.values()).map((transactionArrayForAGivenFilter) =>
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

    return (
        <div>
            <div className='flex justify-between flex-wrap'>
                <ReloadButton onClick={makeApiCall} />
                <DateRangePicker
                    startDate={dateRange[0]}
                    endDate={dateRange[1]}
                    setDateRange={setDateRange}
                />
            </div>
            <div className='overflow-x-scroll hide-scroll-bar'>
                <div className='w-[40rem] h-[20rem] m-4 md:mx-12'>
                    <Bar
                        height={800}
                        data={data}
                        options={options as any}
                    />
                </div>
            </div>
        </div>
    );
}
