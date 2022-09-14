import React, { useState } from 'react';

interface CounterProps {
    children: JSX.Element
    count: number
}

export default function Counter({ children, count: initialCount }: CounterProps): JSX.Element {
    const [count, setCount] = useState(initialCount);
    const add = (): void => setCount((i) => i + 1);
    const subtract = (): void => setCount((i) => i - 1);

    return (
        <>
            <div className="grid text-3xl grid-cols-3 mt-8 place-items-center">
                <button onClick={subtract}>-</button>
                <pre>{count}</pre>
                <button onClick={add}>+</button>
            </div>
            <div className="text-center">{children}</div>
        </>
    );
}
