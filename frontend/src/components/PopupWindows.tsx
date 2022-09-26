import React, { useRef, useState } from 'react';
import useOnClickOutside from '@hooks/useOnClickOutside';
import useOnEchap from '@hooks/useOnEchap';

interface PopupWindowsProps {
    children: JSX.Element
    trigger: {
        className: string
        content: string
    }
};

export default function PopupWindows(props: PopupWindowsProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    function open(): void {
        setIsOpen(true);
    };

    function close(): void {
        setIsOpen(false);
    };

    useOnEchap(close);
    useOnClickOutside(ref, close);

    function renderContent(): JSX.Element {
        if (isOpen) {
            return (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#88888888] px-3">
                    <div ref={ref} className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4 flex flex-col border-2 dark:border-white border-black min-w-[75vw] min-h-[75vh] opacity-100" key="popup" id="PopUp">
                        <button className="ml-auto flex justify-end max-w-min" onClick={close}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 color-gray">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

    return (
        <>
            <TriggerButton className={props.trigger.className} content={props.trigger.content} onClick={open} />
            {renderContent()}
        </>
    );
};

interface TriggerButtonProps {
    className: string
    content: string
    onClick: () => void
}

function TriggerButton(props: TriggerButtonProps): JSX.Element {
    return (<button className={props.className} onClick={props.onClick}>{props.content}</button>);
}
