import { getConsumables, getConsumablesDistincts, putConsumable } from '@proxies/StockProxies';
import { Consumable } from '@types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ConsumableStack } from '@components/Stock/Consumable/ConsumableStack';
import Loader from '@components/Loader';
import PopupWindows from '@components/PopupWindows';
import { getIcon } from '@styles/utils';

export default function StockConsumable(): JSX.Element {
    const [consumables, setConsumables] = useState<Consumable[]>([]);
    const [getConsumableData, { loading: loadingConsumable }] = getConsumables(setConsumables);

    const [uniqueConsumables, setUniqueConsumables] = useState<Consumable[]>([]);
    const [getConsumableUniqueData, { loading: loadingConsumableUnique }] = getConsumablesDistincts(setUniqueConsumables);

    const [consumableToEdit, setConsumableToEdit] = useState<Consumable>();
    const [putConsumableData, { loading: loadingPutConsumable }] = putConsumable();

    const inputPriceRef = useRef<HTMLInputElement>(null);
    const [openPopup, setOpenPopup] = useState(false);

    const makeApiCalls = useCallback((): void => {
        getConsumableData();
        getConsumableUniqueData();
    }, [getConsumableData, getConsumableUniqueData]);

    useEffect(() => {
        makeApiCalls();
    }, []);

    function onEditConsumable(consumable: Consumable): void {
        setOpenPopup(true);
        setConsumableToEdit(consumable);
    }

    function onEditConsumableSubmit(): void {
        if (consumableToEdit && inputPriceRef.current) {
            const consumablesOfType = consumables.filter((c) => c.name === consumableToEdit.name);
            consumablesOfType.forEach((c) => {
                c.sellPrice = Number(inputPriceRef.current!.value);
                putConsumableData(c);
            });

            setOpenPopup(false);
        }
    }

    return (
        <>
            <h2 className='text-2xl text-gray-500 dark:text-gray-100'>Consommables en stock</h2>
            <div className='flex flex-row px-5 gap-5 hide-scroll-bar overflow-x-scroll min-h-[19rem]'>
                {loadingConsumable || loadingConsumableUnique ? (
                    <Loader />
                ) : (
                    uniqueConsumables.map((uniqueConsumable) => {
                        return (
                            <ConsumableStack
                                consumables={consumables}
                                uniqueConsumable={uniqueConsumable}
                                key={uniqueConsumable.name}
                                onEdit={onEditConsumable}
                            />
                        );
                    })
                )}
            </div>
            {consumableToEdit && (
                <PopupWindows open={openPopup} setOpen={setOpenPopup}>
                    <div className='flex flex-col gap-10 grow'>
                        <h2 className='text-2xl text-gray-500 dark:text-gray-100'>Modifier le prix de vente du consommable</h2>
                        <div className='flex flex-row gap-5 items-center'>
                            {getIcon(consumableToEdit!.icon, 'w-10 h-10 dark:text-white text-black')}
                            <label htmlFor='name'>Nom :</label>
                            <input
                                type='text'
                                id='name'
                                name='name'
                                aria-label='name'
                                className='input w-64'
                                value={consumableToEdit?.name}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className='flex flex-row gap-5 items-center'>
                            <label htmlFor='name'>Actuel prix de vente :</label>
                            <input type='number' id='name' className='input' value={consumableToEdit?.sellPrice} disabled readOnly />
                            <span>€</span>
                        </div>
                        <div className='flex flex-row gap-5 items-center'>
                            <label htmlFor='name'>Nouveau prix de vente :</label>
                            <input type='number' id='name' className='input' ref={inputPriceRef} />
                            <span>€</span>
                        </div>
                        <div className="grow"></div>
                        <button className='btn-primary' disabled={loadingPutConsumable} onClick={onEditConsumableSubmit}>
                            Modifier
                        </button>
                    </div>
                </PopupWindows>
            )}
        </>
    );
}
