import { useEffect, useState } from 'react';

interface Size {
    width: number
    height: number
}

export function debounce(func: () => any, wait = 50): () => void {
    let h: NodeJS.Timeout;
    return () => {
        clearTimeout(h);
        h = setTimeout(() => func(), wait);
    };
}

export default function useWindowSize(): Size {
    const getSize = (): Size => {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    };

    const [windowSize, setWindowSize] = useState<Size>(getSize);
    useEffect(() => {
        const handleResize = debounce(() => setWindowSize(getSize()));

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSize;
}
