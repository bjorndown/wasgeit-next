import { EventsByDate } from '@wasgeit/common/src/types'
import {
  endOfISOWeek,
  format,
  setISOWeek,
  startOfISOWeek,
} from 'date-fns'
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
      <style jsx>{`
        .container {
          min-height: 100%;
          display: grid;
          grid-template-areas: 'header' 'events' 'scroll';
          grid-template-rows: auto 1fr auto;
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
