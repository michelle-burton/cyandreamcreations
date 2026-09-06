import oracleBannerLeft from '../assets/oracle-banner-left-v1.png'
import oracleBannerRight from '../assets/oracle-banner-right-v1.png'
import oracleBannerScene from '../assets/oracle-home-banner-v2.png'

function HomePathways() {
  return (
    <section className="home-pathways" aria-label="Explore the Cyan Dream Oracle">
      <div className="container-xl">
        <a className="oracle-home-banner" href="/oracle" aria-label="Explore the Cyan Dream Oracle">
          <img className="oracle-banner-scene" src={oracleBannerScene} alt="" aria-hidden="true" />
          <span className="oracle-banner-mobile-art" aria-hidden="true">
            <img className="oracle-banner-left" src={oracleBannerLeft} alt="" />
            <img className="oracle-banner-right" src={oracleBannerRight} alt="" />
          </span>

          <span className="oracle-banner-copy">
            <span className="oracle-banner-title">Cyan Dream Oracle</span>
            <span className="oracle-banner-button">Explore the Oracle <b aria-hidden="true">✦</b></span>
          </span>
        </a>
      </div>
    </section>
  )
}

export default HomePathways
