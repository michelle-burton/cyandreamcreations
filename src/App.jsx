
function App() {
  return (
    <>
      <nav className="navbar navbar-expand-md bg-light border-bottom">
        <div className="container">
          <a className="navbar-brand fs-3" href="#">
            Cyandream
          </a>

          <div className="ms-auto d-flex gap-3 align-items-center">
            <a className="nav-link" href="#shop">Shop</a>
            <a className="nav-link" href="#story">Our Story</a>
            <button className="btn btn-outline-dark">
              Cart (0)
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="container py-5">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6 py-5">
              <p className="text-uppercase text-secondary">
                Handmade with intention
              </p>

              <h1 className="display-2">
                Catch the light. Carry the magic.
              </h1>

              <p className="lead my-4">
                Handmade sun catchers created to fill everyday spaces with
                color, wonder, and intention.
              </p>

              <a className="btn btn-dark btn-lg" href="#shop">
                Shop Sun Catchers
              </a>
            </div>

            <div className="col-lg-6">
              <div className="bg-light rounded-4 p-5 text-center">
                Your main sun-catcher photo will go here
              </div>
            </div>
          </div>
        </section>

        <section id="shop" className="bg-light py-5">
          <div className="container">
            <h2 className="display-5 text-center mb-5">
              Made for moments of wonder
            </h2>

            <div className="row g-4">
              {['Luna', 'Morning Prism', 'Solstice'].map((name) => (
                <div className="col-md-4" key={name}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body p-4">
                      <div className="bg-secondary-subtle rounded mb-4 p-5 text-center">
                        Product photo
                      </div>

                      <h3 className="h5">{name} Sun Catcher</h3>
                      <p>$48.00</p>

                      <button className="btn btn-outline-dark w-100">
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default App