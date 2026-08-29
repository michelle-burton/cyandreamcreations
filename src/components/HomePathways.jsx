const pathways = [
  {
    kicker: 'The Dream',
    title: 'Made With Intention',
    copy: 'Step into the story, symbols, and cycle at the heart of Cyan Dream Creations.',
    href: '#story',
    link: 'Read The Dream',
  },
  {
    kicker: 'The Oracle',
    title: 'A Mirror for the Unseen',
    copy: 'Meet the four houses and glimpse the symbolic world that is still taking shape.',
    href: '#oracle',
    link: 'Explore The Oracle',
  },
]

function HomePathways() {
  return (
    <section className="home-pathways" aria-label="Explore Cyan Dream">
      <div className="container-xl">
        <div className="row g-4">
          {pathways.map((pathway) => (
            <div className="col-12 col-lg-6" key={pathway.href}>
              <article className="pathway-card">
                <span className="pathway-star" aria-hidden="true">✦</span>
                <p className="section-kicker">{pathway.kicker}</p>
                <h2>{pathway.title}</h2>
                <p>{pathway.copy}</p>
                <a href={pathway.href}>{pathway.link} <span aria-hidden="true">→</span></a>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomePathways
