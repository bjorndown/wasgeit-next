import { EventsByDate } from '@wasgeit/common/src/types'
import {
  compareAsc,
  endOfISOWeek,
  format,
  parseISO,
  setISOWeek,
  startOfISOWeek,
} from 'date-fns'
import * as fs from 'fs'
import path from 'path'
import { NextPageContext } from 'next'
import { de } from 'date-fns/locale'
import Head from 'next/head'

type Props = {
  events: EventsByDate
  weekNumber: number
}

const Index = ({ events, weekNumber }: Props) => {
  const date = setISOWeek(new Date(), weekNumber)
  const formatDate = (date: Date) => format(date, 'dd. MMM', { locale: de })
  const formatDateLong = (date: Date) =>
    format(date, 'EEE dd. MMM', { locale: de })
  return (
    <div className="container">
      <Head>
        <title>wasgeit</title>
      </Head>
      <header>
        <h1>wasgeit</h1>
        <span className="date-range">
          {formatDate(startOfISOWeek(date))}
          {' - '}
          {formatDate(endOfISOWeek(date))}
        </span>
      </header>
      <main>
        <ol>
          {Object.entries(events)
            .sort(([a], [b]) => compareAsc(parseISO(a), parseISO(b)))
            .map(([date, events]) => (
              <article className="events-of-the-day">
                <h2>{formatDateLong(parseISO(date))}</h2>
                <ul>
                  {events.map((event) => (
                    <li key={event.url}>
                      <a href={event.url}>
                        <article
                          className="event"
                          data-start-date={event.start}
                        >
                          <span className="venue-name">{event.venue}</span>
                          <span className="event-title">{event.title}</span>
                        </article>
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
        </ol>
      </main>
      <footer>
        <nav>
          <ul>
            <li>
              <a className="scroll" href={`/week/${weekNumber - 1}`}>
                ◂
              </a>
            </li>
            <li>
              <a className="scroll" href={`/week/${weekNumber + 1}`}>
                ▸
              </a>
            </li>
          </ul>
        </nav>
      </footer>
      <style jsx>{`
        .container {
          min-height: 100%;
          display: grid;
          grid-template-areas: 'header' 'events' 'scroll';
          grid-template-rows: auto 1fr auto;
        }

        h1,
        h2 {
          margin: 0.6rem 0;
        }
        
        h2 {
          font-size: 1.5rem;
          text-transform: uppercase;
          background-color: black;
          color: white;
          padding: 0.2rem 0.3rem;
        }

        .date-range {
          font-size: 1.5rem;
        }

        header {
          grid-area: header;
          display: flex;
          flex-flow: row wrap;
          justify-content: space-around;
          align-items: baseline;
        }

        main {
          grid-area: events;
          overflow: auto;
        }

        footer {
          grid-area: scroll;
        }

        :global(body) {
          padding: 0;
          margin: 0;
          font-family: sans-serif;
        }

        footer nav ul {
          grid-area: scroll;
          width: 100%;
          display: flex;
          flex-flow: row wrap;
          justify-content: space-around;
          align-items: center;
          list-style: none;
          padding: 0;
          font-size: 3rem;
          margin: 0;
        }

        main ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        main ol {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 2rem;
        }

        a {
          color: black;
          text-decoration: none;
        }

        a.scroll {
          padding: 0 0.6rem;
        }

        span.venue-name {
          font-size: 1.1rem;
          text-transform: uppercase;
        }

        @media (prefers-color-scheme: dark) {
          body {
            background: black;
            color: white;
          }
        }

        @media (prefers-color-scheme: light) {
          body {
            background: white;
            color: black;
          }
        }

        article.events-of-the-day {
          padding: 0 0.5rem;
        }

        article.event {
          display: flex;
          flex-flow: column wrap;
          margin-bottom: 1.2rem;
        }
      `}</style>
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const weekNumber = parseInt(
    Array.isArray(context.query.weekNumber)
      ? context.query.weekNumber[0]
      : context.query.weekNumber
  )

  const events = JSON.parse(
    fs
      .readFileSync(
        path.join('public', `${new Date().getFullYear()}-${weekNumber}.json`)
      )
      .toString()
  )
  return {
    props: { events, weekNumber },
  }
}

export default Index
