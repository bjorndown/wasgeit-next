import Head from 'next/head'
import '../style.css'
import { SWRConfig } from 'swr'

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="todo" />
        <title>wasgeit</title>
      </Head>
      <SWRConfig value={{ fetcher }}>
        <Component {...pageProps} />
      </SWRConfig>
    </>
  )
}

export default MyApp
