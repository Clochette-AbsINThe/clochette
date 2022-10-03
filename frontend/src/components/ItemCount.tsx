import { getIcon } from '@styles/utils';
import type { ItemTypes } from '@types';

export interface ItemCountProps extends ItemTypes {
    onValueChange: (value: number, key: number) => void
}

export default function ItemCount(props: ItemCountProps): JSX.Element {
    const resetHandler = (): void => {
        props.onValueChange(0, props.id);
    };

    const incrementMinusHandler = (): void => {
        props.onValueChange(props.value - 1, props.id);
    };

    const incrementPlusHandler = (): void => {
        props.onValueChange(props.value + 1, props.id);
    };

    return (
        <div className="flex m-4 items-center h-max rounded-xl bg-[#70707016] p-3 md:max-w-[33vw] max-w-full flex-wrap">
            <div className="flex flex-grow-[10] items-center">
                {props.icon && getIcon(props.icon, 'w-10 h-10 dark:text-white ml-2 text-black')}
                <h1 className='grow lg:text-3xl mx-5 text-xl'>{props.name}</h1>
                <h1 className='mr-6 text-2xl'>{props.price}€</h1>
            </div>
            <div className="flex flex-grow justify-end mt-2">
                <div className='flex pl-4 pr-4 border-2 rounded-full border-green-800'>
                    <button onClick={incrementMinusHandler} aria-label='minus'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <h3 className='p-3 text-3xl'>{props.value}</h3>
                    <button onClick={incrementPlusHandler} aria-label='plus'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
                <button onClick={resetHandler} className='ml-3' aria-label='reset'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
