const Impressum = () => {
  return (
    <article>
      <p>
        <a className="back" href="/">
          Zurück
        </a>
      </p>
      <h2>Kontakt</h2>
      <p>
        <a href="mailto:hallo@wasgeit.ch">hallo@wasgeit.ch</a>
      </p>
      <h2>Source</h2>
      <p>
        <a href="https://github.com/bjorndown/wasgeit-next">
          https://github.com/bjorndown/wasgeit-next
        </a>
      </p>

      <style jsx>{`
        article {
          padding: 0.5rem;
        }
      `}</style>
    </article>
  )
}

export default Impressum
