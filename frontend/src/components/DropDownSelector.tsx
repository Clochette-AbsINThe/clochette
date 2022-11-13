import type { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';

import Loader from '@components/Loader';

import useOnClickOutside from '@hooks/useOnClickOutside';
import useOnEchap from '@hooks/useOnEchap';

import { getIcon } from '@styles/utils';
import type { ConsumableItem, Drink, OutOfStockItemBuy, TableData } from '@types';

interface DropDownSelectorProps {
    items: Array<Drink | OutOfStockItemBuy | ConsumableItem>;
    text: string;
    loading: boolean;
    error: AxiosError | null | undefined;
    handleModal: (item: Drink | OutOfStockItemBuy | ConsumableItem, table: TableData) => void;
    table: TableData;
}

export default function DropDownSelector(props: DropDownSelectorProps): JSX.Element {
    const [items, setItems] = useState<Array<Drink | OutOfStockItemBuy | ConsumableItem>>([]);
    const [isSelected, setIsSelected] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);

    /**
     * The base item created when we create a missing item
     */
    const missingItem: Drink | OutOfStockItemBuy | ConsumableItem = {
        id: -1,
        name: '',
        icon: 'Misc'
    };

    /**
     * This function is in charge of handling the click on the dropdown selector.
     */
    const toggle = (): void => {
        setIsSelected(!isSelected);
    };

    useOnClickOutside(ref, () => setIsSelected(false));
    useOnEchap(() => setIsSelected(false));

    /**
     * This is updating the items when the props change
     */
    useEffect(() => {
        setItems(props.items);
    }, [props.items]);

    /**
     * This is in charge of handling the search.
     */
    useEffect(() => {
        if (search === '') {
            setItems(props.items);
        } else {
            setItems(props.items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())));
        }
    }, [search]);

    /**
     * Custom render in case of loading, error, and 0 results
     */
    const renderItems = (): JSX.Element => {
        if (props.loading) {
            return <Loader />;
        } else if (props.error) {
            return <li className='text-red-500 text-center text-3xl'>{props.error.message}</li>;
        } else if (items.length === 0) {
            return (
                <li className='rounded hover:bg-gray-100 dark:hover:bg-gray-600 items-center'>
                    <div className='block px-4 py-2 text-xl capitalize'>Aucun résultat</div>
                </li>
            );
        } else {
            return <></>;
        }
    };

    return (
        <div
            className='flex m-2 items-center h-max rounded-xl bg-[#70707016] p-3 md:max-w-[33vw] max-w-full flex-wrap max-h-[88px] shadow-md'
            ref={ref}>
            <button
                className='btn-primary inline-flex items-center justify-between w-full my-2 text-xl lg:text-2xl'
                type='button'
                onClick={toggle}
                aria-label='dropdown-button'>
                <span className='whitespace-nowrap overflow-hidden'>{'Ajouter ' + props.text}</span>
                <svg
                    className='ml-2 w-4 h-4'
                    aria-hidden={!isSelected}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M19 9l-7 7-7-7'></path>
                </svg>
            </button>
            <div
                hidden={!isSelected}
                className={'z-10 w-full bg-white rounded shadow dark:bg-gray-700 md:max-w-[33vw] max-w-full ' + (isSelected ? 'block' : 'hidden')}>
                <div className='p-3'>
                    <label
                        htmlFor='input-group-search'
                        className='sr-only'>
                        Search
                    </label>
                    <div className='relative'>
                        <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                            <svg
                                className='w-5 h-5 text-gray-500 dark:text-gray-400'
                                aria-hidden='true'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    fillRule='evenodd'
                                    d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                                    clipRule='evenodd'></path>
                            </svg>
                        </div>
                        <input
                            type='text'
                            name='input-group-search'
                            aria-label='search'
                            className='block p-2 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                            placeholder={'Rechercher ' + props.text}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <ul className='overflow-y-auto px-3 pb-3 max-h-[370px] text-sm text-gray-700 dark:text-gray-200 w-full'>
                    {items.map((item) => (
                        <li
                            className='rounded hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center cursor-pointer p-2'
                            key={item.name}
                            onClick={() => {
                                props.handleModal(item, props.table);
                                setIsSelected(false);
                            }}
                            aria-label='dropdown-item'>
                            {item.icon && getIcon(item.icon, 'w-10 h-10 dark:text-white ml-2 text-black')}
                            <div className='block px-4 py-2 text-xl capitalize grow'>{item.name}</div>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1}
                                stroke='currentColor'
                                className='w-10 h-10'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
                                />
                            </svg>
                        </li>
                    ))}
                    {renderItems()}
                </ul>
                <button
                    className='flex items-center p-3 w-full text-sm font-medium rounded-b bg-gray-50 border-t border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 hover:underline'
                    onClick={() => {
                        props.handleModal(missingItem, props.table);
                        setIsSelected(false);
                    }}
                    aria-label='dropdown-missing-item'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-6 h-6 mr-5'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z'
                        />
                    </svg>
                    {'Ajouter ' + props.text + ' manquant'}
                </button>
            </div>
        </div>
    );
}
