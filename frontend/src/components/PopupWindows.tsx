import useOnClickOutside from '@hooks/useOnClickOutside';
import useOnEchap from '@hooks/useOnEchap';
import React, { useEffect, useRef, useState } from 'react';

interface PopupWindowsProps {
    children: JSX.Element;
    open?: boolean;
    setOpen?: (state: boolean) => void;
}

export default function PopupWindows(props: PopupWindowsProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    /**
     * This function open the popUp and call the callback if it exist.
     */
    function open(): void {
        setIsOpen(true);
    }

    /**
     * This function close the popUp and call the callback if it exist.
     */
    function close(): void {
        setIsOpen(false);
        props.setOpen?.(false);
    }

    useOnEchap(close);
    useOnClickOutside(ref, close);

    /**
     * This is updating the isOpen state when the props change.
     */
    useEffect(() => {
        if (props.open) {
            open();
        } else {
            close();
        }
    }, [props.open]);

    /**
     * Focus the first input when the popup is open.
     */
    useEffect(() => {
        if (!isOpen) return;
        const submit = document.querySelector('#submit-btn') as HTMLButtonElement;
        if (submit) submit.focus();
    }, [isOpen]);

    if (isOpen) {
        return (
            <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#88888888] p-3 z-50'>
                <div
                    ref={ref}
                    className='bg-gray-100 dark:bg-slate-900 rounded-lg p-4 flex flex-col min-w-[75vw] min-h-[75vh] opacity-100 max-w-[100vw] max-h-full overflow-auto'
                    key='popup'
                    id='PopUp'
                    aria-label='PopUp'
                    role='dialog'>
                    <button
                        className='ml-auto flex justify-end max-w-min'
                        onClick={close}
                        aria-label='closeButton'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={2}
                            stroke='currentColor'
                            className='w-12 h-12 color-gray'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M6 18L18 6M6 6l12 12'
                            />
                        </svg>
                    </button>
                    {props.children}
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}
