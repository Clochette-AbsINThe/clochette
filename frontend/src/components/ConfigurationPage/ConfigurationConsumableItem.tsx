import Page404 from '@components/404';
import { addIdToUrl, ConfigurationPageHeader, getIdFromUrl, GoBackButton, removeIdFromUrl } from '@components/ConfigurationPage/ConfigurationPageBase';
import Loader from '@components/Loader';

import { deleteConsumableItem, getConsumableItemById, getConsumableItems, postConsumableItem, putConsumableItem } from '@proxies/ConfigurationConsumableItemProxies';
import { getIcon } from '@styles/utils';
import type { ConsumableItem, IconName } from '@types';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ConfigurationConsumableItem(): JSX.Element {
    const [id, setId] = useState<number | null>(null);
    const [query, setQuery] = useState('');

    const [consumableItems, setConsumableItems] = useState<ConsumableItem[]>([]);
    const [getConsumablesItemsData, { loading: loadingGetAllConsumableItems }] = getConsumableItems(setConsumableItems);

    const displayConsumableItems = consumableItems.filter((consumableItem) => consumableItem.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));

    const [consumableItem, setConsumableItem] = useState<ConsumableItem>({ name: '', icon: 'Misc' });
    const [getConsumableItemByIdData, { error: errorGetById, loading: loadingGetById }] = getConsumableItemById(setConsumableItem);

    const makeApiCalls = (): void => {
        getConsumablesItemsData();
    };

    const changeURLwithId = (id: number): void => {
        addIdToUrl(id);
        setId(id);
    };

    const handleGoBack = (): void => {
        removeIdFromUrl();
        setId(null);
        setConsumableItem({ name: '', icon: 'Misc' });
        makeApiCalls();
    };

    const [postConsumableItemData] = postConsumableItem((data) => {
        if (data.status === 200) {
            const item = data.data as ConsumableItem;
            toast.success(`${item.name} ajouté avec succès !`);
            changeURLwithId(item.id as number);
        } else {
            const { detail } = data.data as { detail: string };
            toast.error(`Erreur lors de l'ajout de ${consumableItem.name}. ${detail}`);
        }
    });

    const [editConsumableItemData] = putConsumableItem((data) => {
        if (data.status === 200) {
            const item = data.data as ConsumableItem;
            toast.success(`${item.name} modifié avec succès !`);
        } else {
            const { detail } = data.data as { detail: string };
            toast.error(`Erreur lors de la modification de ${consumableItem.name}. ${detail}`);
        }
    });

    const [deleteConsumabelItemData] = deleteConsumableItem((data) => {
        if (data.status === 200) {
            const item = data.data as ConsumableItem;
            handleGoBack();
            toast.success(`${item.name} supprimé avec succès !`);
        } else {
            const { detail } = data.data as { detail: string };
            toast.error(`Erreur lors de la suppression de ${consumableItem.name}. ${detail}`);
        }
    });

    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const icon = formData.get('icon') as IconName;
        if (id === -1) {
            postConsumableItemData({ name, icon });
        } else {
            editConsumableItemData({ id: id as number, name, icon });
        }
    };

    const onDelete = (): void => {
        deleteConsumabelItemData(id as number);
    };

    useEffect(() => {
        setId(getIdFromUrl());
        makeApiCalls();
    }, []);


    useEffect(() => {
        if (id === null) return;
        if (id === -1) {
            setConsumableItem({ name: '', icon: 'Misc' });
        } else {
            getConsumableItemByIdData(id);
        }
    }, [id]);

    const homePage = (): JSX.Element => {
        return (
            <div className='flex-grow p-3 flex flex-col space-y-8'>
                <ConfigurationPageHeader
                    title='Modification des produits consommables'
                    description='Les produits consommables sont les produits qui sont vendus sous la même forme qu&apos;ils sont acheté, comme par exemple les softs où les pizzas.'
                    changeURLwithId={changeURLwithId}
                    callbackQuery={setQuery}
                />
                {loadingGetAllConsumableItems
                    ? <Loader />
                    : (
                        <>
                            {displayConsumableItems.length === 0 && <p className='text-2xl'>Aucun produit trouvé</p>}
                            <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(250px,1fr))]">
                                {displayConsumableItems.map((consumableItem) => {
                                    return (
                                        <div
                                            key={consumableItem.id}
                                            className='flex flex-col space-y-5 p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700'
                                        >
                                            <div className='flex justify-start items-center space-x-5'>
                                                <div>{getIcon(consumableItem.icon, 'w-10 h-10 dark:text-white ml-2 text-black')}</div>
                                                <span className='text-center text-xl'>{consumableItem.name}</span>
                                            </div>
                                            <div className='flex grow justify-end space-x-5'>
                                                <button className='btn-primary' onClick={() => changeURLwithId(consumableItem.id as number)} aria-label='edit'>Editer</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
            </div>
        );
    };

    const consumableItemPage = (): JSX.Element => {
        if (errorGetById?.response?.status === 404 && id !== -1) {
            return <Page404 />;
        } else if (loadingGetById || !consumableItem) {
            return <Loader />;
        } else {
            return (
                <>
                    <h1 className="text-2xl mt-3">{id !== -1 ? 'Modification' : 'Ajout'} d&apos;un produit consommable :</h1>
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
                            defaultValue={consumableItem.name}
                            onChange={(event) => setConsumableItem({ ...consumableItem, name: event.target.value })}
                        />
                        <div className='text-2xl'>Type de produit :</div>
                        <div className="flex flex-col items-start flex-wrap space-y-2">
                            <div className='flex space-x-4 items-center'>
                                <input
                                    type="radio"
                                    id='Food'
                                    name="icon"
                                    aria-label='icon-food'
                                    value='Food'
                                    className='checkbox'
                                    defaultChecked={consumableItem.icon === 'Food'}
                                    onChange={() => setConsumableItem({ ...consumableItem, icon: 'Food' })}
                                />
                                <label htmlFor="Food">{getIcon('Food', 'w-10 h-10 dark:text-white text-black')}</label>
                            </div>
                            <div className='flex space-x-4 items-center'>
                                <input
                                    type="radio"
                                    id='Soft'
                                    name="icon"
                                    aria-label='icon-soft'
                                    value='Soft'
                                    className='checkbox'
                                    defaultChecked={consumableItem.icon === 'Soft'}
                                    onChange={() => setConsumableItem({ ...consumableItem, icon: 'Soft' })}
                                />
                                <label htmlFor="Soft">{getIcon('Soft', 'w-10 h-10 dark:text-white text-black')}</label>
                            </div>
                            <div className='flex space-x-4 items-center'>
                                <input
                                    type="radio"
                                    id='Misc'
                                    name="icon"
                                    aria-label='icon-misc'
                                    value='Misc'
                                    className='checkbox'
                                    defaultChecked={consumableItem.icon === 'Misc'}
                                    onChange={() => setConsumableItem({ ...consumableItem, icon: 'Misc' })}
                                />
                                <label htmlFor='Misc'>{getIcon('Misc', 'w-10 h-10 dark:text-white text-black')}</label>
                            </div>
                        </div>
                        <div className="grow"></div>
                        <button type='submit' className='btn-primary' role='submit'>
                            {consumableItem.id === undefined
                                ? 'Ajouter le nouveau consommable'
                                : 'Modifier le consommable'}
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
                        {consumableItemPage()}
                    </>
                )
                : homePage()
            }
        </>
    );
}
