const Impressum = () => {
  return (
    <article>
      <h1>Impressum</h1>
      <p>
        <a href="mailto:hallo@wasgeit.ch">Kontakt</a>
      </p>
      <p>
        <a href="https://github.com/bjorndown/wasgeit-next">Source code</a>
      </p>
      <p>
        Betrieben mit <a href="https://vercel.com">vercel</a> und{' '}
        <a href="https://digitalocean.com">Digital Ocean</a>
      </p>
      <style jsx>{`
        article {
          padding: 0.5rem;
        }

        a {
          font-weight: bold;
        }
      `}</style>
    </article>
  )
}

export default Impressum
