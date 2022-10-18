import Head from 'next/head'
import '../style.css'
import { SWRConfig } from 'swr'
import { S3_HOST } from '../hooks/useEvents'

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="todo" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <title>wasgeit</title>
        <link rel="preconnect" href={S3_HOST} />
      </Head>
      <SWRConfig value={{ fetcher }}>
        <Component {...pageProps} />
      </SWRConfig>
    </>
  )
}

export default MyApp
