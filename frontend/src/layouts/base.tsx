import Footer from '@include/Footer';
import Head from 'next/head';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';

export interface Props {
    title: string;
    description: string;
    children: JSX.Element;
}

const Navbar = dynamic(() => import('@include/Navbar'), { ssr: false });

export default function Base({ children, title, description }: React.PropsWithChildren<Props>): JSX.Element {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    name='description'
                    content={description}
                />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                />
            </Head>
            <Navbar />
            <main className='flex-grow p-3 flex flex-col space-y-4'>
                {children}
                <Toaster
                    position='bottom-left'
                    toastOptions={{ style: { maxWidth: 500 } }}
                />
            </main>
            <Footer />
            <Script id='theme'>
                {`
                        const theme = (() => {
                            if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
                                return localStorage.getItem('theme');
                            }
                            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                                return 'dark';
                            }
                            return 'light';
                        })();
                        
                        if (theme === 'light') {
                            document.documentElement.classList.remove('dark');
                        } else {
                            document.documentElement.classList.add('dark');
                        }
                        window.localStorage.setItem('theme', theme);
                        
                        window.onpopstate = function (event) {
                            window.location.reload();
                        };
                        `}
            </Script>
        </>
    );
}
