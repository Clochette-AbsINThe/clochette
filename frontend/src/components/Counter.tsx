import React, { useState } from 'react'
import './Counter.scss'

interface CounterProps {
    children: JSX.Element
    count: number
}

export default function Counter({ children, count: initialCount }: CounterProps): JSX.Element {
    const [count, setCount] = useState(initialCount)
    const add = (): void => setCount((i) => i + 1)
    const subtract = (): void => setCount((i) => i - 1)

    return (
        <>
            <div className="counter">
                <button onClick={subtract}>-</button>
                <pre>{count}</pre>
                <button onClick={add}>+</button>
            </div>
            <div className="counter-message">{children}</div>
        </>
    )
}
