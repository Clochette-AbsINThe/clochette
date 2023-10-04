import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html
        lang='fr'
        className='scroll-smooth'
      >
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
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
