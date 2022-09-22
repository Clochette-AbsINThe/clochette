import React, { useState, useEffect } from 'react';
import { ItemCount, ItemCountProps } from '@components/ItemCount';

interface GlassProps {
    items: ItemCountProps[]
    verreItem: ItemCountProps
    changeSubTotalPrice?: (price: number) => void
}

export default function Glass(props: GlassProps): JSX.Element {
    const [nbBoissons, setNbBoissons] = useState(props.items.map(() => 0));
    const [nbVerres, setNbVerres] = useState(0);
    const [subTotal, setSubTotal] = useState(0);

    function onValueChange(value: number, key: number): void {
        setNbBoissons(nbBoissons.map((v, i) => (i === key ? value : v)));
    }

    function onVerreChange(value: number): void {
        setNbVerres(value);
    }

    useEffect(() => {
        setSubTotal(nbBoissons.reduce((acc, v, i) => acc + v * props.items[i].price, 0) + (nbBoissons.reduce((a, b) => a + b, 0) + nbVerres) * props.verreItem.price);
    }, [nbBoissons, nbVerres]);

    useEffect(() => {
        props.changeSubTotalPrice?.(subTotal);
    }, [subTotal]);

    return (
        <div className="h-full flex flex-col border-2 rounded border-gray-800 dark:border-gray-300">
            {props.items.map((item, i) => (
                <ItemCount key={item.name} id={i} name={item.name} price={item.price} onValueChange={onValueChange} />
            ))}
            <div className='flex flex-col grow justify-end mt-[5rem]'>
                <ItemCount key={props.verreItem.name} name={props.verreItem.name} price={props.verreItem.price} value={nbBoissons.reduce((a, b) => a + b, 0)} image={props.verreItem.image} onValueChange={onVerreChange} />
            </div>
        </div>
    );
}
