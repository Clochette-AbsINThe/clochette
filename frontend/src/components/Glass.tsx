import React, { useState, useEffect } from 'react';
import { ItemCount, ItemCountProps } from '@components/ItemCount';

const items: ItemCountProps[] = [
    {
        name: 'Bière 1',
        price: 3.5
    },
    {
        name: 'Bière 2',
        price: 4
    },
    {
        name: 'Cidre',
        price: 3
    },
    {
        name: 'Bière 3',
        price: 3.4
    }
];

const verreItem: ItemCountProps = {
    name: 'Verre',
    price: 1,
    image: '/EcoCup.png'
};

export default function Glass(): JSX.Element {
    const [nbBoissons, setNbBoissons] = useState(items.map(() => 0));
    const [nbVerres, setNbVerres] = useState(0);
    const [subTotal, setSubTotal] = useState(0);

    function onValueChange(value: number, key: number): void {
        setNbBoissons(nbBoissons.map((v, i) => (i === key ? value : v)));
    }

    function onVerreChange(value: number): void {
        setNbVerres(value);
    }

    useEffect(() => {
        setSubTotal(nbBoissons.reduce((acc, v, i) => acc + v * items[i].price, 0) + (nbBoissons.reduce((a, b) => a + b, 0) + nbVerres) * verreItem.price);
    }, [nbBoissons, nbVerres]);

    useEffect(() => {
        console.log('Total: ', subTotal);
    }, [subTotal]);

    return (
        <div className="h-full flex flex-col border-2 rounded border-gray-800 dark:border-gray-300">
            {items.map((item, i) => (
                <ItemCount key={item.name} id={i} name={item.name} price={item.price} onValueChange={onValueChange} />
            ))}
            <div className='flex flex-col grow justify-end mt-[5rem]'>
                <ItemCount key={verreItem.name} name={verreItem.name} price={verreItem.price} value={nbBoissons.reduce((a, b) => a + b, 0)} image={verreItem.image} onValueChange={onVerreChange} />
            </div>
        </div>
    );
}
