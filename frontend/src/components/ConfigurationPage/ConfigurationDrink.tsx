import Page404 from '@components/404';
import { addIdToUrl, ConfigurationPageHeader, getIdFromUrl, GoBackButton, removeIdFromUrl } from '@components/ConfigurationPage/ConfigurationPageBase';
import Loader from '@components/Loader';

import { deleteDrink, getDrinkById, getDrinks, postDrink, putDrink } from '@proxies/ConfigurationDrinkProxies';
import { getIcon } from '@styles/utils';
import type { Drink } from '@types';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ConfigurationDrink(): JSX.Element {
    const [id, setId] = useState<number | null>(null);
    const [query, setQuery] = useState('');

    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [getDrinksData, { loading: loadingGetAllDrinks }] = getDrinks(setDrinks);

    const displayDrinks = drinks.filter((drinkItem) => drinkItem.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));

    const [drink, setDrink] = useState<Drink>({ name: '' });
    const [getDrinkByIdData, { error: errorGetById, loading: loadingGetById }] = getDrinkById(setDrink);

    const makeApiCalls = (): void => {
        getDrinksData();
    };

    const changeURLwithId = (id: number): void => {
        addIdToUrl(id);
        setId(id);
    };

    const handleGoBack = (): void => {
        removeIdFromUrl();
        setId(null);
        setDrink({ name: '' });
        makeApiCalls();
    };

    const [postDrinkData] = postDrink((data) => {
        if (data.status === 200) {
            const item = data.data as Drink;
            toast.success(`${item.name} ajouté avec succès !`);
            changeURLwithId(item.id as number);
        } else {
            const { detail } = data.data as { detail: string };
            toast.error(`Erreur lors de l'ajout de ${drink.name}. ${detail}`);
        }
    });

    const [editDrinkData] = putDrink((data) => {
        if (data.status === 200) {
            const item = data.data as Drink;
            toast.success(`${item.name} modifié avec succès !`);
        } else {
            const { detail } = data.data as { detail: string };
            toast.error(`Erreur lors de la modification de ${drink.name}. ${detail}`);
        }
    });

    const [deleteDrinkData] = deleteDrink((data) => {
        if (data.status === 200) {
            const item = data.data as Drink;
            handleGoBack();
            toast.success(`${item.name} supprimé avec succès !`);
        } else {
            const { detail } = data.data as { detail: string };
            toast.error(`Erreur lors de la suppression de ${drink.name}. ${detail}`);
        }
    });

    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        if (id === -1) {
            postDrinkData({ name });
        } else {
            editDrinkData({ id: id as number, name });
        }
    };

    const onDelete = (): void => {
        deleteDrinkData(id as number);
    };

    useEffect(() => {
        setId(getIdFromUrl());
        makeApiCalls();
    }, []);


    useEffect(() => {
        if (id === null) return;
        if (id === -1) {
            setDrink({ name: '' });
        } else {
            getDrinkByIdData(id);
        }
    }, [id]);

    const homePage = (): JSX.Element => (
        <div className='flex-grow p-3 flex flex-col space-y-8'>
            <ConfigurationPageHeader
                title='Modification des boissons'
                description='Les boissons sont les produits achetés sous forme de fûts et revendu en verre.'
                changeURLwithId={changeURLwithId}
                callbackQuery={setQuery}
            />
            {loadingGetAllDrinks
                ? <Loader />
                : (
                    <>
                        {displayDrinks.length === 0 && <p className='text-2xl'>Aucun produit trouvé</p>}
                        <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,1fr))]">
                            {displayDrinks.map((drinkItem) => {
                                return (
                                    <div
                                        key={drinkItem.id}
                                        className='flex flex-col space-y-5 p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700'
                                    >
                                        <div className='flex justify-start items-center'>
                                            <div>{getIcon('Beer', 'w-8 h-8 dark:text-white ml-2 text-black')}</div>
                                            <div>{getIcon('Barrel', 'w-8 h-8 dark:text-white ml-2 text-black')}</div>
                                            <span className='text-center text-xl ml-4'>{drinkItem.name}</span>
                                        </div>
                                        <div className='flex grow justify-end space-x-5'>
                                            <button className='btn-primary' aria-label='edit' onClick={() => changeURLwithId(drinkItem.id as number)}>Editer</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
        </div>
    );

    const drinkItemPage = (): JSX.Element => {
        if (errorGetById?.response?.status === 404 && id !== -1) {
            return <Page404 />;
        } else if (loadingGetById) {
            return <Loader />;
        } else {
            return (
                <>
                    <h1 className="text-2xl mt-3">{id !== -1 ? 'Modification' : 'Ajout'} d&apos;une boisson :</h1>
                    {id !== -1 && (
                        <div className="flex justify-end mt-2">
                            <button className='btn-danger' onClick={onDelete}>Supprimer</button> {/* TODO Vérif car dangereux */}
                        </div>
                    )}
                    <form className="flex flex-col self-start space-y-4 p-4 grow w-full" onSubmit={onSubmit}>
                        <label htmlFor='name' className='text-2xl'>Nom :</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            aria-label='name'
                            className='input w-64'
                            required
                            defaultValue={drink.name}
                            onChange={(event) => setDrink({ ...drink, name: event.target.value })}
                        />
                        <div className="grow"></div>
                        <button type='submit' className='btn-primary' role='submit'>
                            {id !== -1 ? 'Modifier la boisson' : 'Ajouter la nouvelle boisson'}
                        </button>
                    </form>
                </>
            );
        }
    };

    return (
        <>
            <Toaster position='bottom-left' toastOptions={{ style: { maxWidth: 500 } }} />
            {id !== null
                ? (
                    <>
                        <GoBackButton handleGoBack={handleGoBack} />
                        {drinkItemPage()}
                    </>
                )
                : homePage()
            }
        </>
    );
}
