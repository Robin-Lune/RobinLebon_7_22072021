import React, {useState} from "react";

import { NavLink, useNavigate } from "react-router-dom";
const Header = (searchQuery, setSearchQuery) => {
  const token = JSON.parse(localStorage.token);
  const [burgerStatus, setBurgerStatus] = useState(false);

  // TOGGLERS
  const toggleBurger = () => {
    setBurgerStatus(!burgerStatus);
    // console.log(burgerStatus);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const history = useNavigate();
  const onSubmit = (e) => {
    history.push(`/${searchQuery}`);
    e.preventDefault();
    // console.log(searchQuery);
    // window.location.href = `/${searchQuery.searchQuery}`;

    // window.location.origin = `/${searchQuery}`;
    // console.log(window.location.href);
  };
// BURGER MENU ANIMATION
  const burgerMiddle = document.getElementById("burger-middle");
  const burgerTop = document.getElementById("burger-top");
  const burgerBottom= document.getElementById("burger-bottom");
  
  const transition = () => { 
    if (burgerStatus) {
      burgerTop.style.transform = "rotate(0deg) translateX(0) translateY(0)";
      burgerMiddle.style.opacity = "1";
      burgerBottom.style.transform = "rotate(0deg) translateX(0)translateY(0)";
    }else {
      burgerTop.style.transform = "rotate(-225deg) translateX(3px) translateY(-3px)";
      burgerMiddle.style.opacity = "0";
      burgerBottom.style.transform = "rotate(225deg) translateX(4.5px)translateY(4.5px)";
      
    }
  }

  return (
    <header className="headerContainer">
      
      <img src="../ressources/icon-left-font.png" alt="Logo de Groupomania" />
      <form
        action=""
        className="searchInput"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <label htmlFor="search" className="inactive">
          Rechercher
        </label>
        <input
          type="text"
          placeholder="Rechercher"
          onInput={(e) => setSearchQuery(e.target.value)}
          id="search"
          name="search"
        />
        <div className="search-icon">
          <i className="fas fa-search "></i>
        </div>
      </form>

      <nav className={`nav-right ${burgerStatus ? "" : "menu-false"}`}>
        <ul className="nav-list">
          <li>
            <NavLink
              to="/"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <i className="fas fa-home"></i>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/messages"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <i className="far fa-comments"></i>
            </NavLink>
          </li>
          <li>
            <i className="fas fa-bell"></i>
          </li>
          <li>
            <NavLink
              to={`/account/${token.userId}`}
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <i className="fas fa-user-edit"></i>
            </NavLink>
          </li>
          <li onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </li>
        </ul>
      </nav>
      <div className="burgerContainer" onClick ={function (event) {
                  toggleBurger();
                  transition();
                }} >
        <div className="burger-top" id="burger-top"></div>
        <div className="burger-middle" id="burger-middle" ></div>
        <div className="burger-bottom" id="burger-bottom"></div>
      </div>
    </header>
  );
};

export default Header;
