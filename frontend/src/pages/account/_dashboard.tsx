import StackedCharts from '@components/Admin/Charts/StackedCharts';
import type { NextPage } from 'next';
import BarrelStat from '@components/Admin/Charts/BarrelTable';
import { createDateFromString, createSliceOf30Minutes } from '@utils/date';

const DashboardPage: NextPage = () => {
    return (
        <>
            <h1 className='text-xl mb-2'>Quantité de verres vendus par fûts :</h1>
            <BarrelStat />
            <div className='grow'></div>
            <div className='flex flex-wrap gap-4 justify-between'>
                <div className='max-w-full'>
                    <h1 className='text-xl mb-2'>Nombre de ventes par jour :</h1>
                    <StackedCharts
                        groupByCallback={(item) => new Date(item.datetime).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        sortCallback={(a: string, b: string) => createDateFromString(a).getTime() - createDateFromString(b).getTime()}
                    />
                </div>
                <div className='max-w-full'>
                    <h1 className='text-xl mb-2'>Nombre de ventes par heure :</h1>
                    <StackedCharts
                        groupByCallback={(item) => createSliceOf30Minutes(item)}
                        sortCallback={(a: string, b: string) => (a > b ? 1 : -1)}
                    />
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
