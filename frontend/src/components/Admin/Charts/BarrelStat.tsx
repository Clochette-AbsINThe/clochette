import Loader from '@components/Loader';
import { getBarrelsStat } from '@proxies/DashboardProxies';
import { IBarrelStatProps } from '@types';
import { useCallback, useEffect, useState } from 'react';
import ReloadButton from './ReloadButton';

export default function BarrelStat() {
    const [barrelsStat, setBarrelsStat] = useState<IBarrelStatProps[]>([]);
    const [getBarrelsData, { loading }] = getBarrelsStat(setBarrelsStat);

    const makeApiCall = useCallback(() => {
        getBarrelsData();
    }, [getBarrelsData]);

    useEffect(() => {
        makeApiCall();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className='flex flex-col'>
            <ReloadButton onClick={makeApiCall} />
            <div className='overflow-x-scroll hide-scroll-bar shadow-md rounded-2xl m-4 md:mx-12'>
                <table className='table-auto w-full'>
                    <thead>
                        <tr className='bg-gray-300 dark:bg-gray-700'>
                            <th className='border-y border-l px-4 py-2 text-start w-0'>Id</th>
                            <th className='border-y px-4 py-2 text-start'>Nom</th>
                            <th className='border-y px-4 py-2 text-start'>Etat</th>
                            <th className='border-y px-4 py-2 text-start'>Prix achat</th>
                            <th className='border-y px-4 py-2 text-start'>Nombre de verres vendus</th>
                            <th className='border-y px-4 py-2 text-start'>Prix total de vente</th>
                            <th className='border-y border-r px-4 py-2 text-start'>Bilan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {barrelsStat.map((barrel) => (
                            <tr
                                key={barrel.id}
                                className={'border-y ' + (!barrel.isMounted ? 'bg-gray-200 dark:bg-gray-800' : '')}>
                                <td className='px-4 py-2 border-b border-l'>{barrel.id}</td>
                                <td className={(!barrel.isMounted ? ' line-through ' : '') + 'px-4 py-2 border-b'}>{barrel.name}</td>
                                <td className='px-4 py-2 border-b'>{barrel.empty ? 'Vide' : 'Monté sur une tireuse'}</td>
                                <td className='px-4 py-2 border-b'>
                                    <span className='font-bold'>{barrel.unitPrice} €</span>
                                </td>
                                <td className='px-4 py-2 border-b'>{barrel.glassForBarrel.length}</td>
                                <td className='px-4 py-2 border-b'>
                                    <span className='font-bold'>{barrel.glassForBarrel.length * barrel.sellPrice} €</span>
                                </td>
                                <td className='px-4 py-2 border-b border-r text-start'>
                                    <div className='flex justify-between'>
                                        {barrel.unitPrice < barrel.glassForBarrel.length * barrel.sellPrice ? (
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                                stroke='currentColor'
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                className='text-green-600 h-4 w-4'>
                                                <polyline points='23 6 13.5 15.5 8.5 10.5 1 18'></polyline>
                                                <polyline points='17 6 23 6 23 12'></polyline>
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                viewBox='0 0 24 24'
                                                fill='none'
                                                stroke='currentColor'
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                className='text-red-600 h-4 w-4'>
                                                <polyline points='23 18 13.5 8.5 8.5 13.5 1 6'></polyline>
                                                <polyline points='17 18 23 18 23 12'></polyline>
                                            </svg>
                                        )}
                                        <span className='font-bold ml-2 whitespace-nowrap'>{barrel.glassForBarrel.length * barrel.sellPrice - barrel.unitPrice} €</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
