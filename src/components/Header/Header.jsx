import React from "react";
import Logo from "../Logo/Logo";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Dropdown from "../Dropdown/Dropdown";
import "./Header.css";

const BookButton = ({ isHomePage }) => {
  const buttonClass = isHomePage ? "book-button-home" : "book-button-other";
  const imgSrc = `https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2012/png/iconmonstr-book-1.png&r=${
    isHomePage ? "255&g=255&b=255" : "0&g=0&b=0"
  }`;

  return (
    <button className={buttonClass}>
      <img src={imgSrc} alt="Book Icon" height="20px" />
      Books
    </button>
  );
};

const Header = () => {
  const location = useLocation();
  const { token } = useAuth();

  const isBooksPage = location.pathname === "/books";
  const isHomePage = location.pathname === "/";

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Logo />
          {!isBooksPage && (
            <NavLink className="navLink" to="/books">
              <BookButton isHomePage={isHomePage} />
            </NavLink>
          )}
          {token ? (
            <Dropdown isHomePage={isHomePage} />
          ) : (
            <NavLink className="navLink" to="/signin">
              <button
                className={
                  isHomePage ? "loginButton-home" : "loginButton-other"
                }
              >
                Login or Register
              </button>
            </NavLink>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
