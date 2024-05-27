import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    document.body.classList.add("notfound-page");

    return () => {
      document.body.classList.remove("notfound-page");
    };
  }, []);

  return (
    <div className="notfound-container" title="404">
      404
      <p className="routeText">Route not found</p>
      <Link to="/" className="notfound-button">
        GO HOME
      </Link>
    </div>
  );
};

export default NotFound;
