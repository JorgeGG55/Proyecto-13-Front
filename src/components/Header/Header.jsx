import React, { useState } from "react";
import Logo from "../Logo/Logo";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Dropdown from "../Dropdown/Dropdown";
import "./Header.css";

const BookButton = ({ isHomePage, onClick }) => {
  const buttonClass = isHomePage ? "book-button home" : "book-button other";
  const imgSrc = `https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2012/png/iconmonstr-book-1.png&r=${
    isHomePage ? "255&g=255&b=255" : "0&g=0&b=0"
  }`;

  return (
    <button className={buttonClass} onClick={onClick}>
      <img src={imgSrc} alt="Book Icon" height="20px" />
      Books
    </button>
  );
};

const AuthButton = ({ isHomePage, onClick, token }) => {
  const buttonClass = isHomePage ? "loginButton home" : "loginButton other";
  return token ? (
    <Dropdown isHomePage={isHomePage} />
  ) : (
    <NavLink className="navLink" to="/signin" onClick={onClick}>
      <button className={buttonClass}>Login or Register</button>
    </NavLink>
  );
};

const Header = () => {
  const location = useLocation();
  const { token } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const isBooksPage = location.pathname === "/books";
  const isHomePage = location.pathname === "/";

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <header className="header">
        <button
          className={isHomePage ? "hamburger home" : "hamburger other"}
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <div className="header-content">
          <Logo />
          <div className="nav-items">
            {!isBooksPage && (
              <NavLink className="navLink" to="/books">
                <BookButton isHomePage={isHomePage} />
              </NavLink>
            )}
            <AuthButton isHomePage={isHomePage} token={token} />
          </div>
        </div>
        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          {!isBooksPage && (
            <NavLink className="navLink" to="/books" onClick={closeSidebar}>
              <BookButton isHomePage={isHomePage} onClick={closeSidebar} />
            </NavLink>
          )}
          <AuthButton
            isHomePage={isHomePage}
            token={token}
            onClick={closeSidebar}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
