import { useCallback, useEffect, useState } from 'react';

import DropDownSelector from '@components/Transaction/Buy/DropDownSelector';
import Form from '@components/Transaction/Buy/Form';
import { RecapItem } from '@components/Transaction/Buy/RecapItem';
import PopupWindows from '@components/PopupWindows';

import { getConsumables, getDrinks, getOutOfStocks } from '@proxies/BuyPageProxies';

import type { ConsumableItem, Drink, ItemBuy, OutOfStockItemBuy, TableData } from '@types';

interface BuyPageProps {
    changeSelectedItems: (nbItems: ItemBuy[]) => void;
    selectedItems: ItemBuy[];
}

/**
 * This function is in charge of displaying the buy page.
 * @param props The selected items based on Transaction.tsx and a function to update those items
 */
export default function BuyPage(props: BuyPageProps): JSX.Element {
    /**
     * This state is in charge of storing the barrels items
     */
    const [barrels, setBarrels] = useState<Drink[]>([]);
    const [getDataFuts, { loading: loadingFuts, error: errorFuts }] = getDrinks(setBarrels);

    /**
     * This state is in charge of storing the out of stocks items
     */
    const [outOfStocks, setOutOfStocks] = useState<OutOfStockItemBuy[]>([]);
    const [getDataHorsStocks, { loading: loadingExtras, error: errorExtras }] = getOutOfStocks(setOutOfStocks);

    /**
     * This state is in charge of storing the consumables items
     */
    const [consommables, setConsommables] = useState<ConsumableItem[]>([]);
    const [getDataConsommables, { loading: loadingConsommable, error: errorConsommable }] = getConsumables(setConsommables);

    /**
     * This state is in charge of storing the various data for the popup window.
     */
    const [popupWindowOpen, setPopupWindowOpen] = useState<boolean>(false);
    const [popUpItem, setPopUpItem] = useState<ItemBuy>();

    /**
     * This array sore all the items of the transaction.
     */
    const [selectedItems, setSelectedItems] = useState<ItemBuy[]>(props.selectedItems);

    const makeApiCalls = useCallback((): void => {
        getDataFuts();
        getDataHorsStocks();
        getDataConsommables();
    }, [getDataConsommables, getDataFuts, getDataHorsStocks]);

    /**
     * Initialization of the data, by calling the proxies.
     */
    useEffect(() => {
        makeApiCalls();
    }, []);

    useEffect(() => {
        if (loadingFuts || loadingExtras || loadingConsommable) return;
        const updatedItems = updateFkID(barrels, consommables, outOfStocks, selectedItems);
        props.changeSelectedItems(updatedItems);
    }, [barrels, consommables, outOfStocks]);

    useEffect(() => {
        setSelectedItems(props.selectedItems);
    }, [props.selectedItems]);

    /**
     * This function is in charge of handling the click on adding a new item.
     * @param item The item to add to the transaction
     * @param table The table the item belong to
     */
    const handleModalNew = (item: Drink | OutOfStockItemBuy | ConsumableItem, table: TableData): void => {
        setPopupWindowOpen(true);
        const newItem = createNewItem(item, table);
        setPopUpItem(newItem);
    };

    /**
     * This function is in charge of handling the click on editing an existing item.
     * @param item The item to edit in the transaction
     */
    const handleModalEdit = (item: ItemBuy): void => {
        setPopupWindowOpen(true);
        setPopUpItem(item);
    };

    /**
     * This function is closed when the modal is closed to update the popUp states.
     */
    const closePopUp = (): void => {
        setPopupWindowOpen(false);
        setPopUpItem(undefined);
    };

    /**
     * This function is called when the user click on the submit button in the modal.
     * @param data The data to add to the transaction
     */
    const onSubmit = (data: ItemBuy): void => {
        closePopUp();
        const newItems = [];
        const sameItem = selectedItems.find((item) => item.item.name === data.item.name && item.table === data.table);
        if (sameItem) {
            selectedItems.forEach((item) => {
                if (item === sameItem) {
                    newItems.push(data);
                } else {
                    newItems.push(item);
                }
            });
        } else {
            newItems.push(...selectedItems, data);
        }
        props.changeSelectedItems(updateFkID(barrels, consommables, outOfStocks, newItems));
    };

    const handleRemoveItem = (item: ItemBuy): void => {
        const newItems = selectedItems.filter((selectedItem) => selectedItem !== item);
        props.changeSelectedItems(updateFkID(barrels, consommables, outOfStocks, newItems));
    };

    return (
        <>
            <div
                className='md:grid-cols-3 flex-grow grid md:gap-2 gap-y-2 grid-cols-1'
                aria-label='window-achat'>
                <div className='h-full flex flex-col rounded border border-gray-800 dark:border-gray-300 p-1 justify-between'>
                    <div className='flex flex-col space-y-8'>
                        <h1 className='text-2xl font-bold'>Fûts :</h1>
                        <DropDownSelector
                            items={barrels}
                            text={'des fûts'}
                            loading={loadingFuts}
                            error={errorFuts}
                            handleModal={handleModalNew}
                            table={'barrel'}
                        />
                        <h1 className='text-2xl font-bold'>Consommables :</h1>
                        <DropDownSelector
                            items={consommables}
                            text={'des consommables'}
                            loading={loadingConsommable}
                            error={errorConsommable}
                            handleModal={handleModalNew}
                            table={'consumable'}
                        />
                        <h1 className='text-2xl font-bold'>Extras :</h1>
                        <DropDownSelector
                            items={outOfStocks}
                            text={'des extras'}
                            loading={loadingExtras}
                            error={errorExtras}
                            handleModal={handleModalNew}
                            table={'out_of_stock'}
                        />
                    </div>
                </div>
                <div className='col-span-2 border rounded border-gray-800 dark:border-gray-300 p-1'>
                    <h1 className='text-2xl font-bold'>Récapitulatif :</h1>
                    {selectedItems.map((item, index) => (
                        <RecapItem
                            key={index}
                            handleModalEdit={handleModalEdit}
                            item={item}
                            handleRemoveItem={handleRemoveItem}
                        />
                    ))}
                </div>
            </div>
            {popUpItem && (
                <PopupWindows
                    open={popupWindowOpen}
                    setOpen={(state) => !state && closePopUp()}>
                    <Form
                        item={popUpItem}
                        onSubmited={onSubmit}
                    />
                </PopupWindows>
            )}
        </>
    );
}

/**
 * This function create a new item that fit into the type ItemBuy
 * @param item The base item
 * @param table The table it belongs to
 * @returns A item suitable for the buy
 */
export function createNewItem(item: Drink | OutOfStockItemBuy | ConsumableItem, table: TableData): ItemBuy {
    switch (table) {
        case 'barrel':
            return {
                item: {
                    fkId: item.id as number,
                    name: item.name,
                    unitPrice: 0,
                    sellPrice: 0,
                    icon: 'Barrel',
                    empty: false
                },
                quantity: 1,
                table: 'barrel'
            };
        case 'out_of_stock':
            return {
                item: {
                    fkId: item.id as number,
                    name: item.name,
                    unitPrice: item.name === 'EcoCup' ? 1 : 0,
                    icon: (item as OutOfStockItemBuy).icon
                },
                quantity: 1,
                table: 'out_of_stock'
            };
        default:
            return {
                item: {
                    fkId: item.id as number,
                    name: item.name,
                    unitPrice: 0,
                    sellPrice: 0,
                    icon: (item as ConsumableItem).icon,
                    empty: false
                },
                quantity: 1,
                table: 'consumable'
            };
    }
}

export function updateFkID(barrels: Drink[], consommables: ConsumableItem[], outOfStocks: OutOfStockItemBuy[], selectedItems: ItemBuy[]): ItemBuy[] {
    const fakeBarrels = barrels.map((barrel) => createNewItem(barrel, 'barrel'));
    const fakeConsommables = consommables.map((consommable) => createNewItem(consommable, 'consumable'));
    const fakeOutOfStocks = outOfStocks.map((outOfStock) => createNewItem(outOfStock, 'out_of_stock'));
    const allItems = [...fakeBarrels, ...fakeConsommables, ...fakeOutOfStocks];
    return selectedItems.map((item) => {
        const newItem = allItems.find((i) => i.item.name === item.item.name && i.table === item.table && item.item.fkId === -1);
        if (newItem) {
            return {
                ...item,
                item: {
                    ...item.item,
                    fkId: newItem.item.fkId
                }
            };
        }
        return item;
    });
}
