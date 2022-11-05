import Head from 'next/head'
import { useState } from 'react'
import { Agenda } from '../components/Agenda'

const Index = () => {
  const [searchString, setSearchString] = useState<string | undefined>()
  return (
    <div className="container">
      <header>
        <nav>
          <h1>wasgeit?</h1>
          <input
            type="search"
            onChange={event =>
              setSearchString(event.target.value.toLocaleLowerCase())
            }
            size={10}
            placeholder="such!"
          />
          <a href="/impressum">?</a>
        </nav>
      </header>
      <main>
        <Agenda searchString={searchString} />
      </main>
      <style jsx>{`
        .container {
          display: grid;
          grid-template-areas: 'header' 'events';
          grid-template-rows: auto 1fr;
          max-width: 800px;
        }

        nav {
          grid-area: header;
          display: flex;
          flex-flow: row wrap;
          justify-content: space-between;

          align-items: center;
          color: var(--color);
        }

        nav :is(h1, a) {
          padding: 0 var(--large-padding);
        }

        main {
          grid-area: events;
          overflow: auto;
          height: calc(100vh - var(--header-height));
        }

        input {
          font-size: var(--medium-font-size);
        }

        @media (min-width: 800px) {
          .container {
            margin: 0 auto;
          }
        }

        @media (min-height: 200px) and (max-height: 500px) {
          nav {
            height: 10vh;
          }
        }

        @media (min-height: 500px) and (max-height: 600px) {
          nav {
            height: 7vh;
          }
        }

        @media (min-height: 600px) and (max-height: 850px) {
          nav {
            height: 6vh;
          }
        }

        @media (min-height: 860px) {
          nav {
            height: 4vh;
          }
        }
      `}</style>
    </div>
  )
}

export default Index
