import React from 'react'

export const Scroller = (props: { weekNumber: number }) => (
  <nav>
    <ul>
      <li>
        <a className="scroll" href={`/week/${props.weekNumber - 1}`}>
          ◂
        </a>
      </li>
      <li>
        <a className="scroll" href={`/week/${props.weekNumber + 1}`}>
          ▸
        </a>
      </li>
    </ul>
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

      a.scroll {
        padding: 0 var(--large-padding);
      }
    `}</style>
  </nav>
)
