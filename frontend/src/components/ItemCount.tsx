import { useState } from 'react';

export interface ItemCountProps {
    name: string
    price: number
}

export function ItemCount(props: ItemCountProps): JSX.Element {
    const [count, setCount] = useState(0);

    const resetHandler = (): void => {
        setCount(0);
    };

    const incrementMinusHandler = (): void => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    const incrementPlusHandler = (): void => {
        setCount(count + 1);
    };

    return (
        <div className="flex m-4 items-center h-max rounded-full bg-[#70707016] p-3 max-w-[30vw]">
            <button onClick={resetHandler}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 color-red">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <h1 className='grow text-3xl ml-5'>{props.name}</h1>
            <h2 className='mr-6 text-2xl'>{props.price}€</h2>
            <div className='flex pl-4 pr-4 border-2 rounded-full border-green-800'>
                <button onClick={incrementMinusHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <h3 className='p-3 text-3xl'>{count}</h3>
                <button onClick={incrementPlusHandler}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
