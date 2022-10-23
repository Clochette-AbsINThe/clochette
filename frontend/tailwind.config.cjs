/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            keyframes: {
                'slide-in': {
                    '0%': { transform: 'translateY(-10%)', opacity: 0 },
                    '100%': { transform: 'translateX(0)', opacity: 1 }
                }
            },
            animation: {
                'slide-in': 'slide-in 0.9s forwards 0.8s'
            }
        }
    },
    plugins: [],
    darkMode: 'class'
};
