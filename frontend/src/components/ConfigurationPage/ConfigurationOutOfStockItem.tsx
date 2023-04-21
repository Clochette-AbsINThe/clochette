import { addIdToUrl, removeIdFromUrl, getErrorMessage, getIdFromUrl } from '@utils/utils';
import ConfigurationPageHeader from '@components/ConfigurationPage/ConfigurationPageHeader';
import ItemPageWrapper from '@components/ConfigurationPage/ItemPageWrapper';
import LayoutConfigurationPage from '@components/ConfigurationPage/LayoutConfigurationPage';

import { getOutOfStockItemById, getOutOfStockItems, postOutOfStockItem, putOutOfStockItem } from '@proxies/ConfigurationOutOfStockItemProxies';

import { getIcon } from '@styles/utils';
import type { OutOfStockItemBuy, OutOfStockItemSell } from '@types';

import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function ConfigurationOutOfStockItem(): JSX.Element {
    const [id, setId] = useState<number | null>(NaN);
    const [query, setQuery] = useState('');

    const sellPriceCheckbox = useRef<HTMLInputElement>(null);

    const [outOfStockItems, setOutOfStockItems] = useState<Array<OutOfStockItemBuy | OutOfStockItemSell>>([]);
    const [getOutOfStockItemsData, { loading: loadingAllOutOfStockItems }] = getOutOfStockItems(setOutOfStockItems);

    const displayOutOfStockItems = outOfStockItems.filter((outOfStockItem) => outOfStockItem.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));

    const [outOfStockItem, setOutOfStockItem] = useState<OutOfStockItemBuy | OutOfStockItemSell>({ name: '', icon: 'Misc', sellPrice: 0 });
    const [getOutOfStockItemByIdData, { error: errorGetById, loading: loadingGetById }] = getOutOfStockItemById(setOutOfStockItem);

    const makeApiCalls = useCallback((): void => {
        getOutOfStockItemsData();
    }, [getOutOfStockItemsData]);

    const changeURLwithId = (id: number): void => {
        addIdToUrl(id);
        setId(id);
    };

    const handleGoBack = (): void => {
        removeIdFromUrl();
        setId(null);
        setOutOfStockItem({ name: '', icon: 'Misc', sellPrice: 0 }); // Forced to reset the field because recat is not updating the field properly when creating new outOfStockItem
    };

    const [postOutOfStockItemData] = postOutOfStockItem((data) => {
        if (data.status === 200) {
            const item = data.data as OutOfStockItemBuy | OutOfStockItemSell;
            toast.success(`${item.name} ajouté avec succès !`);
            changeURLwithId(item.id as number);
        } else {
            const detail = getErrorMessage(data);
            toast.error(`Erreur lors de l'ajout de ${outOfStockItem.name}. ${detail}`);
        }
    });

    const [editOutOfStockItemData] = putOutOfStockItem((data) => {
        if (data.status === 200) {
            const item = data.data as OutOfStockItemBuy | OutOfStockItemSell;
            toast.success(`${item.name} modifié avec succès !`);
        } else {
            const detail = getErrorMessage(data);
            toast.error(`Erreur lors de la modification de ${outOfStockItem.name}. ${detail}`);
        }
    });

    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (id === -1) {
            postOutOfStockItemData(outOfStockItem);
        } else {
            editOutOfStockItemData({ id: id as number, ...outOfStockItem });
        }
    };

    const handleSellPriceChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = event.target;
        if (value === '') {
            setOutOfStockItem({ ...outOfStockItem, sellPrice: undefined });
        } else {
            setOutOfStockItem({ ...outOfStockItem, sellPrice: Number(value) });
        }
    };

    useEffect(() => {
        setId(getIdFromUrl());
    }, []);

    useEffect(() => {
        if (id === null) {
            makeApiCalls();
            return;
        }
        if (isNaN(id)) return; // Initial state = NaN, while id is not set, do nothing
        if (id === -1) {
            setOutOfStockItem({ name: '', icon: 'Misc', sellPrice: 0 }); // Set a default item without id attribute
        } else {
            getOutOfStockItemByIdData(id);
        }
    }, [id]);

    const homePage = (): JSX.Element => {
        return (
            <ConfigurationPageHeader
                title='Modification des produits hors stock'
                description="Les produits hors stock sont les produits qui n'apparaitrons pas dans la gestion des stocks comme les planchette de charcuterie."
                changeURLwithId={changeURLwithId}
                callbackQuery={setQuery}
                displayItems={displayOutOfStockItems}
                loadingAllItems={loadingAllOutOfStockItems}>
                <>
                    {displayOutOfStockItems.map((outOfStockItem) => (
                        <div
                            key={outOfStockItem.id}
                            className='flex flex-col space-y-5 p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700'>
                            <div className='flex justify-start items-center'>
                                <div>{getIcon(outOfStockItem.icon, 'w-8 h-8 dark:text-white ml-2 text-black')}</div>
                                <span className='text-center text-xl ml-4'>{outOfStockItem.name}</span>
                            </div>
                            <div className='flex grow justify-end space-x-5'>
                                {outOfStockItem.sellPrice !== undefined ? <div className='self-end pb-2 grow'>Vente à {outOfStockItem.sellPrice}€</div> : null}
                                <button
                                    className='btn-primary self-end'
                                    aria-label='edit'
                                    onClick={() => changeURLwithId(outOfStockItem.id as number)}>
                                    Editer
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            </ConfigurationPageHeader>
        );
    };

    const outOfStockItemPage = (): JSX.Element => {
        return (
            <ItemPageWrapper
                item={outOfStockItem}
                errorGetById={errorGetById}
                loadingGetById={loadingGetById}
                id={id}>
                <>
                    <h1 className='text-2xl mt-3'>{id !== -1 ? 'Modification' : 'Ajout'} d&apos;un produit hors stock :</h1>
                    <form
                        className='flex flex-col self-start space-y-4 p-4 grow w-full'
                        onSubmit={onSubmit}>
                        <label
                            htmlFor='name'
                            className='text-2xl'>
                            Nom :
                        </label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            aria-label='name'
                            className='input w-64'
                            required
                            defaultValue={outOfStockItem.name}
                            onChange={(event) => setOutOfStockItem({ ...outOfStockItem, name: event.target.value })}
                        />
                        <div className='text-2xl'>Type de produit :</div>
                        <div className='flex flex-col items-start flex-wrap space-y-2'>
                            <div className='flex space-x-4 items-center'>
                                <input
                                    type='radio'
                                    id='Food'
                                    name='icon'
                                    aria-label='icon-food'
                                    value='Food'
                                    className='checkbox'
                                    defaultChecked={outOfStockItem.icon === 'Food'}
                                    onChange={() => setOutOfStockItem({ ...outOfStockItem, icon: 'Food' })}
                                />
                                <label htmlFor='Food'>{getIcon('Food', 'w-10 h-10 dark:text-white text-black')}</label>
                            </div>
                            <div className='flex space-x-4 items-center'>
                                <input
                                    type='radio'
                                    id='Soft'
                                    name='icon'
                                    aria-label='icon-soft'
                                    value='Soft'
                                    className='checkbox'
                                    defaultChecked={outOfStockItem.icon === 'Soft'}
                                    onChange={() => setOutOfStockItem({ ...outOfStockItem, icon: 'Soft' })}
                                />
                                <label htmlFor='Soft'>{getIcon('Soft', 'w-10 h-10 dark:text-white text-black')}</label>
                            </div>
                            <div className='flex space-x-4 items-center'>
                                <input
                                    type='radio'
                                    id='Misc'
                                    name='icon'
                                    aria-label='icon-misc'
                                    value='Misc'
                                    className='checkbox'
                                    defaultChecked={outOfStockItem.icon === 'Misc'}
                                    onChange={() => setOutOfStockItem({ ...outOfStockItem, icon: 'Misc' })}
                                />
                                <label htmlFor='Misc'>{getIcon('Misc', 'w-10 h-10 dark:text-white text-black')}</label>
                            </div>
                            <div className='flex space-x-4 items-center'>
                                <input
                                    type='radio'
                                    id='Glass'
                                    name='icon'
                                    aria-label='icon-glass'
                                    value='Glass'
                                    className='checkbox'
                                    defaultChecked={outOfStockItem.icon === 'Glass'}
                                    onChange={() => setOutOfStockItem({ ...outOfStockItem, icon: 'Glass' })}
                                />
                                <label htmlFor='Glass'>{getIcon('Glass', 'w-10 h-10 dark:text-white text-black')}</label>
                            </div>
                        </div>
                        <div className='flex flex-col space-y-5'>
                            <label
                                htmlFor='sellPriceCheckbox'
                                className='text-2xl'>
                                Produit disponible à la vente ?
                            </label>
                            <div className='flex space-x-4 items-center'>
                                <input
                                    ref={sellPriceCheckbox}
                                    type='checkbox'
                                    id='sellPriceCheckbox'
                                    name='sellPriceCheckbox'
                                    aria-label='sellPriceCheckbox'
                                    className='checkbox w-6 h-6'
                                    defaultChecked={outOfStockItem.sellPrice !== undefined}
                                    onChange={(event) => {
                                        if (!event.target.checked) {
                                            setOutOfStockItem({ ...outOfStockItem, sellPrice: undefined });
                                        } else {
                                            setOutOfStockItem({ ...outOfStockItem, sellPrice: 0 });
                                        }
                                    }}
                                />
                                <label
                                    htmlFor='sellPrice'
                                    className='text-2xl'>
                                    Prix :
                                </label>
                                <input
                                    type='number'
                                    id='sellPrice'
                                    name='sellPrice'
                                    aria-label='sellPrice'
                                    className='input w-64'
                                    min={0}
                                    step={0.01}
                                    disabled={!sellPriceCheckbox.current?.checked && outOfStockItem.sellPrice === undefined}
                                    required
                                    value={outOfStockItem.sellPrice ?? ''}
                                    onChange={handleSellPriceChange}
                                />
                            </div>
                        </div>
                        <div className='grow'></div>
                        <button
                            type='submit'
                            className='btn-primary'
                            role='submit'>
                            {outOfStockItem.id === undefined ? 'Ajouter le nouveau produit hors stock' : 'Modifier le produit hors stock'}
                        </button>
                    </form>
                </>
            </ItemPageWrapper>
        );
    };

    return (
        <LayoutConfigurationPage
            id={id}
            homePage={homePage}
            itemPage={outOfStockItemPage}
            handleGoBack={handleGoBack}
        />
    );
}
