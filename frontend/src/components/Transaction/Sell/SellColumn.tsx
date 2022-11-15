import ItemCount from '@components/Transaction/Sell/ItemCount';
import Loader from '@components/Loader';
import type { Consumable, Glass, ItemSell, OutOfStockItemSell } from '@types';
import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

export interface SellColumProps {
    items: ItemSell[];
    setItems: (nbItems: any) => void;
    loading: boolean;
    error: AxiosError | null | undefined;
}

export default function SellColumn(props: SellColumProps): JSX.Element {
    const [items, setItems] = useState<ItemSell[]>(props.items);

    /**
     * This function update the quantity of an item, by taking into account the EcoCup.
     * @param _value The new value of the item count
     * @param _item  The item to update
     */
    function onValueChange(_value: number, _item: Glass | OutOfStockItemSell | Consumable): void {
        if (_value < 0) return;
        const itemGlass = items.find((item) => item.item.name === 'EcoCup') ?? { id: -1, name: '', price: 0, value: 0 };
        const itemFound = items.find((item) => item.item === _item) as ItemSell;
        const increment = _value - itemFound.quantity;
        const maxQuantityForConsumable = itemFound.maxQuantity ?? Infinity;
        const newNbItems = items.map((item) => {
            if (item === itemFound) {
                return {
                    ...item,
                    quantity: _value <= maxQuantityForConsumable ? _value : (itemFound.maxQuantity as number)
                };
            } else if (item === itemGlass) {
                return {
                    ...item,
                    quantity: item.quantity + increment > 0 ? item.quantity + increment : 0
                };
            } else {
                return item;
            }
        });
        setItems(newNbItems);
    }

    /**
     * When the items change, we update the subtotal by calling the parent function.
     */
    useEffect(() => {
        props.setItems(items);
    }, [items]);

    /**
     * This function update the items list when the props change.
     */
    useEffect(() => {
        setItems(props.items);
    }, [props.items]);

    return (
        <div className='h-full flex flex-col border rounded border-gray-800 dark:border-gray-300'>
            {props.loading && <Loader />}
            {props.error && <div className='text-red-500 text-center text-3xl'>{props.error.message}</div>}
            {items.map((item, index) =>
                item.item.name === 'EcoCup' ? (
                    <div
                        className='flex flex-col grow justify-end'
                        key={index}
                        aria-label='glass-div'>
                        <ItemCount
                            item={item}
                            onValueChange={onValueChange}
                        />
                    </div>
                ) : (
                    <ItemCount
                        item={item}
                        onValueChange={onValueChange}
                        key={index}
                    />
                )
            )}
        </div>
    );
}
