import useGetBoundingClientRect from '@hooks/useGetBoundingClientRect';
import { getIcon } from '@styles/utils';
import { Barrel } from '@types';
import { Touch, TouchEvent, useEffect, useRef, useState } from 'react';

interface BarrelStackProps {
    barrels: Barrel[];
    uniqueBarrel: Barrel;
    handleMountNewBarrel: (id: number) => void;
}

export function BarrelStack(props: BarrelStackProps): JSX.Element {
    const { barrels, uniqueBarrel, handleMountNewBarrel } = props;
    const barrelCardOnTopRef = useRef<HTMLDivElement>(null);
    const stackCardPosition = useGetBoundingClientRect({ ref: barrelCardOnTopRef });

    const stack = barrels.filter((b) => b.name === uniqueBarrel.name);

    if (stack.length === 0) return <></>;

    const smallStack = stack.slice(0, 5);

    const moveCard = (touch: Touch) => {
        const { clientX, clientY } = touch;
        const { current } = barrelCardOnTopRef;
        if (current) {
            current.style.left = `${clientX - stackCardPosition.x - 80}px`;
            current.style.top = `${clientY - stackCardPosition.y - 120}px`;

            current.style.opacity = '0.9';

            current.style.zIndex = '100';
        }
    };

    const resetCard = () => {
        const { current } = barrelCardOnTopRef;
        if (current) {
            current.style.left = `${Number(barrelCardOnTopRef.current!.id) * 10}px`;
            current.style.top = `${Number(barrelCardOnTopRef.current!.id) * 10}px`;

            current.style.opacity = '1';

            current.style.zIndex = barrelCardOnTopRef.current!.id;
        }
    };

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>): void => {
        moveCard(e.touches[0]!);
    };

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>): void => {
        const touch = e.touches[0]!;
        moveCard(touch);

        const addCarRect = document.getElementById('add-card')!.getBoundingClientRect();
        // console.log(addCarRect, touch);
        const inAddCard: boolean = touch!.clientX > addCarRect.left && touch!.clientX < addCarRect.right && touch!.clientY > addCarRect.top && touch!.clientY < addCarRect.bottom;

        if (inAddCard) {
            document.getElementById('add-card')?.classList.add('over');
        } else {
            document.getElementById('add-card')?.classList.remove('over');
        }
    };

    const handleTouchEnd = (e: TouchEvent<HTMLDivElement>): void => {
        const touch = e.changedTouches[0]!;

        const addCarRect = document.getElementById('add-card')!.getBoundingClientRect();
        const inAddCard: boolean = touch!.clientX > addCarRect.left && touch!.clientX < addCarRect.right && touch!.clientY > addCarRect.top && touch!.clientY < addCarRect.bottom;

        if (inAddCard) handleMountNewBarrel(uniqueBarrel.id as number);

        resetCard();
        document.getElementById('add-card')?.classList.remove('over');
    };

    return (
        <div
            className='relative'
            style={{
                minWidth: 176 + (smallStack.length - 1) * 10,
                minHeight: 256 + (smallStack.length - 1) * 10
            }}>
            {smallStack.map((barrel, index) => (
                <div
                    className='touch-pan-x flex h-64 w-44 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 border-gray-300 border hover:border-gray-400 absolute dark:border-gray-500'
                    style={{
                        zIndex: index,
                        top: index * 10,
                        left: index * 10
                    }}
                    ref={barrelCardOnTopRef}
                    key={index}
                    id={index.toString()}
                    draggable={true}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                    onDragStart={(e) => {
                        e.dataTransfer.setData('id', (barrel.id as number).toString());
                    }}>
                    <div className='flex flex-col px-2 py-4 items-center w-full space-y-1 justify-between'>
                        <h1 className='text-xl font-semibold uppercase [hyphens:_auto] text-center'>{barrel.name}</h1>
                        {getIcon(barrel.icon, 'h-24 w-24 text-gray-500 dark:text-gray-100')}
                        <h2 className='text-xl'>Vente {barrel.sellPrice}€</h2>
                        <h2>{stack.length} en stock</h2>
                    </div>
                </div>
            ))}
        </div>
    );
}
