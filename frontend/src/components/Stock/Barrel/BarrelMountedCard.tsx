import { getIcon } from '@styles/utils';
import { Barrel } from '@types';

interface BarrelMountedCardProps {
    barrel: Barrel;
    editBarrel: (barrel: Barrel) => void;
}

export function BarrelMountedCard(props: BarrelMountedCardProps): JSX.Element {
    const { barrel, editBarrel } = props;

    const handleSetEmpty = () => {
        editBarrel({ ...barrel, empty: true, isMounted: false });
    };

    const handleSetUnmounted = () => {
        editBarrel({ ...barrel, isMounted: false });
    };

    return (
        <div className='flex h-60 w-40 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 border-gray-300 bg-[#70707016] border hover:border-gray-400 group focus:bg-black relative dark:border-gray-500'>
            <div
                className='absolute top-1 left-1 cursor-pointer text-gray-500 hover:text-gray-700'
                onClick={handleSetUnmounted}>
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
            <div className='flex flex-col p-4 items-center w-full space-y-2'>
                <h1 className='text-2xl font-semibold uppercase'>{barrel.name}</h1>
                {getIcon(barrel.icon, 'h-24 w-24 text-gray-500 dark:text-gray-100')}
                <h2 className='text-xl'>Vente {barrel.sellPrice}€</h2>
                <button
                    className='btn-danger'
                    onClick={handleSetEmpty}>
                    Fût vide
                </button>
            </div>
        </div>
    );
}
