import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, ChartData, PointElement } from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { useCallback, useEffect, useState } from 'react';
import { getTransactions, getTresory } from '@proxies/DashboardProxies';
import { ItemTransactionResponse, ITransactionType, TransactionType, Tresory } from '@types';
import { rainbowColors, groupBy, unique } from '@utils/utils';
import ReloadButton from './ReloadButton';
import { createDateFromString } from '@utils/date';

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

function groupByCallback(item: ITransactionType) {
    return new Date(item.datetime).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function sortCallback(a: string, b: string) {
    return createDateFromString(a).getTime() - createDateFromString(b).getTime();
}

function reducer(acc: number, transaction: ITransactionType, lydiaRate?: number) {
    // Vente
    if (transaction.sale === true) {
        if (transaction.paymentMethod === 'Lydia') {
            return acc + transaction.amount * (1 - (lydiaRate ?? 0));
        }
        return acc + transaction.amount;
    } else {
        return acc - transaction.amount;
    }
}

export default function TresoryChart() {
    // Those data are the list of all the transactions without the detail of the items
    const [allTransactions, setAllTransactions] = useState<ITransactionType[]>([]);
    const [getAllTransactionsData] = getTransactions(setAllTransactions);

    const [tresory, setTresory] = useState<Tresory>();
    const [getTresoryData] = getTresory(setTresory);

    const makeApiCall = useCallback(() => {
        getAllTransactionsData();
        getTresoryData();
    }, [getAllTransactionsData, getTresoryData]);

    useEffect(() => {
        makeApiCall();
    }, []);

    let dataset = groupBy(allTransactions, groupByCallback, sortCallback);

    const EspecesData = [0, ...Array.from(dataset.values()).map((transactions) => transactions.filter((transaction) => transaction.paymentMethod === 'Espèces').reduce(reducer, 0))];

    const CompteData = [0, ...Array.from(dataset.values()).map((transactions) => transactions.filter((transaction) => transaction.paymentMethod !== 'Espèces').reduce((acc, transaction) => reducer(acc, transaction, tresory?.lydiaRate ?? 1), 0))];

    const data: ChartData<'line'> = {
        labels: ['Init', ...Array.from(dataset.keys())],
        datasets: [
            {
                label: 'Montant espcèce',
                data: EspecesData.map((val, idx, arr) => (idx === 0 ? val : arr.slice(0, idx).reduce((a, b) => a + b, 0) + val)),
                borderColor: 'rgba(255, 99, 132, 1)',
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

    const data2: ChartData<'line'> = {
        labels: ['Init', ...Array.from(dataset.keys())],
        datasets: [
            {
                label: 'Montant compte',
                data: CompteData.map((val, idx, arr) => (idx === 0 ? val : arr.slice(0, idx).reduce((a, b) => a + b, 0) + val)),
                borderColor: 'rgba(54, 162, 235, 1)',
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
        <div className='flex flex-col'>
            <ReloadButton onClick={makeApiCall} />
            <div className='flex flex-wrap gap-4 justify-between'>
                <div className='max-w-full'>
                    <h1 className='text-xl mb-2 font-semibold'>Montant du compte en € :</h1>
                    <div className='overflow-x-scroll hide-scroll-bar'>
                        <div className='w-[40rem] h-[20rem] m-4 md:mx-12'>
                            <Line
                                height={800}
                                data={data2}
                                options={options as any}
                            />
                        </div>
                    </div>
                </div>
                <div className='max-w-full'>
                    <h1 className='text-xl mb-2 font-semibold'>Montant d&apos;espèces en € :</h1>
                    <div className='overflow-x-scroll hide-scroll-bar'>
                        <div className='w-[40rem] h-[20rem] m-4 md:mx-12'>
                            <Line
                                height={800}
                                data={data}
                                options={options as any}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
