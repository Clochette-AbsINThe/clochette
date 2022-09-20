import React, { useState } from 'react';

enum Transaction {
    'Achat' = 'Achat',
    'Vente' = 'Vente'
}

export default function TransactionSwitch(): JSX.Element {
    const [transaction, setTransaction] = useState(Transaction.Achat);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setTransaction(e.target.value === 'Achat' ? Transaction.Achat : Transaction.Vente);
    }

    return (
        <div className="flex items-center justify-center">
            <label title={Transaction.Achat.toString()} className={'pt-1 pb-1 pl-12 pr-12 cursor-pointer bg-[#70707016] rounded-l-full border-2' + (transaction === Transaction.Achat ? ' border-green-600' : ' color-gray border-gray-400 opacity-75')}>
                {Transaction.Achat.toString()}
                <input
                    type="radio"
                    name="transaction-toggle"
                    checked={transaction === Transaction.Achat}
                    value={Transaction.Achat.toString()}
                    aria-label={Transaction.Achat.toString()}
                    className={'hidden'}
                    onChange={handleChange}
                />
            </label>
            <label title={Transaction.Vente.toString()} className={'pt-1 pb-1 pl-12 pr-12 cursor-pointer bg-[#70707016] rounded-r-full border-2' + (transaction === Transaction.Vente ? ' border-green-600' : ' color-gray border-gray-400 opacity-75')}>
                {Transaction.Vente.toString()}
                <input
                    type="radio"
                    name="transaction-toggle"
                    checked={transaction === Transaction.Vente}
                    value={Transaction.Vente.toString()}
                    aria-label={Transaction.Vente.toString()}
                    className={'hidden'}
                    onChange={handleChange}
                />
            </label>
        </div>
    );
};
