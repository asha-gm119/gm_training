import React from "react";

const Home = () => {
  return (
    
    <div className="container mt-5">
      {/* Header */}
      <nav class="navbar bg-body-tertiary">
  <div class="container-fluid">
    <form class="d-flex" role="search">
      <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
      <button class="btn btn-outline-success" type="submit">Search</button>
    </form>
  </div>
</nav>

      {/* Grid Section */}
      <div className="row align-items-center">
        {/* Left Column - Text */}
        <div className="col-md-6">
          <h3>About This Car</h3>
          <p>
            This car offers outstanding performance and design. Built with a
            powerful engine and cutting-edge technology, it provides a smooth,
            efficient, and luxurious driving experience.
          </p>
        </div>

        {/* Right Column - Image */}
        <div className="col-md-6 text-center">
          <img
            src="https://samples-files.com/samples/images/jpg/1920-1080-sample.jpg"
            alt="Car"
            className="img-fluid rounded shadow"
          />
        </div>
      </div>
    </div>
    
  );
};

export default Home;
