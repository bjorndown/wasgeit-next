import Head from 'next/head'
import { useState } from 'react'
import { Agenda } from '../components/Agenda'

const Index = () => {
  const [searchString, setSearchString] = useState<string | undefined>()
  return (
    <div className="container">
      <Head>
        <title>wasgeit</title>
      </Head>
      <header>
        <h1>wasgeit?</h1>
        <input
          type="search"
          onChange={(event) =>
            setSearchString(event.target.value.toLocaleLowerCase())
          }
          size={10}
          placeholder="such!"
        />
      </header>
      <main>
        <Agenda searchString={searchString} />
      </main>
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
          justify-content: space-evenly;
          align-items: center;
          color: var(--color);
        }

        main {
          grid-area: events;
          overflow: auto;
          height: calc(100vh - var(--header-height));
        }

        .search-container {
          width: 80%;
        }

        input {
          font-size: var(--medium-font-size);
        }
      `}</style>
    </div>
  )
}

export default Index
