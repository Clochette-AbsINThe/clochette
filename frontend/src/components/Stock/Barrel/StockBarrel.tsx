import { getBarrels, getBarrelsDistincts, getBarrelsMounted, putBarrel } from '@proxies/StockProxies';
import { Barrel } from '@types';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@utils/utils';
import { BarrelMountedCard } from '@components/Stock/Barrel/BarrelMountedCard';
import { AddCard } from '@components/Stock/Barrel/AddCard';
import { BarrelStack } from '@components/Stock/Barrel/BarrelStack';
import Loader from '@components/Loader';

export default function StockBarrel(): JSX.Element {
    const [barrels, setBarrels] = useState<Barrel[]>([]);
    const [getBarrelData, { loading: loadingBarrel }] = getBarrels(setBarrels);

    const [mountedBarrels, setMountedBarrels] = useState<Barrel[]>([]);
    const [getBarrelMountedData, { loading: loadingBarrelMounted }] = getBarrelsMounted(setMountedBarrels);

    const [uniqueBarrels, setUniqueBarrels] = useState<Barrel[]>([]);
    const [getBarrelUniqueData, { loading: loadingBarrelUnique }] = getBarrelsDistincts(setUniqueBarrels);

    const makeApiCalls = useCallback((): void => {
        getBarrelData();
        getBarrelMountedData();
        getBarrelUniqueData();
    }, [getBarrelData, getBarrelMountedData, getBarrelUniqueData]);

    const [barrel, setBarrel] = useState<Barrel | null>(null);

    const [editBarrel] = putBarrel((data) => {
        if (data.status === 200) {
            const item = data.data as Barrel;
            toast.success(`${item.name} modifié avec succès !`);
        } else {
            const detail = getErrorMessage(data);
            toast.error(`Erreur lors de l'ajout de ${barrel?.name}. ${detail}`);
        }
        makeApiCalls();
    });

    const handleClicksMountedBarrel = (barrel: Barrel): void => {
        setBarrel(barrel);
        editBarrel(barrel);
    };

    const handleMountNewBarrel = (id: number): void => {
        const newBarrel = barrels.find((barrel) => barrel.id === id);
        if (newBarrel) {
            newBarrel.isMounted = true;
            setBarrel(newBarrel);
            editBarrel(newBarrel);
        }
    };

    useEffect(() => {
        makeApiCalls();
    }, []);

    return (
        <>
            <h2 className='text-2xl text-gray-500 dark:text-gray-100'>Fûts montés sur les tireuses</h2>
            <div className='flex flex-row px-5 gap-5 flex-wrap'>
                {loadingBarrelMounted ? (
                    <Loader />
                ) : (
                    <>
                        {mountedBarrels.map((mountedBarrel) => {
                            return (
                                <BarrelMountedCard
                                    barrel={mountedBarrel}
                                    key={mountedBarrel.id}
                                    editBarrel={handleClicksMountedBarrel}
                                />
                            );
                        })}
                        <AddCard handleMountNewBarrel={handleMountNewBarrel} />
                    </>
                )}
            </div>
            <h2 className='text-2xl text-gray-500 dark:text-gray-100'>Fûts en stock</h2>
            <div className='flex flex-row px-5 gap-5 flex-wrap'>
                {loadingBarrelUnique || loadingBarrel ? (
                    <Loader />
                ) : (
                    uniqueBarrels.map((uniqueBarrel) => (
                        <BarrelStack
                            barrels={barrels}
                            uniqueBarrel={uniqueBarrel}
                            key={uniqueBarrel.name}
                        />
                    ))
                )}
            </div>
        </>
    );
}
