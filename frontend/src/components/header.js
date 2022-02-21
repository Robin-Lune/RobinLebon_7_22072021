import React, {useState} from "react";

import { NavLink, useNavigate } from "react-router-dom";
const Header = (searchQuery, setSearchQuery) => {
  const token = JSON.parse(localStorage.token);
  const [burgerStatus, setBurgerStatus] = useState(false);

  const toggleBurger = () => {
    setBurgerStatus(!burgerStatus);
    console.log(burgerStatus);
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
      <div className="burgerContainer" onClick={toggleBurger}>
        <div className="burger"  ></div>
      </div>
    </header>
  );
};

export default Header;
