function SiteFooter() {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <>
      <section className="signup-section" id="join" aria-labelledby="signup-title">
        <div className="container-xl">
          <div className="signup-frame text-center">
            <div className="signup-star" aria-hidden="true">✦</div>
            <p className="section-kicker">The Dream List</p>
            <h2 id="signup-title">Stay Close to What Is Emerging</h2>
            <p className="signup-copy">
              New sun catchers, Oracle updates, and quiet notes from the world
              of Cyan Dream—sent with intention.
            </p>

            <form className="signup-form" onSubmit={handleSubmit}>
              <label className="visually-hidden" htmlFor="dream-list-email">
                Email address
              </label>
              <input
                id="dream-list-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="your@email.com"
                aria-describedby="signup-note"
              />
              <button type="submit">Join the Dream List</button>
            </form>

            <p className="layout-note" id="signup-note">
              Signup connection will be added later
            </p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container-xl">
          <div className="row gy-4 align-items-center">
            <div className="col-lg-4 text-center text-lg-start">
              <a className="brand-mark footer-brand" href="#top">
                <span className="brand-name">Cyan Dream</span>
                <span className="brand-subtitle">Creations</span>
              </a>
            </div>

            <div className="col-lg-4">
              <nav aria-label="Footer navigation">
                <ul className="footer-links">
                  <li><a href="#shop">Sun Catchers</a></li>
                  <li><a href="#story">Our Story</a></li>
                  <li><a href="#oracle">Oracle</a></li>
                </ul>
              </nav>
            </div>

            <div className="col-lg-4 text-center text-lg-end">
              <p className="footer-cycle">Dream · Become · Illuminate · Reflect</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Cyan Dream Creations</p>
            <p>Created with reflection, intention, and care.</p>
          </div>

          <p className="quantum-footer-link">
            Curious about the ideas and technology behind the studio?{' '}
            <a href="https://www.youtube.com/@QuantumAIDesign" target="_blank" rel="noreferrer">
              Visit Quantum AI Design
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}

export default SiteFooter
