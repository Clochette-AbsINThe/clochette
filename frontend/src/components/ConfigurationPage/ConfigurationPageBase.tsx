import { useEffect, useState } from 'react';

export function GoBackButton({ handleGoBack }: { handleGoBack: () => void }): JSX.Element {
    return (
        <button onClick={handleGoBack} className='btn-primary w-max flex space-x-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Retourner à la page de sélection</span>
        </button>
    );
}

interface ConfigurationPageHeaderProps {
    title: string
    description: string
    changeURLwithId: (id: number) => void
    callbackQuery: (query: string) => void
}

export function ConfigurationPageHeader(props: ConfigurationPageHeaderProps): JSX.Element {
    const { title, description, changeURLwithId, callbackQuery } = props;
    const [query, setQuery] = useState('');

    useEffect(() => {
        callbackQuery(query);
    }, [query]);

    return (
        <>
            <h1 className="text-2xl">{title}</h1>
            <p>{description}</p>
            <div className="flex justify-between flex-wrap-reverse">
                <div className="w-full max-w-xs md:max-w-3xl mr-4">
                    <label htmlFor="input-group-search" className="sr-only">Search</label>
                    <div className="relative">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd">
                                </path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            name="input-group-search"
                            aria-label='search'
                            className="block p-2 w-full pl-10 shadow-md text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder={'Rechercher '}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
                <button className='btn-primary place-self-end mb-2' onClick={() => changeURLwithId(-1)}>
                    Ajouter un produit
                </button>
            </div>
        </>
    );
}


export const addIdToUrl = (id: number): void => {
    const url = new URL(window.location.href);
    url.searchParams.set('id', id.toString());
    window.history.pushState({}, '', url.href);
};

export const removeIdFromUrl = (): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url.href);
};

export const getIdFromUrl = (): number | null => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');
    if (id === null) return null;
    if ((/^(-|)[0-9]+$/).test(id)) return parseInt(id);
    return null;
};
