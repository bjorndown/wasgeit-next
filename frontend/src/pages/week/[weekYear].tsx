import Head from 'next/head'
import { Scroller } from '../../components/Scroller'
import { Agenda } from '../../components/Agenda'
import { useRouter } from 'next/router'
import { Spinner } from '../../components/Spinner'
import { useEventsByWeek } from '../../hooks/useEventsByWeek'

const Index = () => {
  const router = useRouter()
  const weekYear = Array.isArray(router.query.weekYear)
    ? router.query.weekYear[0]
    : router.query.weekYear
  const { events, isValidating } = useEventsByWeek(weekYear)

  if (isValidating || !weekYear) {
    return <Spinner />
  }

  const [year, weekNumber] = weekYear.split('-').map((str) => parseInt(str))

  return (
    <div className="container">
      <Head>
        <title>wasgeit</title>
      </Head>
      <header>
        <h1>wasgeit</h1>
      </header>
      <main>
        <Agenda events={events} />
      </main>
      <footer>
        <Scroller weekNumber={weekNumber} year={year} />
      </footer>
      {/* language=css*/}
      <style jsx>{`
        .container {
          display: grid;
          grid-template-areas: 'header' 'events' 'scroll';
          grid-template-rows: auto 1fr auto;
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
          box-shadow: 0 -3px 7px var(--shadow-color);
          grid-area: scroll;
          height: var(--footer-height);
        }
      `}</style>
    </div>
  )
}

export default Index
