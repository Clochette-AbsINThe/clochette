import React, { useEffect } from 'react';
import TransactionSwitch, { TransactionEnum } from '@components/TransactionSwitch';
import Glass from '@components/Glass';
import type { ItemCountProps } from '@components/ItemCount';

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

export default function Transaction(): JSX.Element {
    const [totalPrice, setTotalPrice] = React.useState(0);

    function changeTotalPrice(price: number): void {
        setTotalPrice(price);
    };

    const [transactionType, setTransactionType] = React.useState(TransactionEnum.Vente);

    function changeTransactionType(type: TransactionEnum): void {
        setTransactionType(type);
    };

    useEffect(() => {
        setTotalPrice(0);
    }, [transactionType]);

    function renderTransaction(): JSX.Element {
        if (transactionType === TransactionEnum.Vente) {
            return (
                <div className="grid-cols-3 flex-grow grid gap-x-2">
                    <Glass items={items} verreItem={verreItem} changeSubTotalPrice={changeTotalPrice} />
                    {/* <Glass items={items} verreItem={verreItem} />
                    <Glass items={items} verreItem={verreItem} /> */}
                </div>
            );
        } else {
            return (
                <div className="flex-grow">ACHAT</div>

            );
        }
    };

    return (
        <>
            <TransactionSwitch changeTransactionType={changeTransactionType} />
            {renderTransaction()}
            <div className='flex justify-end mr-7 text-3xl mt-3'>Total price : {totalPrice}€</div>
        </>
    );
};
