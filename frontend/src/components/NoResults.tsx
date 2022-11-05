export const NoResults = () => (
  <div className="container">
    <h2>
      Da geht nichts. <br />
      Versuch einen anderen Suchbegriff.
    </h2>
    <style jsx>{`
      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100vh;
        text-align: center;
      }

      h2 {
        color: var(--color);
        padding: 0 var(--large-padding);
      }
    `}</style>
  </div>
)
