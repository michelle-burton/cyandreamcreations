import quantumPom from '../assets/quantum/quantum-pom.png'

const quantumPomVideo = 'https://www.youtube.com/watch?v=9d3sJ5hYtj0'

function QuantumPomSection() {
  return (
    <section className="quantum-pom-section" aria-labelledby="quantum-pom-title">
      <div className="container-xl">
        <div className="quantum-pom-frame">
          <div className="row g-0 align-items-center">
            <div className="col-md-5 col-lg-4">
              <a className="quantum-pom-image-wrap" href={quantumPomVideo} target="_blank" rel="noreferrer">
                <img src={quantumPom} alt="Quantum Pom bounding through colorful waves of light" />
                <span aria-hidden="true">▶</span>
              </a>
            </div>

            <div className="col-md-7 col-lg-8">
              <div className="quantum-pom-copy">
                <p className="section-kicker">Beyond the Dream</p>
                <h2 id="quantum-pom-title">A Note from Quantum Pom</h2>
                <p>
                  Every creation begins with curiosity. Quantum Pom follows that spark into
                  the meeting place of imagination, technology, and human possibility.
                </p>
                <p className="quantum-pom-signoff">A curious companion from Quantum AI Design.</p>
                <a className="dream-button" href={quantumPomVideo} target="_blank" rel="noreferrer">
                  <span aria-hidden="true">✦</span>
                  Meet Quantum Pom
                  <span aria-hidden="true">✦</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuantumPomSection
