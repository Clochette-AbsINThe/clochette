import Base from '@layouts/base';
import StackedCharts from '@components/Admin/Charts/StackedCharts';
import type { NextPage } from 'next';
import BarrelStat from '@components/Admin/Charts/BarrelStat';
import { ItemTransactionResponse, TransactionType } from '@types';
import Tabs from '@components/Admin/Dashboard/Tabs';

const StackedChartsPage: NextPage = () => {
    return (
        <Base
            title='Dashboard'
            description=''>
            <div className='flex md:flex-row flex-col flex-grow'>
                <Tabs />
                <div className='flex flex-col flex-grow'>
                    <h1 className='text-xl mb-2'>Quantité de verres vendus par fûts :</h1>
                    <BarrelStat />
                    <div className='grow'></div>
                    <div className='flex flex-wrap gap-4 justify-between'>
                        <div className='max-w-full'>
                            <h1 className='text-xl mb-2'>Nombre de ventes par jour :</h1>
                            <StackedCharts
                                groupByCallback={(item) => new Date(item.datetime).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                sortCallback={(a: string, b: string) => createDateFromString(a).getTime() - createDateFromString(b).getTime()}
                                queryFilter='te'
                            />
                        </div>
                        <div className='max-w-full'>
                            <h1 className='text-xl mb-2'>Nombre de ventes par heure :</h1>
                            <StackedCharts
                                groupByCallback={(item) => createSliceOf30Minutes(item)}
                                sortCallback={(a: string, b: string) => (a > b ? 1 : -1)}
                                queryFilter='te'
                            />
                        </div>
                    </div>
                    {/* <StackedCharts
                        groupByCallback={(item) => item.paymentMethod}
                        sortCallback={(a: string, b: string) => a.localeCompare(b)}
                        queryFilter='te'
                    /> */}
                </div>
            </div>
        </Base>
    );
};

export default StackedChartsPage;

function createDateFromString(dateString: string): Date {
    const day = parseInt(dateString.substring(0, 2));
    const month = parseInt(dateString.substring(3, 5));
    const year = parseInt(dateString.substring(6, 10));
    const hour = parseInt(dateString.substring(12, 14));
    return new Date(year, month - 1, day, hour);
}

function createSliceOf30Minutes(item: TransactionType<ItemTransactionResponse>): string {
    const date = new Date(item.datetime);
    const startHour = ('00' + date.getHours()).slice(-2);
    const startMinutes = date.getMinutes() >= 30 ? '30' : '00';

    const endDate = new Date(date.getTime() + 30 * 60000);
    const endHour = ('00' + endDate.getHours()).slice(-2);
    const endMinutes = endDate.getMinutes() >= 30 ? '30' : '00';

    return `${startHour}:${startMinutes} - ${endHour}:${endMinutes}`;
}
