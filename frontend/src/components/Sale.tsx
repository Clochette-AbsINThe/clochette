import { useState, useEffect } from 'react';
import { ItemCount } from '@components/ItemCount';
import type { ItemTypes } from '@components/Transaction';
import Loader from './Loader';

interface SaleProps {
    items: ItemTypes[]
    changeSubTotal: (nbItems: ItemTypes[]) => void
    loading: boolean
}

export default function Sale(props: SaleProps): JSX.Element {
    const [items, setItems] = useState<ItemTypes[]>(props.items);

    useEffect(() => {
        if (props.items.toString() !== items.toString()) {
            setItems(props.items);
        }
    }, [props.items]);

    function onValueChange(_value: number, _id: number): void {
        // Get the item where isGlass property is equal to true
        const itemGlass = props.items.find((item) => item.isGlass?.valueOf() === true) ?? { id: -1, name: '', price: 0, isGlass: false };
        const item = items.find((item) => item.id === _id) ?? null;
        const increment = _value - (item ?? { value: 0 }).value;
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

    return (
        <div className="h-full flex flex-col border-2 rounded border-gray-800 dark:border-gray-300">
            {props.loading
                ? (<Loader />)
                : (
                    props.items.map((item) => (
                        (item.isGlass?.valueOf() === true)
                            ? (<div className='flex flex-col grow justify-end' key={item.id}>
                                <ItemCount key={item.id} id={item.id} name={item.name} price={item.price} onValueChange={onValueChange} value={item.value} image={item.image} />
                            </div>)
                            : (<ItemCount
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                onValueChange={onValueChange}
                                value={item.value}
                                image={item.image}
                            />)
                    ))
                )}
        </div>
    );
}
