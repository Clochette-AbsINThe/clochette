import { RefObject, useEffect, useState } from 'react';

interface Position {
    x: number;
    y: number;
}

export function debounce(func: () => any, wait = 50): () => void {
    let h: NodeJS.Timeout;
    return () => {
        clearTimeout(h);
        h = setTimeout(() => func(), wait);
    };
}

export default function useGetBoundingClientRect({ ref }: { ref: RefObject<Element> }): Position {
    const getPosition = (): Position => {
        if (typeof window === 'undefined' || !ref.current) return { x: 0, y: 0 };
        return {
            x: ref.current.getBoundingClientRect().left,
            y: ref.current.getBoundingClientRect().top
        };
    };

    const [elementPosition, setElementPosition] = useState<Position>(getPosition);
    useEffect(() => {
        const handleScroll = debounce(() => setElementPosition(getPosition()));

        window.addEventListener('scroll', handleScroll, true);
        setElementPosition(getPosition());
        return () => window.removeEventListener('scroll', handleScroll, true);
    }, []);
    return elementPosition;
}
