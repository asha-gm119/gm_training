import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <form
            className="d-flex"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/welcome");
            }}
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </nav>

      
      <div className="fullpage-boxes">
        <div className="half-box left-box">
          <h2>Left</h2>
        </div>
        <div className="half-box right-box">
          <h2>Right</h2>
        </div>
      </div>
    </div>
    
  );
};

export default Welcome;
