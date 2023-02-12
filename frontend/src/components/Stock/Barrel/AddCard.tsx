import { DragEvent, useRef } from 'react';

interface AddCardProps {
    handleMountNewBarrel: (id: number) => void;
}

export function AddCard(props: AddCardProps): JSX.Element {
    const { handleMountNewBarrel } = props;
    const ref = useRef<HTMLDivElement>(null);

    const hanleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        ref.current?.classList.add('over');
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        if (ref.current?.contains(e.relatedTarget as Node)) return;
        e.preventDefault();
        ref.current?.classList.remove('over');
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleDragLeave(e);
        handleMountNewBarrel(Number(e.dataTransfer.getData('id')));
    };

    return (
        <div
            className='group'
            id='add-card'
            ref={ref}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={hanleDragEnter}>
            <div className='flex h-full min-h-[16rem] w-44 border-dashed border-gray-300 rounded bg-[#70707016] border-2 group-[.over]:border-gray-400'>
                <div className='flex flex-col justify-center items-center w-full'>
                    <div className='flex flex-row justify-center items-center'>
                        <svg
                            className='w-20 h-20 text-gray-300 dark:text-gray-100 group-[.over]:w-[5.1rem] group-[.over]:h-[5.1rem] group-[.over]:text-gray-400 dark:group-[.over]:text-gray-200'
                            color='currentColor'
                            viewBox='0 0 48 48'>
                            <mask id='svgIDa'>
                                <path
                                    fill='#555'
                                    stroke='#fff'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M7 18h11V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v11h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H30v11a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V30H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z'></path>
                            </mask>
                            <path
                                fill='currentColor'
                                d='M0 0h48v48H0z'
                                mask='url(#svgIDa)'></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
