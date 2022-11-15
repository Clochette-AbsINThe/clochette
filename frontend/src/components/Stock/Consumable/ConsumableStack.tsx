import { getIcon } from '@styles/utils';
import { Consumable } from '@types';

interface ConsumableStackProps {
    consumables: Consumable[];
    uniqueConsumable: Consumable;
}

export function ConsumableStack(props: ConsumableStackProps): JSX.Element {
    const { consumables, uniqueConsumable } = props;
    const stack = consumables.filter((c) => c.name === uniqueConsumable.name);
    if (stack.length === 0) return <></>;
    const smallStack = stack.slice(0, 5);
    return (
        <div
            className='relative'
            style={{
                width: 160 + (smallStack.length - 1) * 10,
                height: 240 + (smallStack.length - 1) * 10
            }}>
            {smallStack.map((_consumable, index) => (
                <div
                    className='flex h-60 w-40 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 border-gray-300 border hover:border-gray-400 absolute dark:border-gray-500'
                    style={{
                        zIndex: index,
                        top: index * 10,
                        left: index * 10
                    }}
                    key={index}>
                    <div className='flex flex-col p-4 items-center w-full space-y-2'>
                        <h1 className='text-2xl font-semibold uppercase'>{_consumable.name}</h1>
                        {getIcon(_consumable.icon, 'h-24 w-24 text-gray-500 dark:text-gray-100')}
                        <h2 className='text-xl'>Vente {_consumable.sellPrice}€</h2>
                        <h2>{stack.length} en stock</h2>
                    </div>
                </div>
            ))}
        </div>
    );
}
