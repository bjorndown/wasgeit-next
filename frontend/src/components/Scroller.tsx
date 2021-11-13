import React from 'react'
import { getISOWeek } from 'date-fns'

type Props = {
  weekNumber: number
  year: number
}

export const Scroller = ({ weekNumber, year }: Props) => {
  const currentWeekNumber = getISOWeek(new Date())

  return (
    <nav>
      <ul>
        {weekNumber > currentWeekNumber && (
          <li>
            <a title="Gehe zur letzen Woche" className="scroll" href={`/week/${year}-${weekNumber - 1}`}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="100,0 0,50 100,100" />
              </svg>
            </a>
          </li>
        )}
        {weekNumber !== currentWeekNumber && (
          <li>
            <a title="Gehe zur aktuellen Woche" className="scroll" href={`/week/${year}-${currentWeekNumber}`}>
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" />
              </svg>
            </a>
          </li>
        )}
        <li>
          <a title="Gehe zur nächsten Woche" className="scroll" href={`/week/${year}-${weekNumber + 1}`}>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,0 100,50 0,100" />
            </svg>
          </a>
        </li>
      </ul>
      {/* language=css*/}
      <style jsx>{`
        nav ul {
          display: flex;
          flex-flow: row wrap;
          justify-content: space-around;
          align-items: center;
          list-style: none;
          font-size: var(--large-font-size);
          margin-top: var(--large-padding);
        }

        svg {
          height: var(--medium-font-size);
          fill: var(--color);
        }
      `}</style>
    </nav>
  )
}
