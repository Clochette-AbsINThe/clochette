import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html
                lang='fr'
                className='scroll-smooth'>
                <Head>
                    <meta charSet='UTF-8' />

                    <link
                        rel='alternate'
                        type='application/rss+xml'
                        href='/rss.xml'
                    />
                    <link
                        rel='icon'
                        type='image/x-icon'
                        href='/absinthe.png'
                    />
                </Head>
                <body className='bg-gray-100 text-slate-900 dark:bg-slate-900 dark:text-gray-100'>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
