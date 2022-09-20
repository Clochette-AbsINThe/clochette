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
            <label title={Transaction.Achat.toString()} className={'pt-1 pb-1 pl-10 pr-10 cursor-pointer bg-[#70707016] rounded-l-full border-2 border-green-600'}>
                {Transaction.Achat.toString()}
                <input
                    type="radio"
                    name="transaction-toggle"
                    checked={transaction === Transaction.Achat}
                    value={Transaction.Achat}
                    aria-label={Transaction.Achat.toString()}
                    className={'hidden'}
                    onChange={handleChange}
                />
            </label>
            <label title={Transaction.Vente.toString()} className={'pt-1 pb-1 pl-10 pr-10 cursor-pointer bg-[#70707016] rounded-r-full'}>
                {Transaction.Vente.toString()}
                <input
                    type="radio"
                    name="transaction-toggle"
                    checked={transaction === Transaction.Vente}
                    value={Transaction.Vente}
                    aria-label={Transaction.Vente.toString()}
                    className={'hidden'}
                    onChange={handleChange}
                />
            </label>
        </div>
    );
};
