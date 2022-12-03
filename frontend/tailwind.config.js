/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            keyframes: {
                'slide-in': {
                    '0%': { transform: 'translateY(-10%)', opacity: 0 },
                    '100%': { transform: 'translateX(0)', opacity: 1 }
                },
                'fade-in': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 }
                }
            },
            animation: {
                'slide-in': 'slide-in 0.9s forwards 0.8s',
                'fade-in': 'fade-in 0.5s forwards'
            }
        }
    },
    safelist: ['h-24', 'w-24', 'text-gray-500', 'dark:text-gray-100'],
    plugins: [],
    darkMode: 'class'
};
