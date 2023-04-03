import Head from 'next/head'
import '../style.css'
import { SWRConfig } from 'swr'
import React from 'react'
import { EVENTS_JSON_URL } from '@wasgeit/common/src/constants'

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="keywords"
          content="event, concert, show, crawler, listing, liste, bern, thun, solothurn, fribourg, agenda, konzert, ausgang, was geht, was geit, ausgehen, schweiz"
        />
        <meta
          name="description"
          content="wasgeit &ndash; Die schlanke Konzert-Agenda. Konzerte und Veranstaltungen von mehr als 15 Lokalen auf einen Blick."
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link
          rel="preload"
          crossOrigin="anonymous"
          as="fetch"
          type="application/json"
          href={EVENTS_JSON_URL}
        />
        <title>wasgeit</title>
      </Head>
      <SWRConfig value={{ fetcher }}>
        <React.StrictMode>
          <Component {...pageProps} />
        </React.StrictMode>
      </SWRConfig>
    </>
  )
}

export default MyApp
