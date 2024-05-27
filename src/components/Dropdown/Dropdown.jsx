import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getUser } from "../../utils/APIRoutes";
import "./Dropdown.css";

const Dropdown = ({ isHomePage }) => {
  const { token, logout } = useAuth();
  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const isLoansPage = location.pathname === "/myloans";
  const isReviewPage = location.pathname === "/myreviews";

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(getUser, {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [token]);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const arrowIconUrl = `https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2017/png/iconmonstr-arrow-66.png&r=${
    isHomePage ? "255&g=255&b=255" : "0&g=0&b=0"
  }`;

  const arrowIconStyle = {
    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)",
    transition: "transform 0.3s ease",
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="user-info">
      <button className="user-button" onClick={toggleDropdown}>
        <span className={isHomePage ? "user-name-home" : "user-name-other"}>
          {userName}
        </span>
        <img
          src={arrowIconUrl}
          alt="Arrow Icon"
          className="arrow-icon"
          style={arrowIconStyle}
        />
      </button>
      {dropdownOpen && (
        <div className="dropdown-menu">
          {!isLoansPage && (
            <NavLink className="navLink" to="/myloans">
              <button className="dropdownButton">My loans</button>
            </NavLink>
          )}

          {!isReviewPage && (
            <NavLink className="navLink" to="/myreviews">
              <button className="dropdownButton">My reviews</button>
            </NavLink>
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
