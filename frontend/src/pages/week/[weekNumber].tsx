import { EventsByDate } from '@wasgeit/common/src/types'
import { endOfISOWeek, format, setISOWeek, startOfISOWeek } from 'date-fns'
import * as fs from 'fs'
import path from 'path'
import { NextPageContext } from 'next'
import { de } from 'date-fns/locale'
import Head from 'next/head'
import { Scroller } from '../../components/Scroller'
import { Agenda } from '../../components/Agenda'

type Props = {
  events: EventsByDate
  weekNumber: number
}

const Index = ({ events, weekNumber }: Props) => {
  const date = setISOWeek(new Date(), weekNumber)
  const formatDate = (date: Date) => format(date, 'dd. MMM', { locale: de })

  return (
    <div className="container">
      <Head>
        <title>wasgeit - KW{weekNumber}</title>
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
        <Agenda events={events} />
      </main>
      <footer>
        <Scroller weekNumber={weekNumber} />
      </footer>
      {/* language=css*/}
      <style jsx>{`
        .container {
          display: grid;
          grid-template-areas: 'header' 'events' 'scroll';
          grid-template-rows: auto 1fr auto;
        }

        .date-range {
          font-size: var(--small-font-size);
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
          height: calc(100vh - var(--header-height) - var(--footer-height));
        }

        footer {
          grid-area: scroll;
          height: var(--footer-height);
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
