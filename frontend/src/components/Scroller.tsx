import React, { useMemo } from 'react'
import Link from 'next/link'
import { ISODate } from '@wasgeit/common/src/types'
import { format, isMonday, isWeekend, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import classNames from 'classnames'

type Props = {
  topDate: ISODate
  allDates: ISODate[]
  hidden: boolean
}

export const Scroller = ({ topDate, allDates, hidden = true }: Props) => {
  const datesPerMonth = useMemo(() => {
    return allDates.reduce<Record<string, ISODate[]>>((agg, date) => {
      const parsedDate = parseISO(date)
      const month = format(parsedDate, 'yyyy-MM-01')
      if (!agg[month]) {
        agg[month] = []
      }
      agg[month].push(date)
      return agg
    }, {})
  }, [allDates])

  const formatDateLong = (date: Date) => format(date, 'EEE dd.', { locale: de })

  if (hidden) {
    return null
  }

  return (
    <nav className={classNames({ 'slide-in': !hidden, 'slide-out': hidden })}>
      <ol>
        {Object.entries(datesPerMonth).map(([month, dates]) => {
          return (
            <li key={month}>
              <h2 className="month">
                {format(parseISO(month), 'MMM', { locale: de })}
              </h2>
              <ol>
                {dates.sort().map((date) => {
                  const date1 = parseISO(date)
                  return (
                    <li key={date}>
                      <Link
                        passHref={true}
                        shallow={true}
                        scroll={false}
                        href={`?top=${date}`}
                      >
                        <a
                          className={classNames('date', {
                            topDate: date === topDate,
                            weekend: isWeekend(date1),
                            monday: isMonday(date1),
                          })}
                        >
                          {formatDateLong(date1)}
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </li>
          )
        })}
      </ol>
      {/* language=css*/}
      <style jsx>{`
        nav {
          background-color: var(--bg-color);
          position: fixed;
          top: 0;
          right: 0;
          z-index: 10;
          box-shadow: var(--color) 0 0 5px;
          height: 100vh;
          padding: var(--large-padding);
          overflow: auto;
          width: 8rem;
          color: var(--color);
        }

        .slide-in {
          animation: 500ms 1 ease-in slide;
        }

        .slide-out {
          animation: 500ms 1 ease-out slide;
        }

        .month {
          color: var(--color);
          margin: 1rem 0;
          font-size: var(--large-font-size);
        }

        .date {
          font-size: var(--medium-font-size);
          margin-bottom: 0.5rem;
          padding: var(--padding) var(--large-padding);
        }

        .topDate {
          background-color: var(--invert-bg-color);
          color: var(--invert-color);
        }

        .weekend {
        }

        .monday {
        }

        @keyframes slide {
          from {
            width: 0;
          }

          to {
            width: 8rem;
          }
        }
      `}</style>
    </nav>
  )
}
