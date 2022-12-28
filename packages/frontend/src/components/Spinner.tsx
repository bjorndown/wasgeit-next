import { useEffect, useState } from 'react'

export const Spinner = () => {
  const [fade, setFade] = useState('in')

  useEffect(() => {
    return () => setFade('out')
  })

  // TODO make fade-in/out work

  return (
    <div className={['container', `fade-${fade}`].join(' ')}>
      <h1>?!</h1>
      {/*language=CSS*/}
      <style jsx>
        {`
          .fade-in {
            transition: opacity 1s ease-in;
          }

          .fade-out {
            opacity: 0;
            transition: opacity 1s ease-out;
          }

          .container {
            z-index: 1;
            width: 100%;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          h1 {
            color: var(--color);
            font-size: var(--large-font-size);
            animation: 3s infinite normal rotate;
          }

          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  )
}
