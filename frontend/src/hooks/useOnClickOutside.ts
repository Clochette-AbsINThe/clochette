import React, { MutableRefObject } from 'react';

export default function useOnClickOutside(ref: MutableRefObject<any>, handler: any): void {
    React.useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent): void => {
            // Do nothing if clicking ref's element or descendent elements
            if (ref.current === null || ref.current === false || ref.current.contains(event.target) !== false) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}
