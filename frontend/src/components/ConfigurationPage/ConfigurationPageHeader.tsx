import Loader from '@components/Loader';
import { Drink, ConsumableItem, OutOfStockItemBuy, OutOfStockItemSell } from '@types';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface ConfigurationPageHeaderProps {
    title: string;
    description: string;
    changeURLwithId: (id: number) => void;
    callbackQuery: (query: string) => void;
    loadingAllItems: boolean;
    displayItems: Array<Drink | ConsumableItem | OutOfStockItemBuy | OutOfStockItemSell>;
    children: JSX.Element;
}

export default function ConfigurationPageHeader(props: ConfigurationPageHeaderProps): JSX.Element {
    const { title, description, changeURLwithId, callbackQuery, loadingAllItems, displayItems, children } = props;
    const [query, setQuery] = useState('');

    useEffect(() => {
        callbackQuery(query);
    }, [query]);

    const topBar = (): JSX.Element => {
        return (
            <>
                <Link href='/configuration'>
                    <a className='btn-primary w-max flex space-x-2 cursor-pointer'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-6 h-6'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
                            />
                        </svg>
                        <span>Retour</span>
                    </a>
                </Link>
                <h1 className='text-2xl'>{title}</h1>
                <p>{description}</p>
                <div className='flex justify-between flex-wrap-reverse'>
                    <div className='w-full max-w-xs md:max-w-3xl mr-4'>
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
                                className='block p-2 w-full pl-10 shadow-md text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                                placeholder={'Rechercher '}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        className='btn-primary place-self-end mb-2'
                        onClick={() => changeURLwithId(-1)}>
                        Ajouter un produit
                    </button>
                </div>
            </>
        );
    };

    return (
        <div className='flex-grow p-3 flex flex-col space-y-8'>
            {topBar()}
            {loadingAllItems ? (
                <Loader />
            ) : (
                <>
                    {displayItems.length === 0 && <p className='text-2xl'>Aucun produit trouvé</p>}
                    <div className='grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,1fr))]'>{children}</div>
                </>
            )}
        </div>
    );
}
