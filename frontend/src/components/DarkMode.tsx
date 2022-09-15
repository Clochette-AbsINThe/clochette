import { useEffect, useState } from 'react';

const themes = ['light', 'dark'];

const icons = [
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
        key={'light'}
    >
        <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
        />
    </svg>,
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
        key={'dark'}
    >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
];

export function DarkMode(): JSX.Element {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const root = document.documentElement;
        setTheme(localStorage.getItem('theme') ?? 'light');
        if (theme === 'light') {
            root.classList.remove('dark');
        } else {
            root.classList.add('dark');
        }
    }, [theme]);
    return (
        <div className='flex items-center justify-center bg-[#70707016] rounded-full m-4 mr-10'>
            {themes.map((t, i) => {
                const icon = icons[i];
                const checked = t === theme;
                const themeLabel = t;
                return (
                    <label title={themeLabel} className={(checked ? 'color-green' : 'color-gray') + ' pt-1 pb-1 pl-3 pr-3 opacity-50 cursor-pointer'} key={i}>
                        {icon}
                        <input
                            type="radio"
                            name="theme-toggle"
                            checked={checked}
                            value={t}
                            aria-label={themeLabel}
                            className={'hidden'}
                            onChange={() => {
                                const matchesDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

                                if ((matchesDarkTheme && t === 'dark') || (!matchesDarkTheme && t === 'light')) {
                                    localStorage.removeItem('theme');
                                } else {
                                    localStorage.setItem('theme', t);
                                }
                                setTheme(t);
                            }}
                        />
                    </label>
                );
            })}
        </div>
    );
}
