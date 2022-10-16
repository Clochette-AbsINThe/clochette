import { useEffect, useState } from 'react';

import DropDownSelector from '@components/DropDownSelector';
import Form from '@components/Form';
import Loader from '@components/Loader';
import PopupWindows from '@components/PopupWindows';

import { getConsumables, getDrinks, getEcoCup, getOutOfStocks } from '@proxies/BuyPageProxies';

import { getIcon } from '@styles/utils';
import type { ConsumableItem, Drink, ItemBuy, OutOfStockItemBuy, TableData } from '@types';


interface BuyPageProps {
    changeSelectedItems: (nbItems: ItemBuy[]) => void
    selectedItems: ItemBuy[]
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
     * This state is in charge of storing the eco cup item
     */
    const [ecoCup, setEcoCup] = useState<OutOfStockItemBuy>();
    const [getDataEcoCup, { loading: loadingEcoCup, error: errorEcoCup }] = getEcoCup(setEcoCup);

    /**
     * This state is in charge of storing the various data for the popup window.
     */
    const [popUp, setPopUp] = useState<boolean>(false);
    const [popUpItem, setPopUpItem] = useState<ItemBuy>();

    /**
     * This array sore all the items of the transaction.
     */
    const [selectedItems, setSelectedItems] = useState<ItemBuy[]>(props.selectedItems);

    /**
     * Initialization of the data, by calling the proxies.
     */
    useEffect(() => {
        getDataFuts();
        getDataHorsStocks();
        getDataConsommables();
        getDataEcoCup();
    }, []);

    useEffect(() => {
        props.changeSelectedItems(selectedItems);
    }, [selectedItems]);

    /**
     * This function is in charge of handling the click on adding a new item.
     * @param item The item to add to the transaction
     * @param table The table the item belong to
     */
    const handleModal = (item: Drink | OutOfStockItemBuy | ConsumableItem, table: TableData): void => {
        setPopUp(true);
        const newItem = createNewItem(item, table);
        setPopUpItem(newItem);
    };

    /**
     * This function is in charge of handling the click on editing an existing item.
     * @param item The item to edit in the transaction
     */
    const handleModalEdit = (item: ItemBuy): void => {
        setPopUp(true);
        setPopUpItem(item);
    };

    /**
     * Thios function is closed when the modal is closed to update the popUp states.
     */
    const closePopUp = (): void => {
        setPopUp(false);
        setPopUpItem(undefined);
    };

    /**
     * This function is called when the user click on the submit button in the modal.
     * @param data The data to add to the transaction
     */
    const onSubmit = (data: ItemBuy): void => {
        closePopUp();
        const sameItem = selectedItems.find((item) => item.item.fkID === data.item.fkID && item.table === data.table);
        if (sameItem) {
            const newItems = selectedItems.map((item) => {
                if (item === sameItem) {
                    return data;
                } else {
                    return item;
                }
            });
            setSelectedItems(newItems);
        } else {
            setSelectedItems([...selectedItems, data]);
        }
    };

    return (
        <>
            <div className="md:grid-cols-3 flex-grow grid md:gap-2 gap-y-2 grid-cols-1" aria-label='window-achat'>
                <div className='h-full flex flex-col border-2 rounded border-gray-800 dark:border-gray-300 p-1 justify-between'>
                    <div className='flex flex-col'>
                        <h1 className='text-2xl font-bold'>Fûts :</h1>
                        <DropDownSelector
                            items={barrels}
                            text={'des fûts'}
                            loading={loadingFuts}
                            error={errorFuts}
                            handleModal={handleModal}
                            table={'barrel'}
                        />
                        <h1 className='text-2xl font-bold'>Consommables :</h1>
                        <DropDownSelector
                            items={consommables}
                            text={'des consommables'}
                            loading={loadingConsommable}
                            error={errorConsommable}
                            handleModal={handleModal}
                            table={'consumable'}
                        />
                        <h1 className='text-2xl font-bold'>Extras :</h1>
                        <DropDownSelector
                            items={outOfStocks}
                            text={'des extras'}
                            loading={loadingExtras}
                            error={errorExtras}
                            handleModal={handleModal}
                            table={'outofstock'}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <h1 className='text-2xl font-bold'>Rendu caution Ecocup :</h1>
                        {errorEcoCup && <p className='text-red-500'>Erreur lors du chargement de l&apos;écocup</p>}
                        {loadingEcoCup && <Loader />}
                        {ecoCup &&
                            <div className="flex m-4 items-center h-max rounded-xl bg-[#70707016] p-3 md:max-w-[33vw] max-w-full flex-wrap">
                                <div className="flex flex-grow-[10] items-center">
                                    {ecoCup.icon && getIcon(ecoCup.icon, 'w-10 h-10 dark:text-white ml-2 text-black')}
                                    <h1 className='grow lg:text-3xl mx-5 text-xl'>{ecoCup.name}</h1>
                                    <h1 className='mr-6 text-2xl'>1€</h1>
                                </div>
                                <div className="flex flex-grow justify-end self-center cursor-pointer">
                                    <button onClick={() => handleModal(ecoCup, 'outofstock')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className='col-span-2 border-2 rounded border-gray-800 dark:border-gray-300 p-1'>
                    <h1 className='text-2xl font-bold'>Récapitulatif :</h1>
                    {selectedItems.map((item, index) => <RecapItem key={index} handleModalEdit={handleModalEdit} item={item} />)}
                </div>
            </div>
            {popUpItem &&
                <PopupWindows onOpen={popUp} callback={(state) => !state && closePopUp()}>
                    <Form item={popUpItem} onSubmited={onSubmit} />
                </PopupWindows>
            }
        </>
    );
}


interface RecapItemProps {
    item: ItemBuy
    handleModalEdit: (item: ItemBuy) => void
};

export function RecapItem(props: RecapItemProps): JSX.Element {
    const { item, handleModalEdit } = props;
    return (
        <div className="flex m-4 justify-center h-max rounded-xl bg-[#70707016] p-3 md:max-w-[66vw] max-w-full flex-wrap flex-col" key={item.item.name}>
            <div className="flex flex-grow-[10] items-start">
                {getIcon(item.item.icon, 'w-10 h-10 dark:text-white mr-2 text-black')}
                <h1 className='grow lg:text-3xl mx-5 text-xl'>{item.item.name}</h1>
                <button onClick={() => handleModalEdit(item)} className='btn-primary'>Edit</button>
            </div>
            <div className="flex flex-grow">
                <h1 className='mr-6 text-xl'>Nombre: {item.quantity}</h1>
                <h1 className='mr-6 text-xl'>Prix total: {item.item.unitPrice * item.quantity}€</h1>
                {item.item.sellPrice !== undefined && <h1 className='mr-6 text-xl'>Prix vente: {item.item.sellPrice}€</h1>}
            </div>
        </div>
    );
}

/**
 * This function create a new item that fit into the type ItemBuy
 * @param item The base item
 * @param table The table it belongs to
 * @returns A item suitable for the buy
 */
function createNewItem(item: Drink | OutOfStockItemBuy | ConsumableItem, table: TableData): ItemBuy {
    switch (table) {
        case 'barrel':
            return {
                item: {
                    fkID: item.id as number,
                    name: item.name,
                    unitPrice: 0,
                    sellPrice: 0,
                    icon: 'Barrel'
                },
                quantity: 1,
                table: 'barrel'
            };
        case 'outofstock':
            return {
                item: {
                    fkID: item.id as number,
                    name: item.name,
                    unitPrice: (item.name === 'EcoCup' ? 1 : 0),
                    sellPrice: undefined as unknown as number,
                    icon: (item as OutOfStockItemBuy).icon
                },
                quantity: 1,
                table: 'outofstock'
            };
        default:
            return {
                item: {
                    fkID: item.id as number,
                    name: item.name,
                    unitPrice: 0,
                    sellPrice: 0,
                    icon: (item as ConsumableItem).icon
                },
                quantity: 1,
                table: 'consumable'
            };
    }
}
