import React, { useEffect, useState } from 'react';

export enum TransactionEnum {
    'Achat' = 'Achat',
    'Vente' = 'Vente'
}

interface TransactionSwitchProps {
    changeTransactionType: (type: TransactionEnum) => void
    startTransactionType: TransactionEnum
}

export default function TransactionSwitch(props: TransactionSwitchProps): JSX.Element {
    const [transaction, setTransaction] = useState(props.startTransactionType);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setTransaction(e.target.value === 'Achat' ? TransactionEnum.Achat : TransactionEnum.Vente);
    }

    useEffect(() => {
        props.changeTransactionType?.(transaction);
    }, [transaction]);

    useEffect(() => {
        setTransaction(props.startTransactionType);
    }, [props.startTransactionType]);

    return (
        <div className="flex items-center justify-center mb-4">
            <label title={TransactionEnum.Achat.toString()} className={'pt-1 pb-1 pl-12 pr-12 cursor-pointer bg-[#70707016] rounded-l-full border-2' + (transaction === TransactionEnum.Achat ? ' border-green-600' : ' color-gray border-gray-400 opacity-75')}>
                {TransactionEnum.Achat.toString()}
                <input
                    type="radio"
                    name="transaction-toggle"
                    checked={transaction === TransactionEnum.Achat}
                    value={TransactionEnum.Achat.toString()}
                    aria-label={TransactionEnum.Achat.toString()}
                    className={'hidden'}
                    onChange={handleChange}
                />
            </label>
            <label title={TransactionEnum.Vente.toString()} className={'pt-1 pb-1 pl-12 pr-12 cursor-pointer bg-[#70707016] rounded-r-full border-2' + (transaction === TransactionEnum.Vente ? ' border-green-600' : ' color-gray border-gray-400 opacity-75')}>
                {TransactionEnum.Vente.toString()}
                <input
                    type="radio"
                    name="transaction-toggle"
                    checked={transaction === TransactionEnum.Vente}
                    value={TransactionEnum.Vente.toString()}
                    aria-label={TransactionEnum.Vente.toString()}
                    className={'hidden'}
                    onChange={handleChange}
                />
            </label>
        </div>
    );
};
