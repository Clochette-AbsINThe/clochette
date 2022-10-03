import { useState, useEffect } from 'react';
import ItemCount from '@components/ItemCount';
import Loader from '@components/Loader';
import type { ItemTypes } from '@types';
import type { AxiosError } from 'axios';

export interface SaleProps {
    items: ItemTypes[]
    changeSubTotal: (nbItems: ItemTypes[]) => void
    loading: boolean
    error: AxiosError | null | undefined
}

export default function Sale(props: SaleProps): JSX.Element {
    const [items, setItems] = useState<ItemTypes[]>(props.items);

    function onValueChange(_value: number, _id: number): void {
        // Get the item where isGlass property is equal to true
        const itemGlass = props.items.find((item) => item.isGlass?.valueOf() === true) ?? { id: -1, name: '', price: 0, isGlass: false };
        const item = items.find((item) => item.id === _id) as ItemTypes;
        const increment = _value - item.value;
        const newNbItems = items.map((item) => {
            if (item.id === _id) {
                return {
                    ...item,
                    value: _value >= 0 ? _value : 0
                };
            } else if (item.id === itemGlass?.id) {
                return {
                    ...item,
                    value: (item.value + increment > 0) ? item.value + increment : 0
                };
            } else {
                return item;
            }
        });
        setItems(newNbItems);
    }

    useEffect(() => {
        props.changeSubTotal(items);
    }, [items]);

    useEffect(() => {
        setItems(props.items);
    }, [props.items]);

    return (
        <div className="h-full flex flex-col border-2 rounded border-gray-800 dark:border-gray-300">
            {props.loading && <Loader />}
            {props.error && <div className="text-red-500 text-center text-3xl">{props.error.message}</div>}
            {props.items.map((item) => (item.isGlass?.valueOf() === true)
                ? (
                    <div className='flex flex-col grow justify-end' key={item.id} aria-label='glass-div'>
                        <ItemCount {...item} onValueChange={onValueChange} />
                    </div>
                )
                : (
                    <ItemCount {...item} onValueChange={onValueChange} key={item.id} />
                )
            )}
        </div>
    );
}
