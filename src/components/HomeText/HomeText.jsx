import React from "react";
import { NavLink } from "react-router-dom";
import "./HomeText.css";

function HomeText() {
  return (
    <>
      <div className="home-text">
        <div className="centered-text">
          <h1 className="first-text">EXPLORE A WORLD OF BOOKS</h1>
          <h2 className="second-text">Unlock Your Imagination</h2>
        </div>
        <div className="centered-buttons">
          <NavLink className="navLink" to="books">
            <button className="explore-button">Explore More</button>
          </NavLink>
        </div>
        <div className="scrollMouse">
          <div className="scroll-down-text">SCROLL DOWN</div>
          <div className="mouse"></div>
        </div>
      </div>
    </>
  );
}

export default HomeText;
