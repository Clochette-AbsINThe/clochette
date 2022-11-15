import { getIcon } from '@styles/utils';
import { Barrel } from '@types';

interface BarrelStackProps {
    barrels: Barrel[];
    uniqueBarrel: Barrel;
}

export function BarrelStack(props: BarrelStackProps): JSX.Element {
    const { barrels, uniqueBarrel } = props;
    const stack = barrels.filter((b) => b.name === uniqueBarrel.name);
    if (stack.length === 0) return <></>;
    const smallStack = stack.slice(0, 5);
    return (
        <div
            className='relative'
            style={{
                width: 160 + (smallStack.length - 1) * 10,
                height: 240 + (smallStack.length - 1) * 10
            }}>
            {smallStack.map((barrel, index) => (
                <div
                    className='flex h-60 w-40 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 border-gray-300 border hover:border-gray-400 absolute dark:border-gray-500'
                    style={{
                        zIndex: index,
                        top: index * 10,
                        left: index * 10
                    }}
                    key={index}
                    draggable={true}
                    onDragStart={(e) => {
                        e.dataTransfer.setData('id', (barrel.id as number).toString());
                    }}>
                    <div className='flex flex-col p-4 items-center w-full space-y-2'>
                        <h1 className='text-2xl font-semibold uppercase'>{barrel.name}</h1>
                        {getIcon(barrel.icon, 'h-24 w-24 text-gray-500 dark:text-gray-100')}
                        <h2 className='text-xl'>Vente {barrel.sellPrice}€</h2>
                        <h2>{stack.length} en stock</h2>
                    </div>
                </div>
            ))}
        </div>
    );
}
