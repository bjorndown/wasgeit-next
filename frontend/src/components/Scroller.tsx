import React from 'react'
import { getISOWeek } from 'date-fns'

type Props = { weekNumber: number }

export const Scroller = ({ weekNumber }: Props) => {
  const currentWeekNumber = getISOWeek(new Date())
  return (
    <nav>
      <ul>
        {weekNumber > currentWeekNumber && (
          <li>
            <a className="scroll" href={`/week/${weekNumber - 1}`}>
              ◂
            </a>
          </li>
        )}
        {weekNumber !== currentWeekNumber && (
          <li>
            <a className="scroll" href={`/week/${currentWeekNumber}`}>
              ⦁
            </a>
          </li>
        )}
        <li>
          <a className="scroll" href={`/week/${weekNumber + 1}`}>
            ▸
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
          padding: 0;
          font-size: var(--large-font-size);
        }
      `}</style>
    </nav>
  )
}
