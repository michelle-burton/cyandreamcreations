const cycle = [
  { symbol: '🌌', label: 'Dream' },
  { symbol: '🌀', label: 'Become' },
  { symbol: '☀', label: 'Illuminate' },
  { symbol: '☾', label: 'Reflect' },
]

function StorySection() {
  return (
    <section className="story-section" id="story" aria-labelledby="story-title">
      <div className="container-xl">
        <div className="story-frame">
          <div className="row g-0 align-items-stretch">
            <div className="col-lg-7">
              <div className="story-copy">
                <p className="section-kicker">The Dream</p>
                <h2 id="story-title">
                  Created for dreamers, seekers, and quiet ritualists
                </h2>

                <p>
                  Cyan Dream Creations was born from late nights, warm tea, and
                  the belief that everyday objects can carry meaning. It is for
                  those who notice the light changing through a window, who make
                  room for reflection, and who find something sacred in small,
                  intentional moments.
                </p>

                <blockquote>
                  Every cozy corner deserves something that glows.
                </blockquote>

                <p>
                  Each creation is thoughtfully designed around celestial
                  wonder, inner knowing, and the quiet beauty of becoming.
                </p>
              </div>
            </div>

            <div className="col-lg-5">
              <aside className="cycle-panel" aria-label="The Cyan Dream cycle">
                <div className="cycle-star" aria-hidden="true">✦</div>
                <p className="cycle-intro">The Cyan Dream Cycle</p>

                <ol className="cycle-list">
                  {cycle.map((step, index) => (
                    <li key={step.label}>
                      <span className="cycle-symbol" aria-hidden="true">
                        {step.symbol}
                      </span>
                      <span>{step.label}</span>
                      {index < cycle.length - 1 && (
                        <span className="cycle-arrow" aria-hidden="true">→</span>
                      )}
                    </li>
                  ))}
                </ol>

                <p className="cycle-note">
                  A movement from possibility into form, from illumination into
                  reflection—and back to the dream again.
                </p>
              </aside>
            </div>
          </div>
        </div>
        <a className="section-home-link" href="#top">Return Home <span aria-hidden="true">✦</span></a>
      </div>
    </section>
  )
}

export default StorySection
