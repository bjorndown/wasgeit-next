import Head from 'next/head'
import '../style.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="todo"/>
        <title>wasgeit</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp