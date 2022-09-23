import type { MouseEventHandler } from 'react';

interface PopupProps {
    close: MouseEventHandler
    children: JSX.Element
};

export default function PopupWindows(props: PopupProps): JSX.Element {
    return (
        <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4 flex flex-col border-2 dark:border-white border-black min-w-[75vw] min-h-[60vh] opacity-100">
            <button className="flex justify-end" onClick={props.close}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 color-gray">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            {props.children}
        </div>
    );
};
