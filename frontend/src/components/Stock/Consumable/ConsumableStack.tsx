import { getIcon } from '@styles/utils';
import { Consumable } from '@types';

interface ConsumableStackProps {
    consumables: Consumable[];
    uniqueConsumable: Consumable;
    onEdit: (consumable: Consumable) => void;
}

export function ConsumableStack(props: ConsumableStackProps): JSX.Element {
    const { consumables, uniqueConsumable, onEdit } = props;
    const stack = consumables.filter((c) => c.name === uniqueConsumable.name);
    if (stack.length === 0) return <></>;
    const smallStack = stack.slice(0, 5);
    return (
        <div
            className='relative'
            style={{
                width: 176 + (smallStack.length - 1) * 10,
                height: 256 + (smallStack.length - 1) * 10
            }}>
            {smallStack.map((_consumable, index) => (
                <div
                    className='flex h-64 w-44 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 border-gray-300 border hover:border-gray-400 absolute dark:border-gray-500'
                    style={{
                        zIndex: index,
                        top: index * 10,
                        left: index * 10
                    }}
                    key={index}>
                    <div className='flex flex-col p-4 items-center w-full justify-between'>
                        <h1 className='text-xl font-semibold uppercase'>{_consumable.name}</h1>
                        {getIcon(_consumable.icon, 'h-24 w-24 text-gray-500 dark:text-gray-100')}
                        <h2 className='text-xl'>Vente {_consumable.sellPrice}€</h2>
                        <h2>{stack.length} en stock</h2>
                        <button
                            className='btn-primary'
                            onClick={() => onEdit(uniqueConsumable)}>
                            Modifier
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
