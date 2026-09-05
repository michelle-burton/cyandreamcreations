import houseCardsImage from '../assets/oracle-four-houses.png'

const houses = [
  { name: 'The House of the Sun', position: '0% center' },
  { name: 'The House of the Moon', position: '33.333% center' },
  { name: 'The House of Creation', position: '66.667% center' },
  { name: 'The House of the Void', position: '100% center' },
]

function OraclePreview() {
  return (
    <section className="oracle-section" id="oracle" aria-labelledby="oracle-title">
      <div className="container-xl">
        <div className="oracle-frame">
          <header className="oracle-copy text-center">
            <p className="section-kicker">A moment of reflection</p>
            <h2 id="oracle-title">Cyan Dream Oracle</h2>
            <p className="oracle-lead">A celestial mirror for the unseen.</p>
            <p className="oracle-statement">It does not predict. It mirrors.</p>
            <p className="oracle-emergence">Something is waiting to emerge.</p>
            <a className="dream-button" href="/oracle">Enter the Oracle ✦</a>
          </header>

          <div className="row g-3 g-xl-4 oracle-house-grid">
            {houses.map((house) => (
              <div className="col-12 col-md-6 col-xl-3" key={house.name}>
                <div
                  className="house-card-crop"
                  role="img"
                  aria-label={house.name}
                  style={{
                    backgroundImage: `url(${houseCardsImage})`,
                    backgroundPosition: house.position,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <a className="section-home-link" href="#top">Return Home <span aria-hidden="true">✦</span></a>
      </div>
    </section>
  )
}

export default OraclePreview
