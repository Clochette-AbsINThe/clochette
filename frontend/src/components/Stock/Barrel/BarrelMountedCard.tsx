import PopupWindows from '@components/PopupWindows';
import { getIcon } from '@styles/utils';
import { Barrel } from '@types';
import { useRef, useState } from 'react';

interface BarrelMountedCardProps {
    barrel: Barrel;
    editBarrel: (barrel: Barrel) => void;
}

export function BarrelMountedCard(props: BarrelMountedCardProps): JSX.Element {
    const { barrel, editBarrel } = props;
    const [showPopup, setShowPopup] = useState(false);

    const [popupType, setPopupType] = useState<'empty' | 'modify'>('empty');

    const inputPriceRef = useRef<HTMLInputElement>(null);

    const handleClickEmpty = () => {
        setPopupType('empty');
        setShowPopup(true);
    };

    const handleClickUnmounted = () => {
        editBarrel({ ...barrel, isMounted: false });
    };

    const handleClickModify = () => {
        setPopupType('modify');
        setShowPopup(true);
    };

    const handleSubmitEmpty = () => {
        editBarrel({ ...barrel, empty: true, isMounted: false });
        setShowPopup(false);
    };

    const handleSubmitModify = () => {
        if (inputPriceRef.current) {
            editBarrel({ ...barrel, sellPrice: Number(inputPriceRef.current.value) });
        }
        setShowPopup(false);
    };

    return (
        <>
            <div className='flex bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 border-gray-300 bg-[#70707016] border hover:border-gray-400 group focus:bg-black relative dark:border-gray-500'>
                <div
                    className='absolute top-1 left-1 cursor-pointer text-gray-500 hover:text-gray-700'
                    onClick={handleClickUnmounted}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={2}
                        stroke='currentColor'
                        className='w-6 h-6'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M6 18L18 6M6 6l12 12'
                        />
                    </svg>
                </div>
                <div className='flex flex-col px-2 py-4 items-center w-full gap-1 mt-2'>
                    <h1 className='text-xl font-semibold uppercase [hyphens:_auto] text-center'>{barrel.name}</h1>
                    {getIcon(barrel.icon, 'h-24 w-24 text-gray-500 dark:text-gray-100')}
                    <h2 className='text-xl'>Vente {barrel.sellPrice}€</h2>
                    <div className='flex gap-4 mx-4 mt-4 flex-wrap'>
                        <button
                            className='btn-primary'
                            onClick={handleClickModify}>
                            Modifier
                        </button>
                        <button
                            className='btn-danger'
                            onClick={handleClickEmpty}>
                            Fût vide
                        </button>
                    </div>
                </div>
            </div>
            <PopupWindows
                open={showPopup}
                setOpen={setShowPopup}>
                <div className='flex flex-col gap-10 grow'>
                    <div>
                        {popupType === 'modify' && <h1 className='text-3xl font-bold mb-5'>Modifier le fût</h1>}
                        {popupType === 'empty' && <h1 className='text-3xl font-bold mb-5'>Décalrer le fût comme vide ?</h1>}
                    </div>
                    {popupType === 'modify' && (
                        <form
                            className='flex flex-col gap-10 grow'
                            onSubmit={handleSubmitModify}>
                            <div className='flex flex-row gap-5 items-center'>
                                {getIcon(barrel.icon, 'w-10 h-10 dark:text-white text-black')}
                                <label htmlFor='name'>Nom :</label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    aria-label='name'
                                    className='input w-64'
                                    value={barrel.name}
                                    readOnly
                                    disabled
                                />
                            </div>
                            <div className='flex flex-row gap-5 items-center'>
                                <label htmlFor='name'>Actuel prix de vente :</label>
                                <input
                                    type='number'
                                    id='name'
                                    className='input'
                                    value={barrel.sellPrice}
                                    disabled
                                    readOnly
                                />
                                <span>€</span>
                            </div>
                            <div className='flex flex-row gap-5 items-center'>
                                <label htmlFor='name'>Nouveau prix de vente (n&apos;inclut pas le prix de l&apos;écocup):</label>
                                <input
                                    type='number'
                                    id='name'
                                    className='input'
                                    min={0.01}
                                    step={0.01}
                                    required
                                    ref={inputPriceRef}
                                />
                                <span>€</span>
                            </div>
                            <div className='grow'></div>
                            <button
                                className='btn-primary'
                                type='submit'>
                                Modifier
                            </button>
                        </form>
                    )}
                    {popupType === 'empty' && (
                        <>
                            <div className='grow'></div>
                            <button
                                className='btn-danger'
                                onClick={handleSubmitEmpty}>
                                Valider
                            </button>
                        </>
                    )}
                </div>
            </PopupWindows>
        </>
    );
}
