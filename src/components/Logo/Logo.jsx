import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Logo.css';

function Logo() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <NavLink className="navLink" to="/">
        <div className="logo-container">
          <div className={isHomePage ? 'logo-home' : 'logo-other'}>
            <div className={isHomePage ? 'page-left-home' : 'page-left-other'}></div>
            <div className={isHomePage ? 'page-right-home' : 'page-right-other'}></div>
          </div>
          <div className="site-names">
            <h1 className={isHomePage ? 'site-name-home' : 'site-name-other'}>Web</h1>
            <h2 className={isHomePage ? 'sub-name-home' : 'sub-name-other'}>Book</h2>
          </div>
        </div>
      </NavLink>
    </>
  );
}

export default Logo;
