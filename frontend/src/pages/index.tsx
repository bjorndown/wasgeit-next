import Head from 'next/head'
import { useRef } from 'react'
import { Agenda } from '../components/Agenda'

const Index = () => {
  const mainElement = useRef(null)

  return (
    <div className="container">
      <Head>
        <title>wasgeit</title>
      </Head>
      <header>
        <h1>wasgeit</h1>
      </header>
      <main ref={mainElement}>
        <Agenda container={mainElement.current} />
      </main>
      {/* language=css */}
      <style jsx>{`
        .container {
          display: grid;
          grid-template-areas: 'header' 'events';
          grid-template-rows: auto 1fr;
        }

        header {
          grid-area: header;
          height: var(--header-height);
          display: flex;
          flex-flow: row wrap;
          justify-content: space-around;
          align-items: center;
          color: var(--color);
        }

        main {
          grid-area: events;
          overflow: auto;
          height: calc(100vh - var(--header-height));
        }
      `}</style>
    </div>
  )
}

export default Index
